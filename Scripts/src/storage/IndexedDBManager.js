// Scripts/src/storage/IndexedDBManager.js

class IndexedDBManager {
    constructor() {
        this.dbName = 'IP2Live_Database';
        this.dbVersion = 1; // Increase this if you ever need to change the database structure later
        this.db = null;
    }

    /**
     * Initializes the connection to the browser's native IndexedDB.
     * Creates the required object stores if they don't exist.
     */
    initDB() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            // This event only triggers if the DB doesn't exist or the version number increases
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Store 1: Player Profiles (Key: infiltratorName)
                if (!db.objectStoreNames.contains('profiles')) {
                    db.createObjectStore('profiles', { keyPath: 'infiltratorName' });
                    console.log("IndexedDB: 'profiles' store created.");
                }

                // Store 2: Stage Telemetry & Performance (Key: auto-incrementing ID)
                if (!db.objectStoreNames.contains('telemetry')) {
                    const telemetryStore = db.createObjectStore('telemetry', { keyPath: 'id', autoIncrement: true });
                    // Create indexes so we can easily search logs by player or by stage
                    telemetryStore.createIndex('infiltratorName', 'infiltratorName', { unique: false });
                    telemetryStore.createIndex('stageId', 'stageId', { unique: false });
                    console.log("IndexedDB: 'telemetry' store created.");
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log(`IndexedDB: Successfully connected to ${this.dbName}`);
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("IndexedDB Connection Error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Generic method to add or update a record in a specific store.
     */
    async saveRecord(storeName, data) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data); // 'put' adds a new record or updates an existing one

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * Generic method to retrieve a record by its primary key.
     */
    async getRecord(storeName, key) {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
}

// Export as a singleton so the exact same DB connection is shared across the entire game
export const dbManager = new IndexedDBManager();
