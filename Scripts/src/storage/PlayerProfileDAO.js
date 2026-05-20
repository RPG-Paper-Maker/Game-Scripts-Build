/**
 * PlayerProfileDAO.js
 * ──────────────────────────────────────────────
 * Data-Access Object for student player profiles.
 * Wraps IndexedDBManager transactional helpers to
 * provide a clean query/update API.
 */

import { IndexedDBManager } from './IndexedDBManager.js';

const STORE = 'profiles';

export class PlayerProfileDAO {
  /**
   * @param {IndexedDBManager} dbManager - An initialized IndexedDBManager instance
   */
  constructor(dbManager) {
    /** @type {IndexedDBManager} */
    this._db = dbManager;
  }

  // ── CRUD ───────────────────────────────────────────────────

  /**
   * Create a new player profile.
   * @param {object} profile
   * @param {string} profile.name
   * @param {object} [profile.metrics] - Initial metric snapshot
   * @returns {Promise<number>} The auto-generated profile ID
   */
  async create(profile) {
    const store = this._db.writeStore(STORE);
    const record = {
      ...profile,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metrics: profile.metrics ?? this._defaultMetrics(),
    };
    return IndexedDBManager.promisify(store.add(record));
  }

  /**
   * Retrieve a profile by its ID.
   * @param {number} id
   * @returns {Promise<object|undefined>}
   */
  async getById(id) {
    const store = this._db.readStore(STORE);
    return IndexedDBManager.promisify(store.get(id));
  }

  /**
   * Retrieve all profiles.
   * @returns {Promise<object[]>}
   */
  async getAll() {
    const store = this._db.readStore(STORE);
    return IndexedDBManager.promisify(store.getAll());
  }

  /**
   * Update a profile's metrics.
   * @param {number} id
   * @param {object} metricsUpdate - Partial metrics to merge
   * @returns {Promise<void>}
   */
  async updateMetrics(id, metricsUpdate) {
    const profile = await this.getById(id);
    if (!profile) throw new Error(`Profile ${id} not found.`);

    profile.metrics = { ...profile.metrics, ...metricsUpdate };
    profile.updatedAt = Date.now();

    const store = this._db.writeStore(STORE);
    return IndexedDBManager.promisify(store.put(profile));
  }

  /**
   * Delete a profile by ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const store = this._db.writeStore(STORE);
    return IndexedDBManager.promisify(store.delete(id));
  }

  // ── Helpers ────────────────────────────────────────────────

  /**
   * Return a blank metrics object for new profiles.
   * @returns {object}
   */
  _defaultMetrics() {
    return {
      totalCorrect: 0,
      totalErrors: 0,
      sessionsPlayed: 0,
      bestStreak: 0,
      averageResponseTime: 0,
      wipeCount: 0,
    };
  }
}
