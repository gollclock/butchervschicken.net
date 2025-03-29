const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Player paddles
const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, score: 0 };

// Ball
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 3 };

// Draw paddles and ball
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

// Draw the middle dividing line
function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawRect(player1.x, player1.y, paddleWidth, paddleHeight, "white");
    drawRect(player2.x, player2.y, paddleWidth, paddleHeight, "white");
    drawBall(ball.x, ball.y, ballSize, "white");
}

// Move paddles based on mouse movement
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    player1.y = event.clientY - rect.top - paddleHeight / 2;

    if (player1.y < 0) player1.y = 0;
    if (player1.y > canvas.height - paddleHeight) player1.y = canvas.height - paddleHeight;
});

// Ball movement
function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off top and bottom walls
    if (ball.y < 0 || ball.y > canvas.height) {
        ball.dy *= -1;
    }

    // Bounce off paddles
    if (
        (ball.x < player1.x + paddleWidth && ball.y > player1.y && ball.y < player1.y + paddleHeight) ||
        (ball.x > player2.x - paddleWidth && ball.y > player2.y && ball.y < player2.y + paddleHeight)
    ) {
        ball.dx *= -1;
    }

    // Check for scoring
    if (ball.x < 0) {
        player2.score++;
        resetBall();
    } else if (ball.x > canvas.width) {
        player1.score++;
        resetBall();
    }

    // Player 2 (AI) paddle movement
    if (ball.y < player2.y + paddleHeight / 2) {
        player2.y -= 4;
    } else {
        player2.y += 4;
    }

    // Prevent AI paddle from going out of bounds
    if (player2.y < 0) player2.y = 0;
    if (player2.y > canvas.height - paddleHeight) player2.y = canvas.height - paddleHeight;
}

// Reset ball after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
