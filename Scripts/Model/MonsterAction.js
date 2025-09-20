/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { MONSTER_ACTION_KIND, MONSTER_ACTION_TARGET_KIND, OPERATION_KIND, Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * Represents a monster action.
 */
export class MonsterAction extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Initialize this monster action from JSON data.
     */
    read(json) {
        this.actionKind = Utils.valueOrDefault(json.ak, MONSTER_ACTION_KIND.DO_NOTHING);
        switch (this.actionKind) {
            case MONSTER_ACTION_KIND.USE_SKILL:
                this.skillID = DynamicValue.readOrDefaultNumber(json.sid, 1);
                break;
            case MONSTER_ACTION_KIND.USE_ITEM:
                this.itemID = DynamicValue.readOrDefaultNumber(json.iid, 1);
                this.itemNumberMax = DynamicValue.readOrDefaultNumber(json.inm, 1);
                break;
            default:
                break;
        }
        this.priority = DynamicValue.readOrDefaultNumber(json.p, 10);
        this.targetKind = Utils.valueOrDefault(json.tk, MONSTER_ACTION_TARGET_KIND.RANDOM);
        this.isConditionTurn = Utils.valueOrDefault(json.ict, false);
        if (this.isConditionTurn) {
            this.operationKindTurn = Utils.valueOrDefault(json.okt, OPERATION_KIND.EQUAL_TO);
            this.turnValueCompare = DynamicValue.readOrDefaultNumber(json.tvc, 0);
        }
        this.isConditionStatistic = Utils.valueOrDefault(json.ics, false);
        if (this.isConditionStatistic) {
            this.statisticID = DynamicValue.readOrDefaultDatabase(json.stid);
            this.operationKindStatistic = Utils.valueOrDefault(json.oks, OPERATION_KIND.EQUAL_TO);
            this.statisticValueCompare = DynamicValue.readOrDefaultNumber(json.svc, 0);
        }
        this.isConditionVariable = Utils.valueOrDefault(json.icv, false);
        if (this.isConditionVariable) {
            this.variableID = Utils.valueOrDefault(json.vid, 1);
            this.operationKindVariable = Utils.valueOrDefault(json.okv, OPERATION_KIND.EQUAL_TO);
            this.variableValueCompare = DynamicValue.readOrDefaultNumber(json.vvc, 0);
        }
        this.isConditionStatus = Utils.valueOrDefault(json.icst, false);
        if (this.isConditionStatus) {
            this.statusID = DynamicValue.readOrDefaultNumber(json.stsid, 0);
        }
        this.isConditionScript = Utils.valueOrDefault(json.icsc, false);
        if (this.isConditionScript) {
            this.script = DynamicValue.readOrDefaultMessage(json.s, '');
        }
    }
}
