let c = document.getElementById("canvas");
let playerOneScore = document.getElementById("player1")
let playerTwoScore = document.getElementById("player2")
let snakeWins = 0
let snake2Wins = 0
let ctx = c.getContext("2d");

class Grid {
  constructor(gridsize, boxSize) {
    this.gridSize = gridsize
    this.boxSize = boxSize
    this.blocks =  this.calculateBlocks(),
    this.gridBlocks = this.calculateGridBlocks()
    this.snakes = []
  }
  calculateBlocks () {
    return this.gridSize / this.boxSize
  }
  calculateGridBlocks () {
    return this.blocks % 2 == 1 ? this.blocks : this.blocks+1
  }
  drawBackground () {
    let colors = [[30, 270, 9], [36, 230, 11]]
    let color = 0
    for (let x = 0; x < grid.gridBlocks; x++) {
      for (let y = 0; y < grid.gridBlocks; y++) {
        ctx.fillStyle = `rgb(${colors[color][0]}, ${colors[color][1]}, ${colors[color][2]})`
        ctx.fillRect(x*grid.boxSize, y*grid.boxSize, grid.boxSize, grid.boxSize)
        color = (color + 1) % 2
      }
    }
  }
}
const grid = new Grid(300, 10)

class Snake {
  constructor(adjuster, directions) {
      this.position = [[adjuster+(Math.floor(grid.blocks/2)), Math.floor(grid.blocks/2)],
                [adjuster+Math.floor(grid.blocks/2), Math.floor(grid.blocks/2)+1],
                [adjuster+Math.floor(grid.blocks/2), Math.floor(grid.blocks/2)+2]]
      this.directionalVelocity = {x:0, y:-1}
      this.color = `rgb(0, 0, 0)`
      this.currentDirection = directions[1]
      this.directions = {up: directions[1],
                         left: directions[0],
                         down: directions[3],
                         right: directions[2],}
  }
  moveSnake(addToSnake) {
    let newPosition = [(this.position[0][0]+this.directionalVelocity.x + grid.blocks) % grid.blocks,
                       (this.position[0][1]+this.directionalVelocity.y + grid.blocks) % grid.blocks]
    if (!addToSnake) {
      this.position.pop()
    }
    this.position.unshift(newPosition)
  }
  checkStillIn() {
    for (let i=0; i<this.position.length; i++) {
      for (let j=0; j<this.position.length; j++) {
        if (i != j && this.position[i][0] == this.position[j][0] && this.position[i][1] == this.position[j][1]){
          return false
        }
      }
    }
    return true
  }
  drawSnake() {
    for (let i=0; i < this.position.length; i++) {
      ctx.fillStyle = this.color
      ctx.fillRect(this.position[i][0]*grid.boxSize, this.position[i][1]*grid.boxSize, grid.boxSize, grid.boxSize)
    }
  }
  foundFood(foodPosition) {
    if (this.position[0][0] == foodPosition[0] && this.position[0][1] == foodPosition[1]){
        return true
      }
    return false
  }
  checkForCollision(otherSnake) {
    for (let i = 0; i < otherSnake.length; i++) {
      if (this.position[0][0] == otherSnake[i][0] && this.position[0][1] == otherSnake[i][1]){
        return true
      }
    }
    return false
  }
  changeInDirection(keyPressed) {
    // Snake Left key press
    if (keyPressed === this.directions.left && this.currentDirection != this.directions.right) {
      this.currentDirection = this.directions.left
      this.directionalVelocity.x = -1;
      this.directionalVelocity.y = 0;
    }
    // Snake Up key press
    if (keyPressed === this.directions.up && this.currentDirection != this.directions.down) {
      this.currentDirection = this.directions.up
      this.directionalVelocity.x = 0;
      this.directionalVelocity.y = -1;
    }
    // Snake Right key press
    if (keyPressed === this.directions.right && this.currentDirection != this.directions.left) {
      this.currentDirection = this.directions.right
      this.directionalVelocity.x = 1;
      this.directionalVelocity.y = 0;
    }
    // Snake Down key press
    if (keyPressed === this.directions.down && this.currentDirection != this.directions.up) {
      this.currentDirection = this.directions.down
      this.directionalVelocity.x = 0;
      this.directionalVelocity.y = 1;
    }
  }

}

class Food {
  constructor () {
    this.position = this.findPlace()
    this.color = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*128)}, ${Math.floor(Math.random()*256)})`
  }
  findPlace() {
    let newPosition = [Math.floor(Math.random() * grid.blocks),
                       Math.floor(Math.random() * grid.blocks)]
    for (let i=0; i<snake.position.length; i++) {
      if (snake.position[i][0] == newPosition[0] && snake.position[i][1] == newPosition[1]){
        this.findPlace()
      }
    }
    return newPosition
  }
  drawFood() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position[0] * grid.boxSize, this.position[1] * grid.boxSize, grid.boxSize, grid.boxSize)
  }
}


const main = () => {
  let gameSpeed = 100
    setTimeout(function onTick() {
    changingDirection = false
    grid.drawBackground()
    if (snake.checkForCollision(snake2.position) && snake2.checkForCollision(snake.position)) {
      snake = new Snake(-1, [65, 87, 68, 83])
      snake2 = new Snake(1, [37, 38, 39, 40])
    }
    else if (!snake.checkStillIn() || snake.checkForCollision(snake2.position)) {
      snake2Wins += snake2.position.length
      snake = new Snake(-1, [65, 87, 68, 83])
      snake2 = new Snake(1, [37, 38, 39, 40])
    } else if (!snake2.checkStillIn() || snake2.checkForCollision(snake.position)) {
      snakeWins += snake.position.length
      snake = new Snake(-1, [65, 87, 68, 83])
      snake2 = new Snake(1, [37, 38, 39, 40])
    }
    if (snake.foundFood(food.position)) {
      snake.moveSnake(true)
      snake.color = food.color
      food = new Food
    } else if (snake2.foundFood(food.position)) {
      snake2.moveSnake(true)
      snake2.color = food.color
      food = new Food
    } else {
      snake.moveSnake(false)
      snake2.moveSnake(false)
    }
    snake.drawSnake()
    snake2.drawSnake()
    food.drawFood()
    playerOneScore.innerHTML = `${snakeWins}`
    playerTwoScore.innerHTML = `${snake2Wins}`
    main()
  }, gameSpeed)
}

const changeDirection = (event) => {

  const keyPressed = event.keyCode;
  snake.changeInDirection(keyPressed)
  snake2.changeInDirection(keyPressed)
  
}

document.addEventListener("keydown", changeDirection);
let snake = new Snake(-1, [65, 87, 68, 83])
let snake2 = new Snake(1, [37, 38, 39, 40])
let food = new Food
main()

// x by box size in draw snake, get rid of all other references
// Make object {65:[which snake, x velocity, y velocity]}
