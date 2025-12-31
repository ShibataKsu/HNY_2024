import { Horse } from "./Horse.js";
import { TRACK_LENGTH } from "./config.js";
import { GOAL_OFFSET, FIREWORK_PARTICLE_COUNT, GRAVITY, CELEBRATION_TEXT, CELEBRATION_FONT, CELEBRATION_COLOR, CELEBRATION_STROKE_COLOR, HARU_URARA_NAME, HARU_WIN_MESSAGE, CUTIN_DURATION } from "./constants.js";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
}

/**
 * レース自体を管理します。
 */
export class Race {
    horses: Horse[];
    raceState: "not_started" | "in_progress" | "finished" = "not_started";
    private animationFrameId: number | null = null;
    private winner: Horse | null = null;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private onFinish: (winner: Horse) => void;
    private particles: Particle[] = [];
    private showCelebration: boolean = false;
    private cutInTimer: number = 0;
    private cutInText: string = "";

    /**
     * @param horses - レースに出走する馬の配列
     * @param canvas - 描画対象のキャンバス
     * @param ctx - 描画コンテキスト
     * @param onFinish - レース終了時に実行されるコールバック関数
     */
    constructor(horses: Horse[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, onFinish: (winner: Horse) => void) {
        this.horses = horses;
        this.canvas = canvas;
        this.ctx = ctx;
        this.onFinish = onFinish;
    }

    /**
     * レースを開始します。
     */
    start(): void {
        if (this.raceState === "not_started") {
            this.raceState = "in_progress";
            this.gameLoop();
        }
    }

    /**
     * 各フレームで呼び出されるメインゲームループです。
     */
    private gameLoop = (): void => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.horses.forEach((horse) => {
            horse.move();
            horse.draw(this.ctx);
        });

        // カットイン演出
        if (this.cutInTimer > 0) {
            this.drawCutIn();
            this.cutInTimer--;
        }

        this.checkForWinner();

        if (this.raceState === "in_progress") {
            this.animationFrameId = requestAnimationFrame(this.gameLoop);
        } else if (this.raceState === "finished") {
            // 勝利演出がある場合はループを継続
            if (this.showCelebration) {
                this.updateAndDrawParticles();
                this.drawCelebrationText();
                this.animationFrameId = requestAnimationFrame(this.gameLoop);
            } else if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        }
    };

    /**
     * レースの状態をリセットします。
     */
    reset(): void {
        this.raceState = "not_started";
        this.winner = null;
        this.showCelebration = false;
        this.particles = [];
        this.cutInTimer = 0;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.horses.forEach((horse) => horse.reset());
    }

    /**
     * カットイン演出を開始します。
     */
    triggerCutIn(text: string): void {
        this.cutInText = text;
        this.cutInTimer = CUTIN_DURATION;
    }

    /**
     * いずれかの馬がフィニッシュラインを越えたか確認します。
     */
    private checkForWinner(): void {
        for (const horse of this.horses) {
            if (horse.position >= TRACK_LENGTH - GOAL_OFFSET) {
                this.raceState = "finished";
                this.winner = horse;

                // プレイヤーが勝った場合に演出を開始
                if (this.winner.isPlayer) {
                    this.showCelebration = true;
                    this.createFireworks();
                }

                this.onFinish(this.winner);
                return;
            }
        }
    }

    /**
     * 花火のパーティクルを生成します。
     */
    private createFireworks(): void {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < FIREWORK_PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
            });
        }
    }

    /**
     * パーティクルを更新して描画します。
     */
    private updateAndDrawParticles(): void {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += GRAVITY;
            p.life -= 0.01;

            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * 勝利テキストを描画します。
     */
    private drawCelebrationText(): void {
        this.ctx.save();
        this.ctx.font = CELEBRATION_FONT;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        // 縁取り
        this.ctx.strokeStyle = CELEBRATION_STROKE_COLOR;
        this.ctx.lineWidth = 4;
        this.ctx.strokeText(CELEBRATION_TEXT, this.canvas.width / 2, this.canvas.height / 2);

        // 本体
        this.ctx.fillStyle = CELEBRATION_COLOR;
        this.ctx.fillText(CELEBRATION_TEXT, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.restore();
    }

    /**
     * カットインを描画します。
     */
    private drawCutIn(): void {
        this.ctx.save();
        // 背景を少し暗く
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // テキスト表示
        this.ctx.font = "bold 60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#FF0000";
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 5;
        this.ctx.strokeText(this.cutInText, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(this.cutInText, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.restore();
    }
}
