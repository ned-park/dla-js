let pixels = Array.from(document.querySelectorAll('.pixel'))
const sim = document.querySelector('#simulator')
const ROW = Number(sim.getAttribute('data-row'))
const COL = Number(sim.getAttribute('data-col'))
// const DEPTH = Number(sim.getAttribute('data-depth')) || 1 // assume 2D once more
const NUMBER_OF_DIRECTIONS = Number(sim.getAttribute('data-dimensions')) * 2 || 4 // assume 2D, change to *3 -1 if 8/26 directions are desired

let intervalFrequency = 20 //ms

const PARTICLES = 800 // change to ensure much less than pixels.length

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
  return (m + n) %n
}

function hasNeighbours(x, y) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let n_x = getEquivalenceClassModN(x+i, ROW)
      let n_y = getEquivalenceClassModN(y+j, COL)
      if (n_y == y && n_x == x) 
        continue
      else if (document.querySelector(`#pixel-${n_x}-${n_y}`).classList.contains('occupied')) {
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
    return !hasNeighbours(x, y)
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

