let pixels = Array.from(document.querySelectorAll('.pixel'))
const sim = document.querySelector('#simulator')
const ROW = Number(sim.getAttribute('data-row'))
const COL = Number(sim.getAttribute('data-col'))
const OPEN_TOPOLOGY = sim.getAttribute('data-open-topology') == "true"
console.log(OPEN_TOPOLOGY)
// const DEPTH = Number(sim.getAttribute('data-depth')) || 1 // assume 2D once more
const NUMBER_OF_DIRECTIONS = Number(sim.getAttribute('data-dimensions')) * 2 || 4 // assume 2D, change to *3 -1 if 8/26 directions are desired

let intervalFrequency = 20 //ms

const PARTICLES = Math.floor(ROW*COL*0.1) // 10% of space is filled with particles

function createSeed(x=0, y=0) {
  const seed = document.querySelector(`#pixel-${x}-${y}`)
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
  return OPEN_TOPOLOGY
    ? m
    : (m + n) % n
}

function outOfBounds(x, y) {
  return (x < 0 || y < 0 || x >= ROW || y >= COL)
}

function hasNeighbours(x, y) {
  if (OPEN_TOPOLOGY && outOfBounds(x, y)) {
    return false
  }

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let nx = getEquivalenceClassModN(x+i, ROW)
      let ny = getEquivalenceClassModN(y+j, COL)
      console.log(document.querySelector(`#pixel-${nx}-${ny}`).length)
      if (ny == y && nx == x) {
        continue
      } else if (document.querySelector(`#pixel-${nx}-${ny}`).classList.contains('occupied')) {
        return true
      }
    }
  }
  return false
}

function enterParticle(pixel=getRandomPixel()) {
  while (pixel.classList.contains('occupied') || pixel.classList.contains('loose')) {
    pixel = getRandomPixel()
  }
  return pixel
}

function moveParticles(particlesArray) {
  let updatedParticlesArray = []

  let positioned = particlesArray.filter(particle => {
    let [, x, y] = particle.getAttribute('id').split('-').map(n => Number(n))
    return hasNeighbours(x, y)
  })

  positioned.forEach( particle => {
    particle.classList.remove('loose')
    particle.classList.add('occupied')
  })

  particlesArray = particlesArray.filter(particle => {
    let [, x, y] = particle.getAttribute('id').split('-').map(n => Number(n))
    return !hasNeighbours(x, y) && !outOfBounds(x, y)
  })

  for (let i = 0; i < particlesArray.length; i++) {
    let [, x, y] = particlesArray[i].getAttribute('id').split('-').map(n => Number(n))
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
      default: // do nothing
        throw new Error(`Invalid direction: ${direction}`)
        break;
    }
    
    if (OPEN_TOPOLOGY) {
      particlesArray = particlesArray.filter(particle => {
        console.log(particle.getAttribute('id')).split('-').length
        // let [, x, y] = particle.getAttribute('id').split('-').map(n => Number(n)) // deal with - problem...
        // return !outOfBounds(x, y)
      })
    }

    particlesArray[i].classList.remove('loose')
    let newSpot = document.querySelector(`#pixel-${x}-${y}`)
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
  createSeed(10,10)
  
  let looseParticles = []
  
  for (let i = 0; i < PARTICLES; i++) {
    let particle = enterParticle()
    particle.classList.add('loose')
    looseParticles.push(particle)
  }
 

  setInterval(() => {
    looseParticles = moveParticles(looseParticles)  
    console.log(looseParticles.length)
  }, intervalFrequency);
  

}

runSimulation()

