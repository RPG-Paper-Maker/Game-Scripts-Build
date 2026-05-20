/**
 * ARFeedbackOverlay.js
 * Toggles wireframe and diagnostic scaffolding text for AR-style feedback.
 */

export class ARFeedbackOverlay {
  constructor(options = {}) {
    this.container = options.container ?? null;
    this._visible = false;
    this._lines = [];
  }

  init() {
    console.log('[ARFeedbackOverlay] Initialized.');
  }

  /** Toggle overlay visibility. */
  toggle() {
    this._visible = !this._visible;
    // TODO: Show/hide the overlay DOM element
  }

  /** Show the overlay. */
  show() { this._visible = true; }

  /** Hide the overlay. */
  hide() { this._visible = false; }

  /**
   * Push a diagnostic line to the overlay.
   * @param {string} text
   * @param {string} [level='info'] - 'info' | 'warn' | 'error'
   */
  addLine(text, level = 'info') {
    this._lines.push({ text, level, timestamp: Date.now() });
    // TODO: Append to DOM
  }

  /** Clear all diagnostic lines. */
  clearLines() {
    this._lines = [];
    // TODO: Clear DOM children
  }

  destroy() {
    this.hide();
    this._lines = [];
    console.log('[ARFeedbackOverlay] Destroyed.');
  }
}
