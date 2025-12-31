import { TRACK_LENGTH, MAX_SPEED, ACCELERATION, HORSE_ICON } from "./config";
import { CANVAS_HEIGHT_PER_HORSE, HORSE_DRAW_OFFSET_Y, HORSE_TEXT_OFFSET_X, HORSE_TEXT_OFFSET_Y, FONT_SIZE_TEXT, FONT_SIZE_ICON, FRONT_RUNNER_BOOST, FRONT_RUNNER_DECAY, FRONT_RUNNER_THRESHOLD_RATIO, LATE_SPURT_THRESHOLD_RATIO, LATE_SPURT_BOOST, STEADY_VARIATION, RANDOM_VARIATION_RANGE, MIN_SPEED_RATIO, MAX_SPEED_LIMIT_RATIO, HARU_URARA_NAME, AWAKENING_PROBABILITY, AWAKENING_SPEED_BOOST, AWAKENING_MAX_SPEED } from "./constants";
/**
 * レースにおける一頭の馬を表します。
 */
export class Horse {
    /**
     * @param name - 馬の名前
     * @param color - 馬の表示色
     * @param lane - トラック上の馬のレーン番号
     * @param type - 馬の脚質
     * @param baseSpeed - 馬の基本速度
     * @param accelerationPower - 加速力の係数
     * @param isPlayer - プレイヤーが選択した馬か
     */
    constructor(name, color, lane, type, baseSpeed, accelerationPower, isPlayer = false) {
        this.position = 0;
        this.isAwakened = false; // 覚醒状態フラグ
        this.isSelected = false; // 選択状態フラグ
        this.name = name;
        this.color = color;
        this.lane = lane;
        this.type = type;
        this.baseSpeed = baseSpeed;
        this.accelerationPower = accelerationPower;
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
                case "FRONT_RUNNER":
                    this.speed *= this.position < TRACK_LENGTH * FRONT_RUNNER_THRESHOLD_RATIO ? FRONT_RUNNER_BOOST : FRONT_RUNNER_DECAY;
                    break;
                case "LATE_SPURT":
                    if (this.position > TRACK_LENGTH * LATE_SPURT_THRESHOLD_RATIO) {
                        this.speed *= LATE_SPURT_BOOST;
                    }
                    break;
                case "STEADY":
                    // 安定タイプも少し変動させる
                    this.speed += (Math.random() - 0.5) * STEADY_VARIATION;
                    break;
            }
            // 全てのCPU馬に対して、ある程度の幅でランダムな速度変化（ゆらぎ）を与える
            this.speed += (Math.random() - 0.5) * RANDOM_VARIATION_RANGE;
            // 最高速度と最低速度の制限
            this.speed = Math.min(MAX_SPEED, Math.max(this.baseSpeed * MIN_SPEED_RATIO, this.speed));
            // 下限だけでなく上限（基本速度からの減衰）も考慮する場合
            if (this.speed < this.baseSpeed * MAX_SPEED_LIMIT_RATIO && Math.random() > 0.9) {
                this.speed += 0.1; // 回復
            }
        }
        // プレイヤーの馬
        else {
            // 覚醒していない場合のみ、通常の速度減衰などを考慮するならここに記述
            // 今回はaccelerateのみで制御するため特になし
        }
        this.position += this.speed;
        this.position = Math.max(0, this.position);
    }
    /**
     * プレイヤーの馬の速度を増加させます。
     * @returns 覚醒したかどうか
     */
    accelerate() {
        if (this.isPlayer) {
            // ハルウララ覚醒チャンス
            if (this.name === HARU_URARA_NAME && !this.isAwakened) {
                if (Math.random() < AWAKENING_PROBABILITY) {
                    this.isAwakened = true;
                    this.speed = AWAKENING_SPEED_BOOST;
                    return true; // 覚醒発生
                }
            }
            // 加速処理（覚醒時は上限が高い）
            const currentMaxSpeed = this.isAwakened ? AWAKENING_MAX_SPEED : MAX_SPEED;
            this.speed = Math.min(currentMaxSpeed, this.speed + ACCELERATION * this.accelerationPower);
        }
        return false;
    }
    /**
     * 馬のパラメータを初期状態にリセットします。
     */
    reset() {
        this.position = 0;
        this.speed = this.baseSpeed;
        this.isAwakened = false;
        this.isSelected = false;
    }
    /**
     * キャンバスに馬を描画します。
     */
    draw(ctx) {
        const yPos = this.lane * CANVAS_HEIGHT_PER_HORSE + HORSE_DRAW_OFFSET_Y;
        // 選択されている馬の場合、枠で強調
        if (this.isSelected) {
            ctx.save();
            ctx.strokeStyle = "#FF4081"; // ピンク系の目立つ色
            ctx.lineWidth = 3;
            // レーン全体を囲む
            ctx.strokeRect(5, this.lane * CANVAS_HEIGHT_PER_HORSE + 5, TRACK_LENGTH - 10, CANVAS_HEIGHT_PER_HORSE - 10);
            // "YOU" マーク
            ctx.fillStyle = "#FF4081";
            ctx.font = "bold 14px Arial";
            ctx.fillText("◀ YOU", 150, yPos - HORSE_TEXT_OFFSET_Y); // 名前の後ろあたり
            ctx.restore();
        }
        ctx.fillStyle = this.color;
        // 説明テキスト
        ctx.font = FONT_SIZE_TEXT;
        let infoText = `${this.name} (${this.type})`;
        if (this.isAwakened) {
            infoText += " ★覚醒★";
        }
        // テキスト本体を描画
        ctx.fillStyle = this.isAwakened ? "#FF0000" : this.color;
        ctx.fillText(infoText, HORSE_TEXT_OFFSET_X, yPos - HORSE_TEXT_OFFSET_Y);
        // 馬アイコン
        ctx.font = this.isAwakened ? "40px Arial" : FONT_SIZE_ICON; // 覚醒時は少し大きく
        ctx.fillText(HORSE_ICON, this.position, yPos);
    }
}
