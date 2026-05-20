/**
 * JunctionBoxUI.js
 * Stage 1-4 input overlays for networking challenges.
 */

export class JunctionBoxUI {
  constructor(options = {}) {
    this.container = options.container ?? null;
    this._activeStage = null;
    this._inputFields = [];
    this._onSubmit = null;
  }

  init() {
    console.log('[JunctionBoxUI] Initialized.');
  }

  /**
   * Show the overlay for a given stage.
   * @param {number} stage - Stage number (1-4)
   * @param {object} config - Stage-specific field configuration
   * @param {Function} onSubmit - Callback receiving the student's answers
   */
  show(stage, config, onSubmit) {
    this._activeStage = stage;
    this._onSubmit = onSubmit;
    // TODO: Build DOM overlay with input fields per config
  }

  hide() {
    this._activeStage = null;
    this._inputFields = [];
    // TODO: Remove overlay DOM
  }

  /** Collect current input values and fire the submit callback. */
  submit() {
    if (!this._onSubmit) return;
    const values = this._inputFields.map(f => f.value ?? '');
    this._onSubmit(values);
  }

  destroy() {
    this.hide();
    console.log('[JunctionBoxUI] Destroyed.');
  }
}
