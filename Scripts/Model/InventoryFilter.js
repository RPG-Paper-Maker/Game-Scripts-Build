/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Interpreter, INVENTORY_FILTER_KIND, Utils } from '../Common/index.js';
import { DynamicValue } from './DynamicValue.js';
import { Localization } from './Localization.js';
/**
 * An inventory filter used to filter inventory or shop items.
 */
export class InventoryFilter extends Localization {
    constructor(json) {
        super(json);
    }
    /**
     * Get a filtering function for items.
     */
    getFilter() {
        switch (this.kind) {
            case INVENTORY_FILTER_KIND.ALL:
                return () => true;
            case INVENTORY_FILTER_KIND.CONSUMABLES:
                return (item) => item.system.consumable;
            case INVENTORY_FILTER_KIND.CUSTOM: {
                const typeID = this.itemTypeID?.getValue();
                return (item) => !item.system.isWeaponArmor() && item.system.type === typeID;
            }
            case INVENTORY_FILTER_KIND.WEAPONS:
                return (item) => item.system.isWeapon();
            case INVENTORY_FILTER_KIND.ARMORS:
                return (item) => item.system.isArmor();
            case INVENTORY_FILTER_KIND.WEAPONS_AND_ARMORS:
                return (item) => item.system.isWeaponArmor();
            case INVENTORY_FILTER_KIND.SCRIPT: {
                return (item) => Interpreter.evaluate(this.script, {
                    additionalName: 'item',
                    additionalValue: item,
                }) ?? false;
            }
            default:
                return () => false;
        }
    }
    /**
     * Read the JSON associated to the inventory filter.
     */
    read(json) {
        super.read(json);
        this.kind = Utils.valueOrDefault(json.kind, INVENTORY_FILTER_KIND.ALL);
        switch (this.kind) {
            case INVENTORY_FILTER_KIND.CUSTOM:
                this.itemTypeID = DynamicValue.readOrDefaultDatabase(json.itemTypeID);
                break;
            case INVENTORY_FILTER_KIND.SCRIPT:
                this.script = Utils.valueOrDefault(json.script, '');
                break;
        }
    }
}
