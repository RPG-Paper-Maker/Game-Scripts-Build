/**
 * PerformanceLogger.js
 * Pushes real-time gameplay metrics to IndexedDB telemetry store.
 */

import { IndexedDBManager } from '../storage/IndexedDBManager.js';

const STORE = 'telemetry';

export class PerformanceLogger {
  /**
   * @param {IndexedDBManager} dbManager
   */
  constructor(dbManager) {
    this._db = dbManager;
    this._sessionId = null;
    this._buffer = [];
    this._flushInterval = null;
  }

  /**
   * Start logging for a session.
   * @param {number} sessionId
   * @param {number} [flushMs=5000] - Auto-flush interval
   */
  start(sessionId, flushMs = 5000) {
    this._sessionId = sessionId;
    this._flushInterval = setInterval(() => this.flush(), flushMs);
  }

  /**
   * Record a metric data point.
   * @param {string} metric - Metric name (e.g. 'responseTime', 'heatLevel')
   * @param {*} value
   */
  log(metric, value) {
    this._buffer.push({
      sessionId: this._sessionId,
      metric,
      value,
      timestamp: Date.now(),
    });
  }

  /** Flush buffered data points to IndexedDB. */
  async flush() {
    if (this._buffer.length === 0) return;
    const batch = this._buffer.splice(0);
    const store = this._db.writeStore(STORE);
    for (const entry of batch) {
      store.add(entry);
    }
  }

  /** Stop logging and flush remaining data. */
  async stop() {
    if (this._flushInterval) clearInterval(this._flushInterval);
    this._flushInterval = null;
    await this.flush();
  }
}
