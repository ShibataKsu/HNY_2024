export const TRACK_LENGTH = 800;
export const MAX_SPEED = 2.0;
export const ACCELERATION = 0.05; // 連打1回あたりの基本加速量
export const HORSE_ICON = "🐎";
export const PLAYER_HORSES_CONFIG = [
    { name: "ディープインパクト", color: "#FFD700", type: "LATE_SPURT", baseSpeed: 0.6, accelerationPower: 1.0 },
    { name: "サイレンススズカ", color: "#00FF00", type: "FRONT_RUNNER", baseSpeed: 0.7, accelerationPower: 0.8 },
    { name: "オグリキャップ", color: "#C0C0C0", type: "STEADY", baseSpeed: 0.65, accelerationPower: 0.9 },
    // 激ムズ設定: 基本速度が遅く、連打の効果が通常の1/50
    { name: "ハルウララ", color: "#FF69B4", type: "LATE_SPURT", baseSpeed: 0.3, accelerationPower: 0.1 },
];
export const CPU_HORSES_CONFIG = [
    { name: "スペシャルウィーク", color: "#800080", type: "STEADY", baseSpeed: 0.6, accelerationPower: 0.5 },
    { name: "トウカイテイオー", color: "#0000FF", type: "FRONT_RUNNER", baseSpeed: 0.65, accelerationPower: 0.5 },
];
export const TOTAL_HORSES = PLAYER_HORSES_CONFIG.length + CPU_HORSES_CONFIG.length;
