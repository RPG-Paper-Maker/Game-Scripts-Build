/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Graphic } from "../index.js";
import { Paths, Platform, Utils } from '../Common/index.js';
import { Localization } from '../Model/index.js';
import { Base } from './Base.js';
/**
 * Handles all language data.
 */
export class Languages {
    /**
     * Get the main language ID.
     */
    static getMainLanguageID() {
        return this.listIDs[0];
    }
    /**
     * Get a language name by ID.
     */
    static get(id, errorMessage) {
        return Base.get(id, this.list, 'language', true, errorMessage);
    }
    /**
     * Get the index according to language ID.
     */
    static getIndexByID(id) {
        return this.listIDs.indexOf(id);
    }
    /**
     * Get the language graphics.
     */
    static getCommandsGraphics() {
        return this.listIDs.map((id) => new Graphic.Text(this.get(id)));
    }
    /**
     * Get the language callbacks.
     */
    static getCommandsCallbacks() {
        return this.listIDs.map(() => () => true);
    }
    /**
     * Read the JSON file associated with languages.
     */
    static async read() {
        const json = (await Platform.parseFileJSON(Paths.FILE_LANGS));
        this.listIDs = [];
        this.list = Utils.readJSONMap(json.langs, (element) => element.name, this.listIDs);
        this.extras = {
            loadAGame: new Localization(json.lag),
            loadAGameDescription: new Localization(json.lagd),
            slot: new Localization(json.sl),
            empty: new Localization(json.em),
            saveAGame: new Localization(json.sag),
            saveAGameDescription: new Localization(json.sagd),
            keyboardAssignment: new Localization(json.ka),
            keyboardAssignmentDescription: new Localization(json.kad),
            keyboardAssignmentSelectedDescription: new Localization(json.kasd),
            language: new Localization(json.l),
            languageDescription: new Localization(json.ld),
            languageSelectedDescription: new Localization(json.lsd),
            confirm: new Localization(json.co),
            ok: new Localization(json.ok),
            yes: new Localization(json.ye),
            no: new Localization(json.no),
            add: new Localization(json.ad),
            remove: new Localization(json.re),
            shop: new Localization(json.sh),
            buy: new Localization(json.bu),
            sell: new Localization(json.se),
            owned: new Localization(json.ow),
            selectAnAlly: new Localization(json.saa),
            victory: new Localization(json.vi),
            defeat: new Localization(json.de),
            levelUp: new Localization(json.lu),
            precision: new Localization(json.pr),
            critical: new Localization(json.cr),
            damage: new Localization(json.da),
            heal: new Localization(json.he),
            skill: new Localization(json.sk),
            performSkill: new Localization(json.ps),
            loading: new Localization(json.lo),
            equipQuestion: new Localization(json.eq),
            pressAnyKeys: new Localization(json.pak),
            target: new Localization(json.ta),
        };
    }
}
