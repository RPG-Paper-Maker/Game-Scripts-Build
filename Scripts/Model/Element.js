import { Utils } from '../Common/index.js';
import { DynamicValue } from './DynamicValue.js';
import { Icon } from './Icon.js';
/**
 * An element of the game (e.g. fire, water, etc.).
 */
export class Element extends Icon {
    constructor(json) {
        super(json);
    }
    /**
     * Read the JSON associated to the element.
     */
    read(json) {
        super.read(json);
        this.efficiency = Utils.readJSONMapKeyValue(json.e, DynamicValue);
    }
}
