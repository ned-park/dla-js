let pixels = Array.from(document.querySelectorAll('.pixel'))
const sim = document.querySelector('#simulator')
const ROW = Number(sim.getAttribute('data-row'))
const COL = Number(sim.getAttribute('data-col'))

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
  console.log(typeof m)
  let result = (m + n) 
  if (result < 0) {
    throw new Error(`result: ${result} for m: ${m}, n: ${n} is negative`)
  }
  return result % n
}

function hasNeighbours(x, y) {
  // console.log(x,y)
  for (let i = -1; i <=1; i++) {
    let n_x = getEquivalenceClassModN(x+i, ROW)
    let n_y = getEquivalenceClassModN(y+i, COL)
    // console.log(x, y, n_x, n_y)
    if (n_y != y || n_x != x) 
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
    let [, x, y] = particle.getAttribute('id').split('-').map(n => Number(n))
    console.log(x, y)
    let direction = Math.floor(Math.random()*4)
    console.log(direction, ROW, COL)
    switch (direction) { // topologically closed simulation
      case 0: // up
        console.log(y, y-1, getEquivalenceClassModN(y-1, COL))
        y = getEquivalenceClassModN(y-1, COL)
        break;
      case 1: // right
        console.log(x, x+1, getEquivalenceClassModN(x+1, ROW))
        x = getEquivalenceClassModN(x+1, ROW)
        break;
      case 2: // down
        console.log(y, y+1, getEquivalenceClassModN(y+1, COL))
        y = getEquivalenceClassModN(y+1, COL)
        break;
      case 3: // left
      console.log(x, x-1, getEquivalenceClassModN(x-1, ROW))
        x = getEquivalenceClassModN(x-1, ROW)
        break;
      default: // do nothing
        console.log('default case somehow reached')
        break;
    }
    console.log(x,y)
    
    // console.log(x,y)
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
    // looseParticles = looseParticles.filter(particle => {
      
    // })
    looseParticles.pop()
  }
    

}

runSimulation()

// //Set animation speed
// let updateInterval = setInterval(enterParticle, 100)

// addEventListener("keydown", e => changeDirection(e.keyCode))
