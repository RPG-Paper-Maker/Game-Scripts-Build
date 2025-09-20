/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data } from "../index.js";
import { Platform } from './Platform.js';
/**
 * A static utility class for Input/Output operations:
 * - Loading text and JSON files
 * - Checking file existence
 * - Saving JSON files (desktop only)
 */
export class IO {
    /**
     * Check if a file exists at the given URL.
     * @param url - The path of the file.
     * @returns A promise resolving to `true` if the file exists, `false` otherwise.
     */
    static async fileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Load the contents of a text file.
     * @param url - The path of the file.
     * @returns A promise resolving to the file's contents as a string.
     */
    static async openFile(url) {
        const response = await fetch(url);
        if (!response.ok && response.status !== 0) {
            throw new Error(`Failed to load file: ${url} (status ${response.status})`);
        }
        return await response.text();
    }
    /**
     * Load and parse a JSON file.
     * If the project is protected (`Data.Settings.isProtected`), the content will be
     * base64-decoded before parsing.
     * @param url - The path of the file.
     * @returns A promise resolving to the parsed JSON object, or `{}` if parsing fails.
     */
    static async parseFileJSON(url) {
        let content = await Platform.loadFile(url);
        if (Data.Settings.isProtected) {
            content = atob(content);
        }
        try {
            return JSON.parse(content);
        }
        catch {
            console.warn(`Failed to parse JSON file: ${url}`);
            return {};
        }
    }
    /**
     * Save an object to a JSON file (desktop only).
     * If the project is protected (`Data.Settings.isProtected`), the content will be
     * base64-encoded before saving.
     * @param path - The path of the file to save.
     * @param obj - The object to stringify and save.
     * @throws If saving fails or running in a browser environment.
     */
    static async saveFile(path, obj) {
        let content = JSON.stringify(obj);
        if (Data.Settings.isProtected) {
            content = btoa(content);
        }
        window.ipcRenderer.send('save-file', path, content);
    }
}
