/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants, IO } from './index.js';
let firstError = true;
/**
 * A class replaced according to te platform used (desktop, browser, mobile...)
 *
 * @class Platform
 */
class Platform {
    /**
     * Creates an instance of Platform.
     * @memberof Platform
     */
    constructor() {
        throw new Error('This class is static.');
    }
    /**
     *  Load a file.
     *  @static
     */
    static async loadFile(path, forcePath = false) {
        if (forcePath) {
            path = Platform.ROOT_DIRECTORY + '/' + path;
        }
        return await IO.openFile(path);
    }
    /**
     *  Parse a JSON file
     *  @static
     */
    static async parseFileJSON(path) {
        return await IO.parseFileJSON(path);
    }
    /**
     *  Load a save.
     *  @static
     */
    static async loadSave(slot, path) {
        if (await IO.fileExists(path)) {
            return await Platform.parseFileJSON(path);
        }
        return null;
    }
    /**
     *  Register a save.
     *  @static
     */
    static async registerSave(slot, path, json) {
        await IO.saveFile(path, json);
    }
    /**
     *  Show an error object.
     *  @static
     *  @param {Error} e - The error message
     */
    static showError(e) {
        Platform.showErrorMessage(e.message + Constants.STRING_NEW_LINE + e.stack, false);
    }
    /**
     *  Show an error message.
     *  @static
     *  @param {string} msg - The error message
     *  @param {boolean} displayDialog - Indicates if you need to display the
     *  dialog box
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
    /**
     *  Check if there is a specific mode test (app args).
     *  @static
     *  @returns {boolean}
     */
    static isModeTestNormal() {
        return true;
    }
}
Platform.ROOT_DIRECTORY = './build/';
Platform.IS_DESKTOP = false;
Platform.screenWidth = window.screen.width;
Platform.screenHeight = window.screen.height;
Platform.DESKTOP = true;
Platform.WEB_DEV = false;
Platform.MODE_TEST = undefined;
Platform.MODE_TEST_BATTLE_TROOP = 'battleTroop';
Platform.MODE_TEST_SHOW_TEXT_PREVIEW = 'showTextPreview';
Platform.canvas3D = document.getElementById('three-d');
Platform.canvasHUD = document.getElementById('hud');
Platform.canvasVideos = document.getElementById('video-container');
Platform.canvasRendering = document.getElementById('rendering');
Platform.ctx = (Platform.canvasHUD.getContext('2d', { willReadFrequently: true }));
Platform.ctxr = (Platform.canvasRendering.getContext('2d', { willReadFrequently: true }));
/**
 *  Set window title.
 *  @static
 *  @param {string} title - The title to display
 */
Platform.setWindowTitle = function (title) {
    window.ipcRenderer.send('change-window-title', title);
};
/**
 *  Set window size.
 *  @static
 *  @param {number} w - The window width
 *  @param {number} h - The window height
 *  @param {boolean} f - Indicate if the window is fullscreen
 */
Platform.setWindowSize = function (w, h, f) {
    window.ipcRenderer.send('change-window-size', w, h, f);
};
/**
 *  Quit app.
 *  @static
 */
Platform.quit = function () {
    window.close();
};
/**
 *  Check if a file exists.
 *  @static
 *  @param {string} path - The path of the file
 *  @returns {Promise<boolean>}
 */
Platform.fileExists = async function (path) {
    return await IO.fileExists(path);
};
export { Platform };
