/**
 * HUDController.js
 * Manages HUD elements: health/shield bars, heat gauge, timer, streak counter.
 */

export class HUDController {
  constructor(options = {}) {
    this.container = options.container ?? null;
    this._elapsedTime = 0;
    this._timerActive = false;
    this._elements = {};
  }

  init() {
    if (!this.container) {
      console.warn('[HUDController] No container; skipping init.');
      return;
    }
    console.log('[HUDController] Initialized.');
  }

  tick(deltaTime) {
    if (this._timerActive) this._elapsedTime += deltaTime;
  }

  setHealthRatio(ratio) { /* TODO */ }
  setShieldRatio(ratio) { /* TODO */ }
  setHeat(heat, maxHeat) { /* TODO */ }

  startTimer() { this._timerActive = true; }
  pauseTimer() { this._timerActive = false; }
  resetTimer() { this._elapsedTime = 0; this._timerActive = false; }

  getFormattedTime() {
    const total = Math.floor(this._elapsedTime / 1000);
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  setStreak(streak) { /* TODO */ }

  destroy() {
    this._elements = {};
    console.log('[HUDController] Destroyed.');
  }
}
