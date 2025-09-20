/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ITEM_KIND } from '../Common/index.js';
import { Data } from '../index.js';
import { Armor } from './Armor.js';
/**
 * Represents a weapon in the game.
 * Weapons are a specialization of {@link Armor}, but always return
 * {@link ITEM_KIND.WEAPON} as their item kind.
 */
export class Weapon extends Armor {
    /**
     * Retrieves the weapon type (kind) from the battle system database.
     * @returns {Model.WeaponArmorKind} The weapon kind associated with this weapon.
     */
    getType() {
        return Data.BattleSystems.getWeaponKind(this.type);
    }
    /**
     * Retrieves the item kind for this object.
     * Always returns {@link ITEM_KIND.WEAPON}.
     * @returns {ITEM_KIND} The constant value {@link ITEM_KIND.WEAPON}.
     */
    getKind() {
        return ITEM_KIND.WEAPON;
    }
}
