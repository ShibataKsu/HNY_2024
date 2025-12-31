import { TRACK_LENGTH, MAX_SPEED, ACCELERATION, HORSE_ICON, PLAYER_HORSES_CONFIG, CPU_HORSES_CONFIG, TOTAL_HORSES } from './config.js';
// --------------------
// DOM要素
// --------------------
const horseSelectionContainer = document.getElementById("horseSelection");
const startRaceButton = document.getElementById("startRaceButton");
const cheerButton = document.getElementById("cheerButton");
const playAgainButton = document.getElementById("playAgainButton");
const selectionArea = document.getElementById("selectionArea");
const raceArea = document.getElementById("raceArea");
const resultsArea = document.getElementById("resultsArea");
const winnerInfo = document.getElementById("winnerInfo");
const canvas = document.getElementById("raceCanvas");
const ctx = canvas.getContext("2d");
canvas.width = TRACK_LENGTH;
canvas.height = TOTAL_HORSES * 60;
// --------------------
// クラス
// --------------------
/**
 * レースにおける一頭の馬を表します。
 */
class Horse {
    /**
     * @param name - 馬の名前
     * @param color - 馬の表示色
     * @param lane - トラック上の馬のレーン番号
     * @param type - 馬の脚質
     * @param baseSpeed - 馬の基本速度
     * @param isPlayer - プレイヤーが選択した馬か
     */
    constructor(name, color, lane, type, baseSpeed, isPlayer = false) {
        this.position = 0;
        this.name = name;
        this.color = color;
        this.lane = lane;
        this.type = type;
        this.baseSpeed = baseSpeed;
        this.isPlayer = isPlayer;
        this.speed = this.baseSpeed;
    }
    /**
     * 馬の位置をその速度と脚質に基づいて更新します。
     */
    move() {
        // CPU馬のロジック
        if (!this.isPlayer) {
            // 脚質に応じたCPUの自動速度調整
            switch (this.type) {
                case 'FRONT_RUNNER':
                    // スタートで少し速く、徐々に減速
                    this.speed *= (this.position < TRACK_LENGTH / 4) ? 1.005 : 0.998;
                    break;
                case 'LATE_SPURT':
                    // 終盤で加速
                    if (this.position > TRACK_LENGTH * 0.7) {
                        this.speed *= 1.015;
                    }
                    break;
                case 'STEADY':
                    // 安定しているが、時々ムラがある
                    this.speed += (Math.random() - 0.49) * 0.1;
                    break;
            }
            // 最高速度と最低速度の制限
            this.speed = Math.min(MAX_SPEED, Math.max(this.baseSpeed * 0.8, this.speed));
        }
        this.position += this.speed;
        this.position = Math.max(0, this.position);
    }
    /**
     * プレイヤーの馬の速度を最大制限まで増加させます。
     */
    accelerate() {
        if (this.isPlayer) {
            this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION);
        }
    }
    /**
     * 馬のパラメータを初期状態にリセットします。
     */
    reset() {
        this.position = 0;
        this.speed = this.baseSpeed;
    }
    /**
     * キャンバスに馬を描画します。
     */
    draw(ctx) {
        const yPos = this.lane * 60 + 30;
        ctx.fillStyle = this.color;
        // 説明テキストを追加
        ctx.font = "12px Arial";
        ctx.fillText(`${this.name} (${this.type})`, 10, yPos - 15);
        // 馬アイコン
        ctx.font = "30px Arial";
        ctx.fillText(HORSE_ICON, this.position, yPos);
    }
}
/**
 * レース自体を管理します。
 */
class Race {
    /**
     * @param horses - レースに出走する馬の配列
     * @param onFinish - レース終了時に実行されるコールバック関数
     */
    constructor(horses, onFinish) {
        this.onFinish = onFinish;
        this.raceState = "not_started";
        this.animationFrameId = null;
        this.winner = null;
        /**
         * 各フレームで呼び出されるメインゲームループです。
         */
        this.gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.horses.forEach(horse => {
                horse.move();
                horse.draw(ctx);
            });
            this.checkForWinner();
            if (this.raceState === "in_progress") {
                this.animationFrameId = requestAnimationFrame(this.gameLoop);
            }
            else if (this.winner) {
                if (this.animationFrameId)
                    cancelAnimationFrame(this.animationFrameId);
                this.onFinish(this.winner);
            }
        };
        this.horses = horses;
    }
    /**
     * レースを開始します。
     */
    start() {
        if (this.raceState === "not_started") {
            this.raceState = "in_progress";
            this.gameLoop();
        }
    }
    /**
     * レースの状態をリセットします。
     */
    reset() {
        this.raceState = "not_started";
        this.winner = null;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.horses.forEach(horse => horse.reset());
    }
    /**
     * いずれかの馬がフィニッシュラインを越えたか確認します。
     */
    checkForWinner() {
        for (const horse of this.horses) {
            if (horse.position >= TRACK_LENGTH - 40) {
                this.raceState = "finished";
                this.winner = horse;
                return;
            }
        }
    }
}
/**
 * ゲーム全体のロジックとユーザーインタラクションを管理します。
 */
class Game {
    constructor() {
        this.allHorses = [];
        this.playerHorses = [];
        this.selectedHorse = null;
        /**
         * レースの開始を処理します。
         */
        this.handleStartRace = () => {
            const selectedRadio = document.querySelector('input[name="horse"]:checked');
            if (selectedRadio) {
                const selectedLane = parseInt(selectedRadio.value);
                this.selectedHorse = this.allHorses.find(h => h.lane === selectedLane) || null;
                selectionArea.style.display = "none";
                raceArea.style.display = "block";
                resultsArea.style.display = "none";
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
                this.selectedHorse.accelerate();
            }
        };
        /**
         * レースの終了を処理します。
         */
        this.handleRaceFinish = (winner) => {
            raceArea.style.display = "none";
            resultsArea.style.display = "block";
            let resultText = `勝者: ${winner.name}!`;
            if (this.selectedHorse && this.selectedHorse.name === winner.name) {
                resultText += " おめでとうございます！あなたの選んだ馬が勝ちました！";
            }
            else if (this.selectedHorse) {
                resultText += ` 残念！あなたの選んだ馬 (${this.selectedHorse.name}) は負けてしまいました。`;
            }
            winnerInfo.textContent = resultText;
        };
        /**
         * ゲームをリセットして最初からやり直します。
         */
        this.handlePlayAgain = () => {
            this.race.reset();
            this.selectedHorse = null;
            selectionArea.style.display = "block";
            raceArea.style.display = "none";
            resultsArea.style.display = "none";
            document.getElementById("horse0").checked = true;
        };
        this.createAllHorses();
        this.race = new Race(this.allHorses, this.handleRaceFinish);
        this.setupHorseSelection();
        this.addEventListeners();
    }
    /**
     * 設定ファイルから馬のインスタンスを作成します。
     */
    createAllHorses() {
        let currentLane = 0;
        this.playerHorses = PLAYER_HORSES_CONFIG.map(config => new Horse(config.name, config.color, currentLane++, config.type, config.baseSpeed, true));
        const cpuHorses = CPU_HORSES_CONFIG.map(config => new Horse(config.name, config.color, currentLane++, config.type, config.baseSpeed, false));
        this.allHorses = [...this.playerHorses, ...cpuHorses];
    }
    /**
     * 馬選択用のラジオボタンを作成します。
     */
    setupHorseSelection() {
        horseSelectionContainer.innerHTML = '';
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
            horseSelectionContainer.appendChild(input);
            horseSelectionContainer.appendChild(label);
        });
        // デフォルトで最初の馬を選択
        document.getElementById("horse0").checked = true;
    }
    /**
     * ボタンのイベントリスナーを設定します。
     */
    addEventListeners() {
        startRaceButton.addEventListener("click", this.handleStartRace);
        cheerButton.addEventListener("click", this.handleCheer);
        playAgainButton.addEventListener("click", this.handlePlayAgain);
    }
}
// ゲームを初期化
new Game();
