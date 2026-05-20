/**
 * BinaryPad.js
 * Interactive binary ↔ decimal conversion pad for students.
 */

export class BinaryPad {
  constructor(options = {}) {
    this.container = options.container ?? null;
    this._bits = new Uint8Array(8); // 8-bit pad
    this._visible = false;
  }

  show() { this._visible = true; /* TODO: render DOM */ }
  hide() { this._visible = false; /* TODO: remove DOM */ }

  /**
   * Toggle a specific bit position.
   * @param {number} index - 0 (MSB) to 7 (LSB)
   */
  toggleBit(index) {
    if (index < 0 || index > 7) return;
    this._bits[index] = this._bits[index] ? 0 : 1;
  }

  /** @returns {string} e.g. "11000000" */
  getBinaryString() {
    return Array.from(this._bits).join('');
  }

  /** @returns {number} Decimal value of current bits */
  getDecimalValue() {
    return parseInt(this.getBinaryString(), 2);
  }

  /** Reset all bits to 0. */
  reset() { this._bits.fill(0); }

  destroy() {
    this.hide();
    this.reset();
  }
}
