let pixels = Array.from(document.querySelectorAll('.pixel'))
const sim = document.querySelector('#simulator')
const ROW = sim.getAttribute('data-row')
const COL = sim.getAttribute('data-col')

const PARTICLES = 300 // change to ensure much less than pixels.length

function createSeed(x=0, y=0) {
  const seed = document.querySelector(`#pixel-${x}-${y}`)
  seed.classList.remove('occupied', 'empty')
  seed.classList.add('occupied')
  return seed;
}

function getRandomPixel() {
  return pixels[Math.floor(Math.random()*pixels.length)]
}

function getEquivalenceClassModN(m, n) {
  return (m + n) % n
}

function hasNeighbours(x, y) {
  for (let i = -1; i <=1; i++) {
    let n_x = getEquivalenceClassModN(x+i, ROW)
    let n_y = getEquivalenceClassModN(y+i, COL)
    console.log(x, y, n_x, n_y)
    if (n_y == y && n_x == x) 
    continue
    // else if (document.querySelector(`#pixel-${n_x}-${n_y}`).classList.includes('occupied')) {
      // return true
    // }
  }
  return false
}

function enterParticle(pixel=getRandomPixel()) {
  while (!pixel.classList.contains('empty')) {
    pixel = getRandomPixel()
  }
  return pixel
}

function moveParticles(particlesArray) {
  return particlesArray.map(particle => {
    let [_, x, y] = particle.getAttribute('id').split('-')
    let direction = Math.floor(Math.random()*4)
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
        x = getEquivalenceClassModN(x-1,ROW)
        break;
      default: // do nothing
        break;
    }
    
    particle.classList.remove('loose')
    let newSpot = document.querySelector(`#pixel-${x}-${y}`)
    hasNeighbours(x, y) ? newSpot.classList.add('occupied') : newSpot.classList.add('loose')
    
    return newSpot
  })
}


function runSimulation() {
  createSeed(10,10)
  
  let looseParticles = []
  
  for (let i = 0; i < PARTICLES; i++) {
    let particle = enterParticle()
    // particle.classList.remove('empty')
    particle.classList.add('loose')
    looseParticles.push(particle)
  }

  while (looseParticles.length > 0) {
    looseParticles = moveParticles(looseParticles)
    looseParticles = looseParticles.filter(particle => {
      particle.classList.includes('loose')
    })
  }
    

}

runSimulation()

// //Set animation speed
// let updateInterval = setInterval(enterParticle, 100)

// addEventListener("keydown", e => changeDirection(e.keyCode))
