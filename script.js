const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//ball variables
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - ballRadius - 30;
let dx = 4;
let dy = -4;

//paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

//brick variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffSetTop = 30;
const brickOffSetLeft = 20;

//score variable
let score = 0;
let lives = 2;

//initialize bricks
let bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let cur = bricks[i][j];
      if (cur.status == 1) {
        let brickX = i * (brickWidth + brickPadding) + brickOffSetLeft;
        let brickY = j * (brickHeight + brickPadding) + brickOffSetTop;
        cur.x = brickX;
        cur.y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function colisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let cur = bricks[i][j];
      if (cur.status == 1) {
        if (
          x > cur.x &&
          x < cur.x + brickWidth &&
          y > cur.y &&
          y < cur.y + brickHeight
        ) {
          dy = -dy;
          cur.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("You Win, Congrats!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBricks();
  drawPaddle();
  drawScore();
  drawLives();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy - 0.1;
      dx = dx > 0 ? dx + 0.1 : dx - 0.1;
    } else if (y + dy > canvas.height - ballRadius) {
      lives--;
      if (!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 4;
        dy = -4;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  } else if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }

  colisionDetection();

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

draw();
