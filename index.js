let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

class Grid {
  constructor(gridsize, boxSize) {
    this.gridSize = gridsize
    this.boxSize = boxSize
    this.blocks =  this.calculateBlocks(),
    this.gridBlocks = this.calculateGridBlocks()
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

class Game {
  constructor() {
    this.playerOneScore = document.getElementById("player1")
    this.playerTwoScore = document.getElementById("player2")
    this.snakeWins = 0
    this.snake2Wins = 0
    this.snakes = [new Snake(-1, [65, 87, 68, 83]),
                   new Snake(1, [37, 38, 39, 40])]
  }
  checkForLoser() {
    if (this.snakes[0].checkForCollision(this.snakes[1].position) && this.snakes[1].checkForCollision(this.snakes[0].position)) {
      this.snakes[0] = new Snake(-1, [65, 87, 68, 83])
      this.snakes[1] = new Snake(1, [37, 38, 39, 40])
    }
    else if (!this.snakes[0].checkStillIn() || this.snakes[0].checkForCollision(this.snakes[1].position)) {
      this.snake2Wins += this.snakes[1].position.length
      this.snakes[0] = new Snake(-1, [65, 87, 68, 83])
      this.snakes[1] = new Snake(1, [37, 38, 39, 40])
    } else if (!this.snakes[1].checkStillIn() || this.snakes[1].checkForCollision(this.snakes[0].position)) {
      this.snakeWins += this.snakes[0].position.length
      this.snakes[0] = new Snake(-1, [65, 87, 68, 83])
      this.snakes[1] = new Snake(1, [37, 38, 39, 40])
    }
  }
}

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
    for (let s=0; s<game.snakes; s++)
      for (let i=0; i<game.snakes[s].position.length; i++) {
      if (game.snakes[s].position[i][0] == newPosition[0] && game.snakes[s].position[i][1] == newPosition[1]){
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
    game.checkForLoser()
    if (game.snakes[0].foundFood(food.position)) {
      game.snakes[0].moveSnake(true)
      game.snakes[0].color = food.color
      food = new Food()
    } else if (game.snakes[1].foundFood(food.position)) {
      game.snakes[1].moveSnake(true)
      game.snakes[1].color = food.color
      food = new Food()
    } else {
      game.snakes[0].moveSnake(false)
      game.snakes[1].moveSnake(false)
    }
    game.snakes[0].drawSnake()
    game.snakes[1].drawSnake()
    food.drawFood()
    game.playerOneScore.innerHTML = `${game.snakeWins}`
    game.playerTwoScore.innerHTML = `${game.snake2Wins}`
    main()
  }, gameSpeed)
}

const changeDirection = (event) => {

  const keyPressed = event.keyCode;
  game.snakes[0].changeInDirection(keyPressed)
  game.snakes[1].changeInDirection(keyPressed)
  
}

const grid = new Grid(300, 10)
const game = new Game()
document.addEventListener("keydown", changeDirection);
let food = new Food()
main()

// x by box size in draw snake, get rid of all other references
// Make object {65:[which snake, x velocity, y velocity]}
// Comment
