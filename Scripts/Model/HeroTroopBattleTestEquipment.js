/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ITEM_KIND, Utils } from '../Common/index.js';
import { Item } from '../Core/index.js';
import { Base } from './Base.js';
/**
 * A hero troop battle test equipment.
 */
export class HeroTroopBattleTestEquipment extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Equip this equipment to a player.
     */
    equip(player) {
        if (this.kind !== 0) {
            player.equip[this.id] = new Item(this.kind === 1 ? ITEM_KIND.WEAPON : ITEM_KIND.ARMOR, this.weaponArmorID, 1);
        }
    }
    /**
     * Read the JSON associated to the equipment.
     */
    read(json) {
        this.id = json.id;
        this.kind = Utils.valueOrDefault(json.kind, 0);
        this.weaponArmorID = Utils.valueOrDefault(json.weaponArmorID, 1);
    }
}
