/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform } from '../Common/index.js';
import { Graphic, Scene } from '../index.js';
import { Keyboard } from '../Model/index.js';
import { Base } from './Base.js';
import { Settings } from './Settings.js';
/**
 * Handles all keyboard data.
 */
export class Keyboards {
    /**
     * Get a keyboard by ID.
     */
    static get(id, errorMessage) {
        return Base.get(id, this.list, 'keyboard', true, errorMessage);
    }
    /**
     * Get the graphics commands.
     */
    static getCommandsGraphics() {
        return this.listIDs.map((id) => new Graphic.Keyboard(this.get(id)));
    }
    /**
     * Get the actions commands.
     */
    static getCommandsActions() {
        return this.listIDs.map(() => Scene.KeyboardAssign.prototype.updateKey);
    }
    /**
     * Check if a key string matches a keyboard shortcut.
     */
    static isKeyEqual(key, abr) {
        if (!abr)
            return false;
        for (const shortcuts of abr.sc) {
            if (shortcuts.length === 1 && shortcuts[0].toUpperCase() === key.toUpperCase()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Check if key is cancelling menu.
     */
    static checkCancelMenu(key) {
        return this.isKeyEqual(key, this.menuControls.Cancel) || this.isKeyEqual(key, this.controls.MainMenu);
    }
    /**
     * Check if key is cancelling.
     */
    static checkCancel(key) {
        return this.isKeyEqual(key, this.menuControls.Cancel);
    }
    /**
     * Check if key is action menu.
     */
    static checkActionMenu(key) {
        return this.isKeyEqual(key, this.menuControls.Action);
    }
    /**
     * Read the JSON file associated with keyboards.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_KEYBOARD));
        // Shortcuts
        this.list = new Map();
        this.listIDs = new Array(json.list.length);
        for (const [index, jsonKey] of json.list.entries()) {
            const id = jsonKey.id;
            const abbreviation = jsonKey.abr;
            const key = new Keyboard(jsonKey);
            const sc = Settings.kb.get(id);
            if (sc) {
                key.sc = sc;
            }
            this.list.set(id, key);
            this.listIDs[index] = id;
            this.controls[abbreviation] = key;
        }
        // Menu controls
        this.menuControls = {
            Action: this.get(json['a']),
            Cancel: this.get(json['c']),
            Up: this.get(json['u']),
            Down: this.get(json['d']),
            Left: this.get(json['l']),
            Right: this.get(json['r']),
        };
    }
}
Keyboards.controls = {};
