/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data } from "../index.js";
import { EFFECT_KIND, STATUS_RESTRICTIONS_KIND, Utils } from '../Common/index.js';
import { Characteristic } from './Characteristic.js';
import { DynamicValue } from './DynamicValue.js';
import { Effect } from './Effect.js';
import { Icon } from './Icon.js';
import { StatusReleaseTurn } from './StatusReleaseTurn.js';
/**
 * A possible status applied to a hero.
 */
export class Status extends Icon {
    constructor(json) {
        super(json);
    }
    /**
     * Get all effects, including those from perform skill effects.
     */
    getEffects() {
        const effects = [];
        for (const effect of this.effects) {
            if (effect.kind === EFFECT_KIND.PERFORM_SKILL) {
                effects.concat(Data.Skills.get(effect.performSkillID.getValue()).getEffects());
            }
            else {
                effects.push(effect);
            }
        }
        return effects;
    }
    /**
     * Read JSON into this status.
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.animationID = DynamicValue.readOrNone(json.animationID);
        this.restrictionKind = Utils.valueOrDefault(json.restrictionKind, STATUS_RESTRICTIONS_KIND.NONE);
        this.priority = DynamicValue.readOrDefaultNumber(json.priority);
        this.battlerPosition = DynamicValue.readOrDefaultNumber(json.battlerPosition);
        this.isReleaseAtEndBattle = Utils.valueOrDefault(json.isReleaseAtEndBattle, false);
        this.isReleaseAfterAttacked = Utils.valueOrDefault(json.isReleaseAfterAttacked, false);
        this.chanceReleaseAfterAttacked = DynamicValue.readOrDefaultNumberDouble(json.chanceReleaseAfterAttacked);
        this.isReleaseStartTurn = Utils.valueOrDefault(json.isReleaseStartTurn, false);
        this.releaseStartTurn = Utils.readJSONList(json.releaseStartTurn, StatusReleaseTurn);
        this.messageAllyAffected = DynamicValue.readOrDefaultMessage(json.messageAllyAffected);
        this.messageEnemyAffected = DynamicValue.readOrDefaultMessage(json.messageEnemyAffected);
        this.messageStatusHealed = DynamicValue.readOrDefaultMessage(json.messageStatusHealed);
        this.messageStatusStillAffected = DynamicValue.readOrDefaultMessage(json.messageStatusStillAffected);
        this.effects = Utils.readJSONList(json.effects, Effect);
        this.characteristics = Utils.readJSONList(json.characteristics, Characteristic);
    }
}
