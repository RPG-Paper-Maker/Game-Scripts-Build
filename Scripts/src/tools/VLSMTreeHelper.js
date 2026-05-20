/**
 * VLSMTreeHelper.js
 * Builds and renders a VLSM allocation tree visualisation.
 */

export class VLSMTreeHelper {
  constructor(options = {}) {
    this.container = options.container ?? null;
    this._visible = false;
    this._tree = null;
  }

  show() { this._visible = true; }
  hide() { this._visible = false; }

  /**
   * Build a VLSM tree from requirements.
   * @param {string} baseNetwork - e.g. "192.168.1.0"
   * @param {number} prefix - e.g. 24
   * @param {number[]} hostCounts - Required hosts per subnet, sorted descending
   * @returns {object} The generated tree structure
   */
  buildTree(baseNetwork, prefix, hostCounts) {
    // TODO: Implement VLSM binary-tree subdivision
    this._tree = { baseNetwork, prefix, hostCounts, nodes: [] };
    return this._tree;
  }

  /** @returns {object|null} Current tree data */
  getTree() { return this._tree; }

  /** Clear the tree. */
  clear() { this._tree = null; }

  destroy() {
    this.hide();
    this.clear();
  }
}
