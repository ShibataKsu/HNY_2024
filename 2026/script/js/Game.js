import { Horse } from "./Horse.js";
import { Race } from "./Race.js";
import { PLAYER_HORSES_CONFIG, CPU_HORSES_CONFIG, TOTAL_HORSES, TRACK_LENGTH } from "./config.js";
import { CANVAS_HEIGHT_PER_HORSE } from "./constants.js";
import { HARU_URARA_NAME, HARU_WIN_MESSAGE } from "./constants.js";
/**
 * ゲーム全体のロジックとユーザーインタラクションを管理します。
 */
export class Game {
    constructor() {
        this.allHorses = [];
        this.playerHorses = [];
        this.selectedHorse = null;
        // DOM要素
        this.horseSelectionContainer = document.getElementById("horseSelection");
        this.startRaceButton = document.getElementById("startRaceButton");
        this.cheerButton = document.getElementById("cheerButton");
        this.playAgainButton = document.getElementById("playAgainButton");
        this.selectionArea = document.getElementById("selectionArea");
        this.raceArea = document.getElementById("raceArea");
        this.resultsArea = document.getElementById("resultsArea");
        this.winnerInfo = document.getElementById("winnerInfo");
        this.canvas = document.getElementById("raceCanvas");
        this.ctx = this.canvas.getContext("2d");
        /**
         * レースの開始を処理します。
         */
        this.handleStartRace = () => {
            const selectedRadio = document.querySelector('input[name="horse"]:checked');
            if (selectedRadio) {
                const selectedLane = parseInt(selectedRadio.value);
                this.selectedHorse = this.allHorses.find((h) => h.lane === selectedLane) || null;
                if (this.selectedHorse) {
                    this.selectedHorse.isSelected = true;
                }
                this.selectionArea.style.display = "none";
                this.raceArea.style.display = "block";
                this.resultsArea.style.display = "none";
                this.race.start();
            }
            else {
                alert("応援する馬を選択してください！");
            }
        };
        /**
         * 応援アクションを処理します。
         */
        this.handleCheer = () => {
            if (this.race.raceState === "in_progress" && this.selectedHorse) {
                const awakened = this.selectedHorse.accelerate();
                if (awakened) {
                    this.race.triggerCutIn("覚醒！！！");
                }
            }
        };
        /**
         * レースの終了を処理します。
         */
        this.handleRaceFinish = (winner) => {
            // 演出を見せるため、raceAreaは非表示にしない
            // this.raceArea.style.display = "none";
            this.resultsArea.style.display = "block";
            let resultText = `勝者: ${winner.name}!`;
            if (this.selectedHorse && this.selectedHorse.name === winner.name) {
                if (winner.name === HARU_URARA_NAME) {
                    resultText = HARU_WIN_MESSAGE;
                }
                else {
                    resultText += " おめでとうございます！あなたの選んだ馬が勝ちました！";
                }
            }
            else if (this.selectedHorse) {
                resultText += ` 残念！あなたの選んだ馬 (${this.selectedHorse.name}) は負けてしまいました。`;
            }
            this.winnerInfo.textContent = resultText;
        };
        /**
         * ゲームをリセットして最初からやり直します。
         */
        this.handlePlayAgain = () => {
            this.race.reset();
            this.selectedHorse = null;
            this.selectionArea.style.display = "block";
            this.raceArea.style.display = "none";
            this.resultsArea.style.display = "none";
            const firstHorse = document.getElementById("horse0");
            if (firstHorse)
                firstHorse.checked = true;
        };
        // キャンバスの初期設定
        this.canvas.width = TRACK_LENGTH;
        this.canvas.height = TOTAL_HORSES * CANVAS_HEIGHT_PER_HORSE;
        this.createAllHorses();
        this.race = new Race(this.allHorses, this.canvas, this.ctx, this.handleRaceFinish);
        this.setupHorseSelection();
        this.addEventListeners();
    }
    /**
     * 設定ファイルから馬のインスタンスを作成します。
     */
    createAllHorses() {
        let currentLane = 0;
        this.playerHorses = PLAYER_HORSES_CONFIG.map((config) => new Horse(config.name, config.color, currentLane++, config.type, config.baseSpeed, config.accelerationPower, true));
        const cpuHorses = CPU_HORSES_CONFIG.map((config) => new Horse(config.name, config.color, currentLane++, config.type, config.baseSpeed, config.accelerationPower, false));
        this.allHorses = [...this.playerHorses, ...cpuHorses];
    }
    /**
     * 馬選択用のラジオボタンを作成します。
     */
    setupHorseSelection() {
        this.horseSelectionContainer.innerHTML = "";
        this.playerHorses.forEach((horse) => {
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "horse";
            input.id = `horse${horse.lane}`;
            input.value = horse.lane.toString();
            const label = document.createElement("label");
            label.htmlFor = `horse${horse.lane}`;
            label.textContent = `${horse.name} (脚質: ${horse.type})`;
            label.style.color = horse.color;
            this.horseSelectionContainer.appendChild(input);
            this.horseSelectionContainer.appendChild(label);
        });
        // デフォルトで最初の馬を選択
        const firstHorse = document.getElementById("horse0");
        if (firstHorse)
            firstHorse.checked = true;
    }
    /**
     * ボタンのイベントリスナーを設定します。
     */
    addEventListeners() {
        this.startRaceButton.addEventListener("click", this.handleStartRace);
        this.cheerButton.addEventListener("click", this.handleCheer);
        this.playAgainButton.addEventListener("click", this.handlePlayAgain);
    }
}
