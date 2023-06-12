// game constant and variables
// Game constant and variables
let inputDir = { x: 0, y: 0 };
let speed = 15;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let startTime = 0;
let timerInterval;
let snakeStarted = true;
let timerStarted = false;


const timerElement = document.getElementById('timer');

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  timerElement.textContent = `Time: ${elapsedTime}s`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
    startTime = Date.now();
    timerElement.textContent = 'Time: 0s';
  }
  

// Game functions
function main(ctime) {
    
    
  window.requestAnimationFrame(main);
  previousDirection = { x: inputDir.x, y: inputDir.y };
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }


  lastPaintTime = ctime;
  gameEngine();

}


function isCollide(snake) {
  // If the snake bites itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // If the snake bumps into the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // Part 1: Update the snake array & food
  if (isCollide(snakeArr)) {
    inputDir = { x: 0, y: 0 };
    alert('Game Over. Press any key to play again!');
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    stopTimer();
    resetTimer();
    setTimeout(() => {
        const playAgain = confirm('Game Over. Do you want to play again?');
        if (playAgain) {
          snakeArr = [{ x: 13, y: 15 }];
          score = 0;
          startTimer();
        }
      }, 100);
    
  }


  // If the snake eats the food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    score += 1;
    if (score > HighScoreval) {
      HighScoreval = score;
      localStorage.setItem('HighScore', JSON.stringify(HighScoreval));
      HighScoreBox.innerHTML = 'HighScore: ' + HighScoreval;
    }
    ScoreBox.innerHTML = 'Score: ' + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the Snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Part 2: Render the snake and food
  board.innerHTML = '';

  // Render the snake
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add('head');
    } else {
      snakeElement.classList.add('snake');
    }
    board.appendChild(snakeElement);
  });

  // Render the food
  foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

// Main Logic
let HighScore = localStorage.getItem('HighScore');
if (HighScore === null) {
  HighScoreval = 0;
  localStorage.setItem('HighScore', JSON.stringify(HighScoreval));
} else {
  HighScoreval = JSON.parse(HighScore);
  HighScoreBox.innerHTML = 'High Score: ' + HighScore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => { 
  switch (e.key) {
    case 'ArrowUp':
      if (previousDirection.y !== 1) { 
        inputDir.x = 0;
        inputDir.y = -1;
      }
      break;
    case 'ArrowDown':
      if (previousDirection.y !== -1) {
        inputDir.x = 0;
        inputDir.y = 1;
      }
      break;
    case 'ArrowLeft':
      if (previousDirection.x !== 1) {
        inputDir.x = -1;
        inputDir.y = 0;
      }
      break;
    case 'ArrowRight':
      if (previousDirection.x !== -1) {
        inputDir.x = 1;
        inputDir.y = 0;
      }
      break;
    default:
      break;
  }
  // Start the timer if it's not already started
  if (!timerStarted && (inputDir.x !== 0 || inputDir.y !== 0)) {
    startTimer();
    timerStarted = true;
  }
});