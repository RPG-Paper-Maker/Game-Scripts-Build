/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform } from '../Common/index.js';
import { Base } from './Base.js';
/**
 * Handles all variable data.
 */
export class Variables {
    /**
     * Get the variable name by ID.
     */
    static get(id) {
        return Base.get(id, this.names, 'variable name');
    }
    /**
     * Get the variable default value by ID.
     */
    static getDefaultValue(id) {
        return this.defaultValues?.get(id) ?? 0;
    }
    /**
     * Read the JSON file associated with variables.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_VARIABLES));
        this.names = new Map();
        this.defaultValues = new Map();
        for (const page of json.variables) {
            for (const variable of page.list) {
                this.names.set(variable.id, variable.name);
                this.defaultValues.set(variable.id, variable.dv ?? 0);
            }
        }
    }
}
Variables.VARIABLES_PER_PAGE = 25;
