// 描画関連
export const CANVAS_HEIGHT_PER_HORSE = 60;
export const HORSE_DRAW_OFFSET_Y = 30;
export const HORSE_TEXT_OFFSET_X = 10;
export const HORSE_TEXT_OFFSET_Y = 15;
export const FONT_SIZE_TEXT = "12px Arial";
export const FONT_SIZE_ICON = "30px Arial";
export const GOAL_OFFSET = 40;

// CPU馬のロジック関連
export const FRONT_RUNNER_BOOST = 1.005;
export const FRONT_RUNNER_DECAY = 0.998;
export const FRONT_RUNNER_THRESHOLD_RATIO = 0.25;
export const LATE_SPURT_THRESHOLD_RATIO = 0.7;
export const LATE_SPURT_BOOST = 1.015;
export const STEADY_VARIATION = 0.05;
export const RANDOM_VARIATION_RANGE = 0.6;
export const MIN_SPEED_RATIO = 0.5;
export const MAX_SPEED_LIMIT_RATIO = 0.8;

// 勝利演出関連
export const FIREWORK_PARTICLE_COUNT = 150;
export const GRAVITY = 0.05;
export const CELEBRATION_TEXT = "Happy New Year 2026!";
export const CELEBRATION_FONT = "bold 48px Arial";
export const CELEBRATION_COLOR = "#FFD700"; // Gold
export const CELEBRATION_STROKE_COLOR = "#000";
export const CELEBRATION_DURATION = 300; // フレーム数

// ハルウララ特殊演出
export const HARU_URARA_NAME = "ハルウララ";
export const AWAKENING_PROBABILITY = 0.01; // 1%の確率で覚醒
export const AWAKENING_SPEED_BOOST = 8.0; // 覚醒時の速度
export const AWAKENING_MAX_SPEED = 8.0; // 覚醒時の最高速度上限
export const CUTIN_DURATION = 120; // カットイン表示フレーム数
export const HARU_WIN_MESSAGE = "奇跡の勝利！ハルウララがまさかの1着！";
