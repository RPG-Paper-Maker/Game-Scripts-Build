/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data } from '../index.js';
import { Base } from './Base.js';
/**
 * Represents a name that can have multiple translations
 * depending on the current game language.
 */
export class Localization extends Base {
    constructor(json) {
        super(json);
        this.names ?? (this.names = new Map());
    }
    /**
     * Gets the name corresponding to the current game language.
     * @returns The localized name, or an empty string if not available.
     */
    name() {
        return this.names.get(Data.Settings.currentLanguage) ?? '';
    }
    /**
     * Updates a name for a specific language according to an event command list.
     * @param command - The event command list containing language ID and name.
     * @param iterator - The current iterator position in the command list.
     */
    getCommand(command, iterator) {
        const id = Number(command[iterator.i++]);
        const name = String(command[iterator.i++]);
        this.names.set(id, name);
    }
    /**
     * Reads the JSON data describing the translatable name.
     * @param json - The JSON object containing the names in several languages.
     */
    read(json) {
        this.names = new Map(Object.entries(json.names).map(([key, value]) => [Number(key), value]));
    }
}
