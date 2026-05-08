/**
 * @module GameEventBus
 * @description Observer Pattern — decoupled event notification system.
 *
 * Components subscribe to game events (win, lose, guess, streak) without
 * knowing who publishes them. Publishers emit events without knowing
 * who is listening.
 *
 * Design Pattern : Observer (Pub/Sub variant)
 * SOLID Principle: Dependency Inversion — high-level modules depend on
 *                  this abstraction, not on each other directly.
 *
 * Usage:
 *   GameEventBus.on('game:won', handler)
 *   GameEventBus.emit('game:won', { player, ratingDelta })
 *   GameEventBus.off('game:won', handler)
 */

// ─── Supported event types ────────────────────────────────────────────────────
export const GAME_EVENTS = {
  GAME_WON:        'game:won',
  GAME_LOST:       'game:lost',
  LETTER_CORRECT:  'game:letter:correct',
  LETTER_WRONG:    'game:letter:wrong',
  STREAK_UPDATED:  'game:streak:updated',
  RATING_CHANGED:  'game:rating:changed',
  GAME_STARTED:    'game:started',
};

// ─── Internal subscriber map ──────────────────────────────────────────────────
const subscribers = new Map(); // eventType -> Set<handler>

const GameEventBus = {
  /**
   * Subscribe to an event.
   * @param {string}   event
   * @param {Function} handler
   */
  on(event, handler) {
    if (!subscribers.has(event)) {
      subscribers.set(event, new Set());
    }
    subscribers.get(event).add(handler);
  },

  /**
   * Unsubscribe from an event.
   * @param {string}   event
   * @param {Function} handler
   */
  off(event, handler) {
    subscribers.get(event)?.delete(handler);
  },

  /**
   * Emit an event to all subscribers.
   * @param {string} event
   * @param {any}    payload
   */
  emit(event, payload) {
    subscribers.get(event)?.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[GameEventBus] Handler error on "${event}":`, err);
      }
    });
  },

  /**
   * Subscribe once — auto-unsubscribes after first call.
   * @param {string}   event
   * @param {Function} handler
   */
  once(event, handler) {
    const wrapper = payload => {
      handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  },

  /**
   * Remove all subscribers for an event (useful in tests).
   * @param {string} event
   */
  clear(event) {
    subscribers.delete(event);
  },

  /** Remove every subscriber (reset for tests). */
  clearAll() {
    subscribers.clear();
  },
};

export default GameEventBus;
