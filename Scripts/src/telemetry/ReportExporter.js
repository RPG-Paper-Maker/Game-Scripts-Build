/**
 * ReportExporter.js
 * Queries IndexedDB telemetry/session data and triggers PDF generation.
 */

import { IndexedDBManager } from '../storage/IndexedDBManager.js';
import { PDFLayoutBuilder } from './PDFLayoutBuilder.js';

export class ReportExporter {
  /**
   * @param {IndexedDBManager} dbManager
   */
  constructor(dbManager) {
    this._db = dbManager;
    this._layoutBuilder = new PDFLayoutBuilder();
  }

  /**
   * Export a full session report as a PDF download.
   * @param {number} sessionId
   * @returns {Promise<Blob>} The generated PDF blob
   */
  async exportSession(sessionId) {
    const sessionData = await this._querySession(sessionId);
    const telemetry   = await this._queryTelemetry(sessionId);

    const blob = this._layoutBuilder.build({
      session: sessionData,
      telemetry,
    });

    return blob;
  }

  /**
   * Trigger a browser download of the PDF.
   * @param {Blob} blob
   * @param {string} [filename='IP2Live_Report.pdf']
   */
  download(blob, filename = 'IP2Live_Report.pdf') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** @private */
  async _querySession(sessionId) {
    const store = this._db.readStore('sessions');
    return IndexedDBManager.promisify(store.get(sessionId));
  }

  /** @private */
  async _queryTelemetry(sessionId) {
    const store = this._db.readStore('telemetry');
    const index = store.index('sessionId');
    return IndexedDBManager.promisify(index.getAll(sessionId));
  }
}
