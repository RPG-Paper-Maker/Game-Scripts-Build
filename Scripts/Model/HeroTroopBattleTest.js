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
import { HeroTroopBattleTestEquipment } from './HeroTroopBattleTestEquipment.js';
/**
 * A hero troop battle test.
 */
export class HeroTroopBattleTest extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Equip all the test equipments to a player.
     */
    equip(player) {
        for (const equipment of this.equipments) {
            equipment.equip(player);
        }
        player.updateAllStatsValues();
    }
    /**
     * Read the JSON associated to the hero troop battle test.
     */
    read(json) {
        this.heroID = Utils.valueOrDefault(json.heroID, 1);
        this.level = Utils.valueOrDefault(json.level, 1);
        this.equipments = Utils.readJSONList(json.equipments, HeroTroopBattleTestEquipment);
    }
}
