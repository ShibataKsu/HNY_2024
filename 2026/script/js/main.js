import { Game } from "./Game.js";
// DOMが完全に読み込まれてからゲームを初期化
document.addEventListener("DOMContentLoaded", () => {
    new Game();
});
