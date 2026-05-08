/**
 * @module RatingStrategy
 * @description Strategy Pattern — swappable rating-calculation algorithms.
 *
 * Each difficulty has its own RatingStrategy object that encodes:
 *  • How many points to award on a win  (+ speed bonus)
 *  • How many points to deduct on a loss
 *
 * Adding a new difficulty = adding one new strategy object.
 * No existing code changes. (Open/Closed Principle)
 *
 * Design Pattern : Strategy
 * SOLID Principle: Open/Closed, Single Responsibility
 */

import { MAX_WRONG, SPEED_BONUS_PER_SAVED } from '../data/players';
import { MIN_RATING } from '../data/tiers';

// ─── Strategy interface (documented for clarity) ──────────────────────────────
//
//  interface IRatingStrategy {
//    calculateWin(wrongCount: number, currentRating: number): number;
//    calculateLoss(currentRating: number): number;
//  }

// ─── Concrete strategies ──────────────────────────────────────────────────────

const EasyRatingStrategy = {
  name: 'easy',
  baseWin: 15,
  baseLoss: -5,

  calculateWin(wrongCount) {
    const savedGuesses = MAX_WRONG - wrongCount;
    return this.baseWin + savedGuesses * SPEED_BONUS_PER_SAVED;
  },

  calculateLoss(currentRating) {
    return Math.max(MIN_RATING, currentRating + this.baseLoss);
  },
};

const MediumRatingStrategy = {
  name: 'medium',
  baseWin: 25,
  baseLoss: -10,

  calculateWin(wrongCount) {
    const savedGuesses = MAX_WRONG - wrongCount;
    return this.baseWin + savedGuesses * SPEED_BONUS_PER_SAVED;
  },

  calculateLoss(currentRating) {
    return Math.max(MIN_RATING, currentRating + this.baseLoss);
  },
};

const HardRatingStrategy = {
  name: 'hard',
  baseWin: 40,
  baseLoss: -20,

  calculateWin(wrongCount) {
    const savedGuesses = MAX_WRONG - wrongCount;
    return this.baseWin + savedGuesses * SPEED_BONUS_PER_SAVED;
  },

  calculateLoss(currentRating) {
    return Math.max(MIN_RATING, currentRating + this.baseLoss);
  },
};

const LegendRatingStrategy = {
  name: 'legend',
  baseWin: 60,
  baseLoss: -35,

  calculateWin(wrongCount) {
    const savedGuesses = MAX_WRONG - wrongCount;
    return this.baseWin + savedGuesses * SPEED_BONUS_PER_SAVED;
  },

  calculateLoss(currentRating) {
    return Math.max(MIN_RATING, currentRating + this.baseLoss);
  },
};

// ─── Strategy registry ────────────────────────────────────────────────────────

const STRATEGIES = {
  easy:   EasyRatingStrategy,
  medium: MediumRatingStrategy,
  hard:   HardRatingStrategy,
  legend: LegendRatingStrategy,
};

/**
 * Returns the correct strategy for a given difficulty.
 * Falls back to Easy if an unknown difficulty is supplied.
 * @param {string} difficulty
 * @returns {IRatingStrategy}
 */
export function getRatingStrategy(difficulty) {
  return STRATEGIES[difficulty] ?? EasyRatingStrategy;
}

export {
  EasyRatingStrategy,
  MediumRatingStrategy,
  HardRatingStrategy,
  LegendRatingStrategy,
};
