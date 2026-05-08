/**
 * @module factories
 * @description Factory Pattern — frontend-only object mappers.
 *
 * After the backend integration, factories no longer CREATE objects
 * (the server does that).  They now act as pure data mappers / shape
 * guarantors so the UI always has a safe, typed object to render from.
 *
 * Design Pattern : Factory (mapper variant)
 * SOLID Principle:
 *  S — Single Responsibility : shape mapping only
 *  O — Open/Closed           : add new fields by extending, not modifying
 */

// ─── Empty/default shapes ─────────────────────────────────────────────────────

export const GameFactory = {
  /**
   * Returns a safe empty game state (used before the first API response).
   * @returns {GameState}
   */
  createEmpty() {
    return {
      sessionId:        null,
      word:             '',
      maskedWord:       '',
      guessed:          [],
      wrong:            [],
      hints:            [],
      difficulty:       'easy',
      status:           'idle',
      player:           null,
      ratingDelta:      0,
      wrongCount:       0,
      maxWrong:         6,
      lastGuessCorrect: null,
    };
  },
};

export const UserFactory = {
  /**
   * Returns a safe empty user shape (used as a loading placeholder).
   * @returns {User}
   */
  createEmpty() {
    return {
      id:          '',
      username:    '',
      email:       '',
      avatarColor: '#7c3aed',
      rating:      1000,
      wins:        0,
      losses:      0,
      games:       0,
      streak:      0,
      bestStreak:  0,
      winRate:     0,
      createdAt:   null,
    };
  },
};
