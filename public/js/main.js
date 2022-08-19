
//Declare global variables to track simulator size
const [ROW_PIXELS, COL_PIXELS, DEPTH_PIXELS] = [40, 40, 1]
const TOTAL_PIXEL_COUNT = ROW_PIXELS * COL_PIXELS * DEPTH_PIXELS

//Track particles for simulation
let totalParticlesAdded = 0

const simulator = document.getElementById('simulator')

//Generate the game board
const createSimulationTopology = () => {
  simulator.innerHTML = ''
  for (let x = 0; x < ROW_PIXELS; x++) {
    for (let y = 0; y < COL_PIXELS; y++) {
      for (let z = 0; z < DEPTH_PIXELS; z++) {
        simulator.innerHTML += `<div class="pixel empty" id="pixel-${x}-${y}-${z}"></div>`
      }
    }
  }
  return new Promise();
}

//Shorten references to game pixels
const pixels = document.getElementsByClassName('pixel')
console.log(pixels)
// Array.from(pixels).forEach(pixel => {
//   pixel.style.color = "yellow"
// })

let seedPosition = 0

//create the randomly generated food items in the game board
const createSeed = (x=0, y=0, z=0) => {
  seedPosition = [
    Math.floor(Math.random()*ROW_PIXELS), 
    Math.floor(Math.random()*COL_PIXELS),
    Math.floor(Math.random()*DEPTH_PIXELS)
  ]
  console.log(seedPosition, `pixel-${seedPosition.join('-')}`)
  let arrayPosition = seedPosition[0]*ROW_PIXELS + seedPosition[1]*COL_PIXELS + seedPosition[2]*DEPTH_PIXELS
  let seedling = document.getElementById(`pixel-${seedPosition.join('-')}`)
  // document.getElementById(`pixel-${seedPosition.join('-')}`).classList.add('seed')
  seedling.style.color = 'red'
}
// createSeed()

// let snakeCurrentDirection = RIGHT_DIR

//Make sure that the user input is valid and change snake direction variable
// const changeDirection = newDirectionCode => {
//   if(newDirectionCode == snakeCurrentDirection) return;

//   if (newDirectionCode == LEFT_DIR && snakeCurrentDirection !== RIGHT_DIR) {
//     snakeCurrentDirection = newDirectionCode
//   } else if(newDirectionCode == UP_DIR && snakeCurrentDirection !== DOWN_DIR) {
//     snakeCurrentDirection = newDirectionCode
//   }else if (newDirectionCode == RIGHT_DIR && snakeCurrentDirection !== LEFT_DIR) {
//     snakeCurrentDirection = newDirectionCode
//   } else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection !== UP_DIR) {
//     snakeCurrentDirection = newDirectionCode
//   }
// }

//set starting point for snake on load
// let currentHeadPosition = TOTAL_PIXEL_COUNT/2

// //Set initial length
// let snakeLength = 200

// //Start moving snake, wrap around to other side of screen if needed
// const enterParticle = () => {
//   switch (snakeCurrentDirection) {
//     case LEFT_DIR:
//       --currentHeadPosition
//       const isHeadAtLeft = currentHeadPosition % LINE_PIXEL_COUNT == LINE_PIXEL_COUNT - 1 || currentHeadPosition < 0
//       if (isHeadAtLeft) {
//         currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
//       }
//     break;
//     case RIGHT_DIR:
//       ++currentHeadPosition
//       const isHeadAtRight = currentHeadPosition % LINE_PIXEL_COUNT == 0
//       if (isHeadAtRight) {
//         currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
//       }
//       break;
//     case UP_DIR :
//       currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
//       const isHeadAtTop = currentHeadPosition < 0
//       if (isHeadAtTop) {
//         currentHeadPosition = currentHeadPosition + TOTAL_PIXEL_COUNT
//       }
//       break;
//     case DOWN_DIR: 
//       currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
//       const isHeadAtBottom = currentHeadPosition > TOTAL_PIXEL_COUNT -1
//       if (isHeadAtBottom) {
//         currentHeadPosition = currentHeadPosition - TOTAL_PIXEL_COUNT
//       }
//       break;
//       default:
//       break;
//     }

//     //Accessed the correct pixel within the HTML collection
//     let nextSnakeHeadPixel = pixels[currentHeadPosition]

//     //Check if snake head is about to intersect with its own body
//     if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
//       clearInterval(updateInterval)
//       alert(`You have eaten ${totalFoodEaten} food and traveled ${totalDistanceTraveled} blocks.`)
//       window.location.reload()
//     }

//     //Assuming an empty pixel, add snake body styling
//     nextSnakeHeadPixel.classList.add("snakeBodyPixel")

//     //Remove snake styling to keep snake appropriate length
//     setTimeout(() => {
//       nextSnakeHeadPixel.classList.remove("snakeBodyPixel")
//     }, snakeLength)

//     //Describe what to do if the snake encounters a food pixel
//     if (currentHeadPosition == seedPosition) {
//       console.log('eat food')
//       totalFoodEaten++
//       document.getElementById("pointsEarned").innerText = totalFoodEaten
//       snakeLength = snakeLength + 100
//       createSeed()
//     }

//     //Added distance traveled count
//     totalDistanceTraveled++
//     document.getElementById("blocksTraveled").innerText = totalDistanceTraveled
// }

//Call initial functions to create board and start game
createSimulationTopology()
 



//Set animation speed
let updateInterval = setInterval(enterParticle, 100)

addEventListener("keydown", e => changeDirection(e.keyCode))

//Adding variables for on-screen buttons
// const leftButton  = document.getElementById('leftButton')
// const rightButton  = document.getElementById('rightButton')
// const upButton  = document.getElementById('upButton')
// const downButton  = document.getElementById('downButton')

// //Add listeners for on-screen buttons
// leftButton.onclick = () => changeDirection(LEFT_DIR)
// rightButton.onclick = () => changeDirection(RIGHT_DIR)
// upButton.onclick = () => changeDirection(UP_DIR)
// downButton.onclick = () => changeDirection(DOWN_DIR)