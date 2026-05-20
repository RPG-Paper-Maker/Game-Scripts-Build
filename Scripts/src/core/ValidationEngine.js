/**
 * ValidationEngine.js
 * ──────────────────────────────────────────────
 * Math validation module for networking concepts:
 *   • Subnetting (classful & classless)
 *   • CIDR notation parsing and verification
 *   • VLSM address allocation
 *
 * All methods are pure functions that return
 * { valid: boolean, expected: *, actual: *, feedback: string }
 */

export class ValidationEngine {
  constructor() {
    /** @type {Map<string, Function>} Registry of named validators */
    this._validators = new Map();
    this._registerDefaults();
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Validate a student's subnet mask answer.
   * @param {string} cidr      - e.g. "/24"
   * @param {string} answer    - Student-provided subnet mask
   * @returns {{ valid: boolean, expected: string, actual: string, feedback: string }}
   */
  validateSubnetMask(cidr, answer) {
    const prefix = this._parseCIDR(cidr);
    const expected = this._prefixToMask(prefix);
    const valid = answer.trim() === expected;
    return {
      valid,
      expected,
      actual: answer.trim(),
      feedback: valid
        ? 'Correct subnet mask.'
        : `Expected ${expected} for ${cidr}.`,
    };
  }

  /**
   * Validate a CIDR notation answer.
   * @param {string} subnetMask - e.g. "255.255.255.0"
   * @param {string} answer     - Student-provided CIDR string
   * @returns {{ valid: boolean, expected: string, actual: string, feedback: string }}
   */
  validateCIDR(subnetMask, answer) {
    const expected = '/' + this._maskToPrefix(subnetMask);
    const valid = answer.trim() === expected;
    return {
      valid,
      expected,
      actual: answer.trim(),
      feedback: valid
        ? 'Correct CIDR notation.'
        : `Expected ${expected} for mask ${subnetMask}.`,
    };
  }

  /**
   * Validate a VLSM allocation answer.
   * @param {object}   params
   * @param {string}   params.networkAddress - Base network (e.g. "192.168.1.0")
   * @param {number}   params.prefix         - Starting prefix length
   * @param {number[]} params.hostCounts     - Required hosts per subnet (sorted desc)
   * @param {object[]} params.answers        - Student-provided allocations
   * @returns {{ valid: boolean, results: object[], feedback: string }}
   */
  validateVLSM({ networkAddress, prefix, hostCounts, answers }) {
    // TODO: Implement full VLSM walk and comparison
    return {
      valid: false,
      results: [],
      feedback: 'VLSM validation not yet implemented.',
    };
  }

  // ── Internal Helpers ───────────────────────────────────────

  /** Register built-in validator functions. */
  _registerDefaults() {
    this._validators.set('subnetMask', this.validateSubnetMask.bind(this));
    this._validators.set('cidr', this.validateCIDR.bind(this));
    this._validators.set('vlsm', this.validateVLSM.bind(this));
  }

  /**
   * Parse a CIDR string to a numeric prefix length.
   * @param {string} cidr - e.g. "/24" or "24"
   * @returns {number}
   */
  _parseCIDR(cidr) {
    return parseInt(cidr.replace('/', ''), 10);
  }

  /**
   * Convert a prefix length to a dotted-decimal subnet mask.
   * @param {number} prefix
   * @returns {string}
   */
  _prefixToMask(prefix) {
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    return [
      (mask >>> 24) & 0xFF,
      (mask >>> 16) & 0xFF,
      (mask >>> 8)  & 0xFF,
      mask          & 0xFF,
    ].join('.');
  }

  /**
   * Convert a dotted-decimal mask to a prefix length.
   * @param {string} mask
   * @returns {number}
   */
  _maskToPrefix(mask) {
    const binary = mask
      .split('.')
      .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
      .join('');
    return (binary.match(/1/g) || []).length;
  }
}
