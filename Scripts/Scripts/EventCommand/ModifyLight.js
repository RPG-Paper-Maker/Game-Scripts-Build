/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano
*/
import { MapObject } from '../Core/index.js';
import { Model } from '../index.js';
import { Base } from './Base.js';
var MODIFY_LIGHT_ACTION;
(function (MODIFY_LIGHT_ACTION) {
    MODIFY_LIGHT_ACTION[MODIFY_LIGHT_ACTION["ADD"] = 0] = "ADD";
    MODIFY_LIGHT_ACTION[MODIFY_LIGHT_ACTION["DELETE"] = 1] = "DELETE";
    MODIFY_LIGHT_ACTION[MODIFY_LIGHT_ACTION["EDIT"] = 2] = "EDIT";
})(MODIFY_LIGHT_ACTION || (MODIFY_LIGHT_ACTION = {}));
const LIGHT_PROPERTIES = [
    'kind',
    'color',
    'groundColor',
    'intensity',
    'intensityOffset',
    'intensityTime',
    'x',
    'y',
    'z',
    'distance',
    'angle',
    'penumbra',
    'targetX',
    'targetY',
    'targetZ',
];
class ModifyLight extends Base {
    constructor(command) {
        super();
        const iterator = { i: 0 };
        this.objectID = Model.DynamicValue.createValueCommand(command, iterator);
        this.action = command[iterator.i++];
        this.lightID = Model.DynamicValue.createValueCommand(command, iterator);
        this.light = null;
        this.selectedFields = [];
        if (this.action !== MODIFY_LIGHT_ACTION.DELETE) {
            this.light = new Model.StateLight({});
            const hasSelectedFields = this.action === MODIFY_LIGHT_ACTION.EDIT && command.length - iterator.i > LIGHT_PROPERTIES.length * 2;
            for (const property of LIGHT_PROPERTIES) {
                this.selectedFields.push(hasSelectedFields ? command[iterator.i++] === 1 : true);
                this.light[property] = Model.DynamicValue.createValueCommand(command, iterator);
            }
        }
    }
    initialize() {
        return { started: false, finished: false };
    }
    update(currentState, object) {
        if (!currentState.started) {
            currentState.started = true;
            MapObject.search(this.objectID.getValue(), (result) => {
                const target = result?.object;
                if (target?.currentStateInstance) {
                    const lightID = this.lightID.getValue();
                    const lights = target.currentStateInstance.lights;
                    const index = lights.findIndex((light) => Number(light.id) === lightID);
                    switch (this.action) {
                        case MODIFY_LIGHT_ACTION.ADD:
                            if (index === -1 && this.light) {
                                const light = this.light.createCopy();
                                light.id = lightID;
                                lights.push(light);
                                target.refreshObjectLights();
                            }
                            break;
                        case MODIFY_LIGHT_ACTION.DELETE:
                            if (index !== -1) {
                                lights.splice(index, 1);
                                target.refreshObjectLights();
                            }
                            break;
                        case MODIFY_LIGHT_ACTION.EDIT:
                            if (index !== -1 && this.light) {
                                let hasUpdated = false;
                                for (let i = 0; i < LIGHT_PROPERTIES.length; i++) {
                                    if (this.selectedFields[i]) {
                                        const property = LIGHT_PROPERTIES[i];
                                        lights[index][property] = this.light[property].createCopy();
                                        hasUpdated = true;
                                    }
                                }
                                if (hasUpdated) {
                                    target.refreshObjectLights();
                                }
                            }
                            break;
                    }
                }
                currentState.finished = true;
            }, object);
        }
        return currentState.finished ? 1 : 0;
    }
}
export { ModifyLight };
