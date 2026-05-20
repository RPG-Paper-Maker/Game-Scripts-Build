/**
 * SubnetOverlay.js
 * Visual overlay that displays subnet boundaries and address ranges.
 */

export class SubnetOverlay {
  constructor(options = {}) {
    this.container = options.container ?? null;
    this._visible = false;
    this._subnets = [];
  }

  show() { this._visible = true; /* TODO: render */ }
  hide() { this._visible = false; /* TODO: remove */ }

  /**
   * Load subnet data to visualise.
   * @param {object[]} subnets - Array of { network, mask, firstHost, lastHost, broadcast }
   */
  loadSubnets(subnets) {
    this._subnets = subnets;
    // TODO: Render subnet blocks
  }

  /** Clear all rendered subnets. */
  clear() { this._subnets = []; }

  destroy() {
    this.hide();
    this.clear();
  }
}
