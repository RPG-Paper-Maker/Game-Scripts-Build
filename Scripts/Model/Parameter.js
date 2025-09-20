/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { DYNAMIC_VALUE_KIND, Utils } from '../Common/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/**
 * A parameter of a reaction.
 */
export class Parameter extends Base {
    constructor(json) {
        super(json);
    }
    /**
     * Read a list of parameters.
     */
    static readParameters(json) {
        return Utils.readJSONMap(json.p, Parameter);
    }
    /**
     * Read parameters with default values applied.
     */
    static readParametersWithDefault(json, list) {
        const jsonParameters = json.p;
        const parameters = new Map();
        for (const jsonParameter of jsonParameters) {
            let parameter = new Parameter();
            parameter.readDefault(jsonParameter.v);
            if (parameter.value.kind === DYNAMIC_VALUE_KIND.DEFAULT) {
                parameter = list.get(jsonParameter.id);
            }
            parameters.set(jsonParameter.id, parameter);
        }
        return parameters;
    }
    /**
     * Check if the parameter is equal to another one.
     */
    isEqual(parameter) {
        return this.value === parameter.value && this.kind === parameter.kind;
    }
    /**
     * Read the JSON describing the parameter.
     */
    read(json) {
        this.value = new DynamicValue(json.d);
    }
    /**
     * Read the JSON describing the default parameter value.
     */
    readDefault(json) {
        this.value = new DynamicValue(json);
    }
}
