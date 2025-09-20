/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Paths, Platform, Utils } from '../Common/index.js';
import { Animation } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all animation data.
 */
export class Animations {
    /**
     *  Get the animation by ID.
     */
    static get(id) {
        return Base.get(id, this.list, 'animation');
    }
    /**
     * Read the JSON file associated with animations.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_ANIMATIONS));
        this.list = Utils.readJSONMap(json.animations, Animation);
    }
}
