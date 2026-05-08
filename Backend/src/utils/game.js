// ============================================================
// src/utils/game.js
// Pure game-logic helpers (easy to unit-test)
// ============================================================

const {
  RATING_DELTA,
  MIN_RATING,
  AVATAR_COLORS,
} = require("../config/constants");

// ─── Word masking ─────────────────────────────────────────────

/**
 * Build the initial masked display for a player name.
 * Letters → "_",  spaces & hyphens kept as-is.
 * Length === playerName.length  (no extra spaces between letters)
 *
 * e.g. "Kylian Mbappe" → "______ ______"
 */
const buildMaskedWord = (name) =>
  name
    .split("")
    .map((ch) => (/[a-zA-Z]/.test(ch) ? "_" : ch))
    .join("");

/**
 * Reveal positions of a guessed letter in the masked word.
 * Returns updated maskedWord string — same length as playerName.
 *
 * @param {string} playerName  Original player name
 * @param {string} maskedWord  Current masked word state
 * @param {string} letter      Single uppercase letter
 */
const revealLetter = (playerName, maskedWord, letter) => {
  const nameChars = playerName.split("");
  const maskedChars = maskedWord.split("");

  return nameChars
    .map((ch, i) => {
      if (!/[a-zA-Z]/.test(ch)) return ch; // space / hyphen — keep
      if (maskedChars[i] !== "_") return maskedChars[i]; // already revealed
      if (ch.toUpperCase() === letter.toUpperCase()) return ch; // new reveal
      return "_";
    })
    .join("");
};

/**
 * Check if the entire name has been revealed (no "_" remaining).
 */
const isWordComplete = (maskedWord) =>
  !!maskedWord && !maskedWord.includes("_");

// ─── Difficulty mapping ──────────────────────────────────────

const ratingToDifficulty = (rating) => {
  if (rating < 1200) return "EASY";
  if (rating < 1500) return "MEDIUM";
  if (rating < 1800) return "HARD";
  return "LEGEND";
};

// ─── Rating engine ───────────────────────────────────────────

const calcNewRating = (currentRating, outcome, difficulty) => {
  const delta =
    outcome === "WON"
      ? RATING_DELTA.WIN[difficulty]
      : RATING_DELTA.LOSE[difficulty];

  return Math.max(MIN_RATING, currentRating + delta);
};

// ─── Avatar ──────────────────────────────────────────────────

const pickAvatarColor = (username) =>
  AVATAR_COLORS[
    username.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
      AVATAR_COLORS.length
  ];

module.exports = {
  buildMaskedWord,
  revealLetter,
  isWordComplete,
  ratingToDifficulty,
  calcNewRating,
  pickAvatarColor,
};
