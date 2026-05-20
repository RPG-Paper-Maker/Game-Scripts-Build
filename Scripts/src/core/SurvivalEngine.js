/**
 * SurvivalEngine.js
 * ──────────────────────────────────────────────
 * Manages the survival-loop mechanics:
 *   • Neural Deck   – the card/question queue
 *   • System Heat   – escalating difficulty pressure
 *   • Wipe tracking – consecutive-failure state resets
 *
 * Emits events that the HUDController and PerformanceLogger consume.
 */

export class SurvivalEngine {
  /**
   * @param {object} options
   * @param {number} [options.maxHeat=100]        - Heat ceiling before forced wipe
   * @param {number} [options.heatPerError=15]    - Heat gained per wrong answer
   * @param {number} [options.heatDecayRate=1]    - Heat lost per tick on correct streaks
   * @param {number} [options.wipePenalty=3]       - Lives / cards lost on wipe
   */
  constructor(options = {}) {
    /** @type {number} Current heat level (0 – maxHeat) */
    this.heat = 0;

    /** @type {number} */
    this.maxHeat = options.maxHeat ?? 100;

    /** @type {number} */
    this.heatPerError = options.heatPerError ?? 15;

    /** @type {number} */
    this.heatDecayRate = options.heatDecayRate ?? 1;

    /** @type {number} */
    this.wipePenalty = options.wipePenalty ?? 3;

    /** @type {number} Total wipes this session */
    this.wipeCount = 0;

    /** @type {object[]} The active Neural Deck queue */
    this._deck = [];

    /** @type {Function[]} Registered event listeners */
    this._listeners = [];
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Load a set of question cards into the Neural Deck.
   * @param {object[]} cards - Array of card objects
   */
  loadDeck(cards) {
    this._deck = [...cards];
    this._emit('deckLoaded', { count: this._deck.length });
  }

  /**
   * Draw the next card from the deck.
   * @returns {object|null} The next card, or null if deck is empty
   */
  drawCard() {
    if (this._deck.length === 0) return null;
    const card = this._deck.shift();
    this._emit('cardDrawn', { card, remaining: this._deck.length });
    return card;
  }

  /**
   * Record a correct answer — decay heat.
   */
  recordCorrect() {
    this.heat = Math.max(0, this.heat - this.heatDecayRate);
    this._emit('answerCorrect', { heat: this.heat });
  }

  /**
   * Record a wrong answer — increase heat, check for wipe.
   */
  recordError() {
    this.heat = Math.min(this.maxHeat, this.heat + this.heatPerError);
    this._emit('answerError', { heat: this.heat });

    if (this.heat >= this.maxHeat) {
      this._triggerWipe();
    }
  }

  /**
   * Tick the engine (called once per frame or fixed interval).
   * @param {number} deltaTime - Elapsed time in ms
   */
  tick(deltaTime) {
    // TODO: Implement time-based heat decay, deck refresh, etc.
  }

  /**
   * Subscribe to engine events.
   * @param {Function} callback - Receives (eventName, payload)
   */
  on(callback) {
    this._listeners.push(callback);
  }

  // ── Internal ───────────────────────────────────────────────

  /** Trigger a wipe — reset heat and penalise the deck. */
  _triggerWipe() {
    this.wipeCount += 1;
    this.heat = 0;

    // Remove cards as penalty
    for (let i = 0; i < this.wipePenalty && this._deck.length > 0; i++) {
      this._deck.pop();
    }

    this._emit('wipe', {
      wipeCount: this.wipeCount,
      remaining: this._deck.length,
    });
  }

  /**
   * Emit a named event to all listeners.
   * @param {string} name
   * @param {object} payload
   */
  _emit(name, payload) {
    for (const fn of this._listeners) {
      try {
        fn(name, payload);
      } catch (err) {
        console.error(`[SurvivalEngine] Listener error on "${name}":`, err);
      }
    }
  }
}
