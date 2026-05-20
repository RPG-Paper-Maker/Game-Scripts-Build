/**
 * ToolManager.js
 * Central registry for interactive student tools (BinaryPad, SubnetOverlay, VLSMTree).
 */

export class ToolManager {
  constructor() {
    /** @type {Map<string, object>} Registered tool instances by name */
    this._tools = new Map();
    /** @type {string|null} Currently active tool key */
    this._activeTool = null;
  }

  /**
   * Register a tool instance.
   * @param {string} name
   * @param {object} toolInstance - Must implement show(), hide(), destroy()
   */
  register(name, toolInstance) {
    this._tools.set(name, toolInstance);
  }

  /**
   * Activate a tool by name (hides any currently active tool first).
   * @param {string} name
   */
  activate(name) {
    if (this._activeTool) this.deactivate();
    const tool = this._tools.get(name);
    if (!tool) { console.warn(`[ToolManager] Unknown tool: ${name}`); return; }
    tool.show();
    this._activeTool = name;
  }

  /** Deactivate the current tool. */
  deactivate() {
    if (!this._activeTool) return;
    const tool = this._tools.get(this._activeTool);
    if (tool) tool.hide();
    this._activeTool = null;
  }

  /** @returns {string|null} */
  getActiveTool() { return this._activeTool; }

  destroy() {
    for (const [, tool] of this._tools) tool.destroy?.();
    this._tools.clear();
    this._activeTool = null;
  }
}
