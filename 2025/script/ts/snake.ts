const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL_SIZE = 10;
const NUM_SNAKES = 50;
const SPEED = 2;
let grid: string[][] = [];

const snakes: { x: number; y: number; dx: number; dy: number; fixed: boolean }[] = [];

// Load the grid from 2025_dot.txt
async function loadGrid(): Promise<void> {
    const response = await fetch("../../2025_dot.txt");
    const text = await response.text();
    grid = text
        .trim()
        .split("\n")
        .map((row) => row.split(""));
}

function drawGrid(): void {
    ctx.fillStyle = "red";
    const offsetX = (canvas.width - grid[0].length * CELL_SIZE) / 2;
    const offsetY = (canvas.height - grid.length * CELL_SIZE) / 2;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "#") {
                ctx.fillRect(offsetX + x * CELL_SIZE, offsetY + y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function createSnakes(): void {
    for (let i = 0; i < NUM_SNAKES; i++) {
        snakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * SPEED,
            dy: (Math.random() - 0.5) * SPEED,
            fixed: false,
        });
    }
}

function updateSnakes(): void {
    const offsetX = (canvas.width - grid[0].length * CELL_SIZE) / 2;
    const offsetY = (canvas.height - grid.length * CELL_SIZE) / 2;

    snakes.forEach((snake) => {
        if (snake.fixed) return;

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0 || snake.x > canvas.width) snake.dx *= -1;
        if (snake.y < 0 || snake.y > canvas.height) snake.dy *= -1;

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === "#") {
                    const cellX = offsetX + x * CELL_SIZE + CELL_SIZE / 2;
                    const cellY = offsetY + y * CELL_SIZE + CELL_SIZE / 2;
                    const distance = Math.sqrt((snake.x - cellX) ** 2 + (snake.y - cellY) ** 2);

                    if (distance < CELL_SIZE) {
                        snake.x = cellX;
                        snake.y = cellY;
                        snake.fixed = true;
                        return;
                    }
                }
            }
        }
    });
}

function drawSnakes(): void {
    ctx.font = `${CELL_SIZE}px serif`;
    snakes.forEach((snake) => {
        ctx.fillText("🐍", snake.x, snake.y);
    });
}

function gameLoop(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    updateSnakes();
    drawSnakes();

    if (!snakes.every((s) => s.fixed)) {
        requestAnimationFrame(gameLoop);
    } else {
        setTimeout(() => alert("Complete!"), 1000);
    }
}

async function startGame(): Promise<void> {
    await loadGrid();
    createSnakes();
    drawGrid();
    gameLoop();
}

document.getElementById("startButton")!.addEventListener("click", startGame);