/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO } from './index.js';
let firstError = true;
/**
 * Provides platform-specific utilities for file access, window management,
 * rendering contexts, and error reporting.
 *
 * This class is static-only and adapts behavior depending on the runtime
 * environment (desktop, browser, mobile).
 */
export class Platform {
    // -------------------------------------------------------------------------
    // Window management
    // -------------------------------------------------------------------------
    /**
     * Change the app window title.
     * @param title - Title to display.
     */
    static setWindowTitle(title) {
        window.ipcRenderer.send('change-window-title', title);
    }
    /**
     * Change the app window size.
     * @param w - Width in pixels.
     * @param h - Height in pixels.
     * @param fullscreen - Whether to switch to fullscreen.
     */
    static setWindowSize(w, h, fullscreen) {
        window.ipcRenderer.send('change-window-size', w, h, fullscreen);
    }
    /**
     * Quit the application.
     */
    static quit() {
        window.close();
    }
    // -------------------------------------------------------------------------
    // File I/O
    // -------------------------------------------------------------------------
    /**
     * Check if a file exists.
     * @param path - File path.
     * @returns True if file exists.
     */
    static async fileExists(path) {
        return IO.fileExists(path);
    }
    /**
     * Load a file as text.
     * @param path - File path.
     * @param forcePath - If true, prepends {@link ROOT_DIRECTORY}.
     */
    static async loadFile(path, forcePath = false) {
        if (forcePath) {
            path = Platform.ROOT_DIRECTORY + '/' + path;
        }
        return IO.openFile(path);
    }
    /**
     * Load and parse a JSON file.
     * @param path - File path.
     */
    static async parseFileJSON(path) {
        return IO.parseFileJSON(path);
    }
    /**
     * Load a save file.
     * @param slot - Save slot index.
     * @param path - File path.
     */
    static async loadSave(_slot, path) {
        if (await IO.fileExists(path)) {
            return Platform.parseFileJSON(path);
        }
        return null;
    }
    /**
     * Register (write) a save file.
     * @param slot - Save slot index.
     * @param path - File path.
     * @param json - Save data.
     */
    static async registerSave(_slot, path, json) {
        await IO.saveFile(path, json);
    }
    /**
     * Write a file.
     * @param path - File path.
     * @param json - json data.
     */
    static async writeFile(path, json) {
        await IO.saveFile(path, json);
    }
    // -------------------------------------------------------------------------
    // Error handling
    // -------------------------------------------------------------------------
    /**
     * Show an error object.
     * @param e - Error instance.
     */
    static showError(e) {
        Platform.showErrorMessage(`${e.message}\n${e.stack}`, false);
    }
    /**
     * Show an error message.
     * @param msg - Error message.
     * @param displayDialog - Whether to also display a dialog box.
     */
    static showErrorMessage(msg, displayDialog = true) {
        if (firstError) {
            firstError = false;
            window.ipcRenderer.send('window-error', msg);
            if (displayDialog) {
                window.ipcRenderer.send('dialog-error-message', msg);
            }
            throw new Error(msg);
        }
    }
    // -------------------------------------------------------------------------
    // Mode helpers
    // -------------------------------------------------------------------------
    /**
     * Check if the app is running in normal test mode (battles).
     */
    static isModeTestNormal() {
        return true;
    }
}
// -------------------------------------------------------------------------
// Environment flags
// -------------------------------------------------------------------------
/** Root directory for build assets. */
Platform.ROOT_DIRECTORY = './build/';
/** Whether the app runs as a desktop build. */
Platform.IS_DESKTOP = true;
/** Whether the app is running in web development mode. */
Platform.WEB_DEV = false;
/** Active test mode identifier (if any). */
Platform.MODE_TEST = undefined;
/** Mode constant for troop battle test. */
Platform.MODE_TEST_BATTLE_TROOP = 'battleTroop';
/** Mode constant for text preview test. */
Platform.MODE_TEST_SHOW_TEXT_PREVIEW = 'showTextPreview';
// -------------------------------------------------------------------------
// Screen & canvas
// -------------------------------------------------------------------------
/** Current screen width in pixels. */
Platform.screenWidth = window.screen.width;
/** Current screen height in pixels. */
Platform.screenHeight = window.screen.height;
/** Main 3D rendering canvas. */
Platform.canvas3D = document.getElementById('three-d');
/** HUD (2D overlay) canvas. */
Platform.canvasHUD = document.getElementById('hud');
/** Video rendering container element. */
Platform.canvasVideos = document.getElementById('video-container');
/** Offscreen rendering canvas. */
Platform.canvasRendering = document.getElementById('rendering');
/** HUD rendering context (2D). */
Platform.ctx = Platform.canvasHUD.getContext('2d', { willReadFrequently: true });
/** Offscreen rendering context (2D). */
Platform.ctxr = Platform.canvasRendering.getContext('2d', {
    willReadFrequently: true,
});
