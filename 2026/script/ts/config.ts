/**
 * 馬の脚質（戦法）を表す型。
 * - `FRONT_RUNNER`: 先行逃げ切り型。スタートダッシュが速い。
 * - `STEADY`: 安定型。平均的な速度を維持する。
 * - `LATE_SPURT`: 追い込み型。終盤に驚異的な加速を見せる。
 */
export type HorseType = 'FRONT_RUNNER' | 'STEADY' | 'LATE_SPURT';

/**
 * 個々の馬の設定を表すインターフェース。
 */
export interface HorseConfig {
    name: string;
    color: string;
    type: HorseType;
    baseSpeed: number;
}

// --------------------
// ゲーム全体の定数
// --------------------
export const TRACK_LENGTH = 800; // レーストラックの長さ
export const MAX_SPEED = 2.5; // 馬が到達できる最高速度
export const ACCELERATION = 0.15; // 応援による加速量
export const HORSE_ICON = "🐴"; // 馬のアイコン

// --------------------
// 馬の個別設定
// --------------------

/**
 * プレイヤーが選択可能な馬の設定。
 * 難易度: 韋駄天 (低), 不動 (中), 昇龍 (高)
 */
export const PLAYER_HORSES_CONFIG: HorseConfig[] = [
    { name: "韋駄天", color: "#e74c3c", type: 'FRONT_RUNNER', baseSpeed: 0.9 },
    { name: "不動", color: "#3498db", type: 'STEADY', baseSpeed: 0.8 },
    { name: "昇龍", color: "#f1c40f", type: 'LATE_SPURT', baseSpeed: 0.7 },
];

/**
 * CPU（対戦相手）の馬の設定。
 */
export const CPU_HORSES_CONFIG: HorseConfig[] = [
    { name: "CPU Alpha", color: "#95a5a6", type: 'STEADY', baseSpeed: 0.85 },
    { name: "CPU Beta", color: "#5D6D7E", type: 'FRONT_RUNNER', baseSpeed: 0.9 },
];

export const TOTAL_HORSES = PLAYER_HORSES_CONFIG.length + CPU_HORSES_CONFIG.length;
