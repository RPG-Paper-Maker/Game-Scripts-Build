/**
 * PDFLayoutBuilder.js
 * Formats queried session data into a clean, minimalist PDF layout.
 * Uses jsPDF (add to package.json: "jspdf": "^2.5.1")
 */

export class PDFLayoutBuilder {
  constructor() {
    /** @type {object|null} jsPDF instance (lazy-loaded) */
    this._doc = null;
  }

  /**
   * Build a PDF blob from session + telemetry data.
   * @param {object} data
   * @param {object} data.session   - Session record
   * @param {object[]} data.telemetry - Telemetry data points
   * @returns {Blob}
   */
  build({ session, telemetry }) {
    // TODO: Replace with actual jsPDF calls once dependency is installed
    // const { jsPDF } = await import('jspdf');
    // this._doc = new jsPDF();

    console.log('[PDFLayoutBuilder] Building PDF…', { session, telemetry });

    // Placeholder — return an empty blob until jsPDF is wired up
    return new Blob(['PDF placeholder'], { type: 'application/pdf' });
  }

  /** @private Add the report header section. */
  _addHeader(title) {
    // TODO: Title, date, student name
  }

  /** @private Add a metrics summary table. */
  _addMetricsSummary(session) {
    // TODO: Correct/error ratio, streaks, wipes, heat peaks
  }

  /** @private Add telemetry time-series section. */
  _addTelemetryChart(telemetry) {
    // TODO: Simple table or sparkline representation
  }

  /** @private Add footer with page numbers. */
  _addFooter() {
    // TODO: Page numbering
  }
}
