const animate = function (cb) { window.setTimeout(cb, 1000 / 12) };

const WIDTH = 800;
const HEIGHT = WIDTH * (9 / 16);

const canvas = document.querySelector("#canvas");
canvas.style.width = WIDTH + "px";
canvas.style.height = HEIGHT + "px";

canvas.onmousemove = function (e) {
    console.log(e.clientX + ", " + e.clientY);
};
const context = canvas.getContext("2d");
const WORLD = { X: 0, Y: 0, HEIGHT: 168, WIDTH: 316 };

let apple = null;
let hunts = 0;

const snakeBody = [
    { x: 80, y: 20, height: 5, width: 5 },
    { x: 70, y: 20, height: 5, width: 5 },
    { x: 60, y: 20, height: 5, width: 5 },
    { x: 50, y: 20, height: 5, width: 5 }
];

const DIRECTIONS = {
    UP: "UP", DOWN: "DOWN", Left: "LEFT", RIGHT: "RIGHT"
};
let currentDirection = DIRECTIONS.RIGHT;

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "w":
        case "ArrowUp":
            if (currentDirection === DIRECTIONS.DOWN && snakeBody.length > 1)
                break;
            currentDirection = DIRECTIONS.UP;
            break;
        case "a":
        case "ArrowLeft":
            if (currentDirection === DIRECTIONS.RIGHT && snakeBody.length > 1)
                break;
            currentDirection = DIRECTIONS.LEFT;
            break;
        case "s":
        case "ArrowDown":
            if (currentDirection === DIRECTIONS.UP && snakeBody.length > 1)
                break;
            currentDirection = DIRECTIONS.DOWN;
            break;
        case "d":
        case "ArrowRight":
            if (currentDirection === DIRECTIONS.LEFT && snakeBody.length > 1)
                break;
            currentDirection = DIRECTIONS.RIGHT;
            break;
        default:
            break;
    }
});

clearCanvas();
setScore();
animate(step);

function step() {
    if (document.activeElement === canvas && document.hasFocus()) {
        document.querySelector("#pauseMenu").style.display = "none";
        update();
    } else {
        document.querySelector("#pauseMenu").style.display = "block";
    }
    animate(step);
}

function update() {
    moveSnake();
    spawnApple();
    checkForCollision();
}

function clearCanvas() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function setScore() {
    context.font = "16px Arial";
    context.globalAlpha = 0.2;
    context.fillText("Hunts: " + hunts, WORLD.WIDTH - 100, WORLD.HEIGHT - 50);
    context.globalAlpha = 1;
}

function drawApple(apple) {
    context.fillStyle = "#008000";
    context.fillRect(apple.x, apple.y, 5, 5);
}

function spawnApple() {
    if (apple !== null) {
        drawApple(apple);
        return;
    }

    const x = Math.floor((Math.random() * (WORLD.WIDTH - WORLD.X - 40) + WORLD.X) / 10) * 10;
    const y = Math.floor((Math.random() * (WORLD.HEIGHT - WORLD.Y - 40) + WORLD.Y) / 10) * 10;

    apple = { x, y };
    drawApple(apple);
}

function drawSnake(snake, color) {
    context.fillStyle = color;
    context.fillRect(snake.x, snake.y, snake.height, snake.width);
}

function moveSnake() {
    clearCanvas();
    let snakeHead = Object.assign({}, snakeBody[0]);
    let dx = dy = 0;
    let delta = 5;
    switch (currentDirection) {
        case DIRECTIONS.UP:
            dy += -delta;
            break;
        case DIRECTIONS.DOWN:
            dy += +delta;
            break;
        case DIRECTIONS.LEFT:
            dx += -delta;
            break;
        case DIRECTIONS.RIGHT:
            dx += +delta;
        default:
            break;
    }
    snakeHead.x += dx;
    snakeHead.y += dy;
    if (snakeHead.x > 316) {
        snakeHead.x = 0;
    } else if (snakeHead.x < -delta) {
        snakeHead.x = 296;
    }

    if (snakeHead.y < -delta) {
        snakeHead.y = 168;
    } else if (snakeHead.y > 168) {
        snakeHead.y = 0;
    }
    snakeBody.pop();
    snakeBody.unshift(snakeHead);
    for (let i = 0; i < snakeBody.length; i++) {
        if (i === 0) drawSnake(snakeBody[i], "#ed143d");
        else drawSnake(snakeBody[i], "#FFFFFF");
    }
    setScore();
}

function checkForCollision() {
    const snakeHead = snakeBody[0];
    // collision with apple
    if (getDistance(snakeHead.x, snakeHead.y, apple.x, apple.y) < 2.5) {
        apple = null;
        hunts++;
        let snakeTail = Object.assign({}, snakeBody[snakeBody.length - 1]);
        snakeTail.x -= 10;
        snakeBody.push(snakeTail);
    }
}

function getDistance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}