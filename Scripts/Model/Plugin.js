/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * A custom plugin in the game.
 */
export class Plugin extends Base {
    constructor(id, json) {
        super(json);
        this.id = id;
    }
    /**
     * Reads the JSON data and initializes the plugin.
     */
    read(json) {
        this.name = json.name;
        this.author = Utils.valueOrDefault(json.author, '');
        this.version = Utils.valueOrDefault(json.version, '1.0.0');
        // Parameters
        this.parameters = {};
        for (const param of Utils.valueOrDefault(json.parameters, [])) {
            this.parameters[param.name] = DynamicValue.readOrDefaultNumber(param.defaultValue);
        }
        // Commands
        this.commands = {};
        this.commandsNames = new Map();
        for (const cmd of Utils.valueOrDefault(json.commands, [])) {
            this.commands[cmd.name] = null;
            this.commandsNames.set(cmd.id, cmd.name);
        }
    }
}
