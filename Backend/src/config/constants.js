// ============================================================
// src/config/constants.js
// ============================================================

// Maximum wrong guesses before the game is lost (matches your HangmanSVG stages)
const MAX_WRONG = 6;

// Hints revealed per wrong guess — indices match your frontend HintBox
// Hint order: nationality → position → club → league → age → jerseyNumber
const HINT_FIELDS = [
  "nationality",
  "position",
  "club",
  "league",
  "age",
  "jerseyNumber",
];

// ELO-style rating thresholds that map to difficulty tiers (mirrors tiers.js)
const DIFFICULTY_RATING = {
  EASY: { min: 0, max: 1199 },
  MEDIUM: { min: 1200, max: 1499 },
  HARD: { min: 1500, max: 1799 },
  LEGEND: { min: 1800, max: Infinity },
};

// Rating delta awarded / deducted per game outcome
const RATING_DELTA = {
  WIN: { EASY: 70, MEDIUM: 25, HARD: 20, LEGEND: 15 },
  LOSE: { EASY: -5, MEDIUM: -10, HARD: -15, LEGEND: -20 },
};

// Minimum rating floor — never go below this
const MIN_RATING = 800;

// Avatar colour palette (matches frontend)
const AVATAR_COLORS = [
  "#7c3aed",
  "#00d4ff",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

module.exports = {
  MAX_WRONG,
  HINT_FIELDS,
  DIFFICULTY_RATING,
  RATING_DELTA,
  MIN_RATING,
  AVATAR_COLORS,
};
