const sim = document.querySelector('#simulator')
const ROW = Number(sim.getAttribute('data-row'))
const COL = Number(sim.getAttribute('data-col'))
let openTopology = sim.getAttribute('data-open-topology') == "true"

const beginBtn = document.querySelector('#begin').addEventListener('click', runSimulation)
const resetBtn = document.querySelector('#reset').addEventListener('click', resetSimulation)
const topology = document.querySelector('#topology').addEventListener('click', changeTopology)

function changeTopology() {
  openTopology = !openTopology
}

function resetSimulation() {
  pixels.forEach(pixel => {
    pixel.classList.remove('loose')
    pixel.classList.remove('occupied')
  })
  runSimulation();
}


let pixels = Array.from(document.querySelectorAll('.pixel')).filter(pixel => {
  let [, x, y] = pixel.getAttribute('id').split('_')
  return x >= 0 && y >= 0 && x < ROW && y < COL
})

document.styleSheets[0].insertRule(`.pixel { width:${40/ROW}vw; height:${40/COL}vw;  }`, 0)

// const DEPTH = Number(sim.getAttribute('data-depth')) || 1 // assume 2D once more
const NUMBER_OF_DIRECTIONS = Number(sim.getAttribute('data-dimensions')) * 2 || 8 // assume 2D, change to *3 -1 if 8/26 directions are desired

let intervalFrequency = 20 //ms

const PARTICLES = Math.floor(ROW*COL*0.05) // 5% of space available space is filled with particles

function createSeed(x=0, y=0) {
  const seed = document.querySelector(`#pixel_${x}_${y}`)
  seed.classList.remove('loose')
  seed.classList.add('occupied')
  seed.style.background = "black"
  return seed;
}

function getRandomInt(n) {
  return Math.floor(Math.random()*n)
}

function getRandomPixel() {
  return pixels[getRandomInt(pixels.length)]
}

function getEquivalenceClassModN(m, n) {
  return openTopology
    ? m
    : (m + n) % n
}

function outOfBounds(x, y) {
  return (x < 0 || y < 0 || x >= ROW || y >= COL)
}

function hasNeighbours(x, y) {
  if (openTopology && outOfBounds(x, y)) {
    return false
  }

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let nx = getEquivalenceClassModN(x+i, ROW)
      let ny = getEquivalenceClassModN(y+j, COL)
      if (ny == y && nx == x) {
        continue
      } else if (document.querySelector(`#pixel_${nx}_${ny}`).classList.contains('occupied')) {
        return true
      }
    }
  }
  return false
}

function enterParticle(pixel=getRandomPixel()) {
  while (pixel.classList.contains('occupied') || pixel.classList.contains('loose') || pixel.classList.contains('hidden')) {
    pixel = getRandomPixel()
  }
  return pixel
}

function moveParticles(particlesArray) {
  let updatedParticlesArray = []

  let positioned = particlesArray.filter(particle => {
    let [, x, y] = particle.getAttribute('id').split('_').map(n => Number(n))
    return hasNeighbours(x, y)
  })

  positioned.forEach( particle => {
    particle.classList.remove('loose')
    particle.classList.add('occupied')
  })

  particlesArray = particlesArray.filter(particle => {
    let [, x, y] = particle.getAttribute('id').split('_').map(n => Number(n))

    return !hasNeighbours(x, y) && !outOfBounds(x, y)
  })

  for (let i = 0; i < particlesArray.length; i++) {
    let [, x, y] = particlesArray[i].getAttribute('id').split('_').map(n => Number(n))
    let direction = getRandomInt(NUMBER_OF_DIRECTIONS)
    switch (direction) { // topologically closed simulation
      case 0: // up
        y = getEquivalenceClassModN(y-1, COL)
        break;
      case 1: // right
        x = getEquivalenceClassModN(x+1, ROW)
        break;
      case 2: // down
        y = getEquivalenceClassModN(y+1, COL)
        break;
      case 3: // left
        x = getEquivalenceClassModN(x-1, ROW)
        break;
      case 4: // down right
        x = getEquivalenceClassModN(x+1, ROW)
        y = getEquivalenceClassModN(y+1, COL)
        break;
      case 5: // up right
        x = getEquivalenceClassModN(x+1, ROW)
        y = getEquivalenceClassModN(y-1, COL)
        break;
      case 6: // up left
        x = getEquivalenceClassModN(x-1, ROW)
        y = getEquivalenceClassModN(y-1, COL)
        break;
      case 7: // down left
        x = getEquivalenceClassModN(x-1, ROW)
        y = getEquivalenceClassModN(y+1, COL)
        break;  
      default: // do nothing
        throw new Error(`Invalid direction: ${direction}`)
        break;
    }
    
    if (openTopology) {
      particlesArray = particlesArray.filter(particle => {
        let [, x, y] = particle.getAttribute('id').split('_').map(n => Number(n)) // deal with - problem...
        return !outOfBounds(x, y)
      })
    }

    particlesArray[i].classList.remove('loose')
    let newSpot = document.querySelector(`#pixel_${x}_${y}`)
    // if (hasNeighbours(x, y)) {
      // newSpot.classList.add('occupied') 
    // } else {
      newSpot.classList.add('loose')
      updatedParticlesArray.push(newSpot) // can't push unless we're also removing otherstuff, needs to be a separate array
    // }
  }

  return updatedParticlesArray
}

function runSimulation() {
  for (let i = 0; i < ROW; i++) {
    createSeed(0, i)
  }
  
  let looseParticles = []
  
  for (let i = 0; i < PARTICLES; i++) {
    let particle = enterParticle()
    particle.classList.add('loose')
    looseParticles.push(particle)
  }
 
  const moveInterval = setInterval(() => {
    looseParticles = moveParticles(looseParticles) 
    if (looseParticles.length == 0) stopMoving()
  }, intervalFrequency);

  moveInterval
  
  function stopMoving() {
    console.log('simulation ended')
    clearInterval(moveInterval);
  }
}

runSimulation()
