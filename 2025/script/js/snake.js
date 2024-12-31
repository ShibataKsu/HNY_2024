"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000; // キャンバスの横幅
canvas.height = 600; // キャンバスの高さ
const CELL_SIZE = 15; // グリッドのサイズ
const SNAKE_SIZE = 30; // ヘビのサイズ
const NUM_SNAKES = 100; // ヘビの数
const SNAKE_SPEED = 2; // ヘビの移動速度
const FADE_SPEED = 0.0005; // フェードイン速度
let isFirst = true;
let isSecond = false;
let grid = [];
let fadeInProgress = 0; // フェードイン進行度
let hue = 0; // レインボーカラーの基準
const snakes = [];
// グリッドデータを読み込む
function loadGrid() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("2025_dot.txt");
        const text = yield response.text();
        grid = text
            .trim()
            .split("\n")
            .map((row) => row.split(""));
    });
}
// グリッドを描画する
function drawGrid() {
    const offsetX = (canvas.width - grid[0].length * CELL_SIZE) / 2;
    const offsetY = (canvas.height - grid.length * CELL_SIZE) / 2;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "#") {
                const alpha = Math.min(1, fadeInProgress); // フェードインの進行度で透明度を制御
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
                const posX = offsetX + x * CELL_SIZE;
                const posY = offsetY + y * CELL_SIZE;
                ctx.fillRect(posX, posY, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    if (fadeInProgress < 1) {
        fadeInProgress += FADE_SPEED;
    }
}
// ヘビを作成する
function createSnakes() {
    for (let i = 0; i < NUM_SNAKES; i++) {
        snakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * SNAKE_SPEED,
            dy: (Math.random() - 0.5) * SNAKE_SPEED,
            stopped: false,
        });
    }
}
// ヘビを更新する
function updateSnakes() {
    const offsetX = (canvas.width - grid[0].length * CELL_SIZE) / 2;
    const offsetY = (canvas.height - grid.length * CELL_SIZE) / 2;
    snakes.forEach((snake) => {
        if (snake.stopped)
            return;
        snake.x += snake.dx;
        snake.y += snake.dy;
        // 壁にぶつかったら反射
        if (snake.x < 0 || snake.x > canvas.width)
            snake.dx *= -1;
        if (snake.y < 0 || snake.y > canvas.height)
            snake.dy *= -1;
        // グリッド内の近くの点をチェック
        const gridX = Math.floor((snake.x - offsetX) / CELL_SIZE);
        const gridY = Math.floor((snake.y - offsetY) / CELL_SIZE);
        if (gridX >= 0 && gridX < grid[0].length && gridY >= 0 && gridY < grid.length && grid[gridY][gridX] === "#") {
            snake.stopped = true;
            snake.x = offsetX + gridX * CELL_SIZE + CELL_SIZE / 2;
            snake.y = offsetY + gridY * CELL_SIZE + CELL_SIZE / 2;
        }
    });
}
// ヘビを描画する
function drawSnakes() {
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 100)`;
    ctx.font = `${SNAKE_SIZE}px serif`;
    snakes.forEach((snake) => {
        ctx.fillText("🐍", snake.x, snake.y);
    });
}
// Happy New Yearメッセージを表示する
function showHappyNewYear() {
    const messageElement = document.getElementById("happyNewYearMessage");
    messageElement.style.display = "block"; // メッセージを表示
}
// メインループ
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // まずグリッドを描画
    drawGrid();
    // 次にヘビを描画
    drawSnakes();
    updateSnakes();
    hue = (hue + 1) % 360; // レインボーカラーを無段階で更新
    requestAnimationFrame(gameLoop);
}
// ゲームを開始する
function startGame() {
    return __awaiter(this, void 0, void 0, function* () {
        // グリッドをロードしてヘビを作成
        yield loadGrid();
        createSnakes();
        // スタートボタンを非表示にする
        const startButton = document.getElementById("startButton");
        startButton.style.display = "none";
        // ゲームループを開始
        gameLoop();
        // 10秒後に「Happy New Year」を表示
        setTimeout(() => {
            showHappyNewYear();
        }, 10000); // 10秒経過後に表示
    });
}
// スタートボタンのイベント
document.getElementById("startButton").addEventListener("click", startGame);
