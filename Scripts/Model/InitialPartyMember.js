/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Model } from "../index.js";
import { CHARACTER_KIND, GROUP_KIND, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/**
 * An initial party member of the game.
 */
export class InitialPartyMember extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Read the JSON associated to the initial party member.
     */
    read(json) {
        this.level = Model.DynamicValue.readOrDefaultNumber(json.level, 1);
        this.teamKind = Utils.valueOrDefault(json.teamKind, GROUP_KIND.TEAM);
        const isHero = Utils.valueOrDefault(json.isHero, true);
        this.characterKind = isHero ? CHARACTER_KIND.HERO : CHARACTER_KIND.MONSTER;
        this.heroID = Model.DynamicValue.readOrDefaultDatabase(isHero ? json.heroID : json.monsterID);
        this.variableInstanceID = Model.DynamicValue.readOrDefaultVariable(json.variableInstanceID);
    }
}
