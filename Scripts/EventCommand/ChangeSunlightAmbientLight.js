/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as THREE from 'three';
import { Utils } from '../Common/index.js';
import { Manager, Model, Scene } from '../index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for changing the sunlight and ambient light.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeSunlightAmbientLight extends Base {
    constructor(command) {
        super();
        this.sun = null;
        this.ambient = null;
        if (!command) {
            return;
        }
        const iterator = {
            i: 0,
        };
        this.sun = ChangeSunlightAmbientLight.readLight(command, iterator);
        this.ambient = ChangeSunlightAmbientLight.readLight(command, iterator);
        this.keepOtherMaps = Utils.numberToBool(command[iterator.i++]);
        iterator.i++; // Sync both (editor only)
        this.waitEnd = Utils.numberToBool(command[iterator.i++]);
        this.time = Model.DynamicValue.createValueCommand(command, iterator);
        this.parallel = !this.waitEnd;
    }
    /**
     *  Read an optional light change from the command.
     *  @static
     */
    static readLight(command, iterator) {
        if (!Utils.numberToBool(command[iterator.i++])) {
            return null;
        }
        return {
            isDefault: command[iterator.i++] === 0,
            color: Model.DynamicValue.createValueCommand(command, iterator),
            intensity: Model.DynamicValue.createValueCommand(command, iterator),
        };
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        const map = Scene.Map.current;
        const transitionID = ++Manager.GL.lightingTransitionID;
        const time = this.time.getValue() * 1000;
        const transitions = [];
        if (map) {
            const add = (change, isSun) => {
                if (change) {
                    transitions.push({
                        isSun: isSun,
                        isDefault: change.isDefault,
                        start: map.getCurrentLight(isSun),
                        target: change.isDefault
                            ? map.getMapLight(isSun)
                            : {
                                color: new THREE.Color(change.color.getValue()),
                                intensity: Math.max(0, change.intensity.getValue()),
                            },
                    });
                }
            };
            add(this.sun, true);
            add(this.ambient, false);
            Manager.GL.lightingKeep = this.keepOtherMaps;
            Manager.GL.lightingMapID = map.id;
        }
        return {
            parallel: this.waitEnd,
            transitions: transitions,
            time: time,
            timeLeft: time,
            transitionID: transitionID,
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (currentState.transitionID !== Manager.GL.lightingTransitionID) {
            return 1;
        }
        if (currentState.parallel) {
            if (currentState.time === 0) {
                currentState.timeLeft = 0;
            }
            else {
                currentState.timeLeft = Math.max(0, currentState.timeLeft - Manager.Stack.elapsedTime);
            }
            const progress = currentState.time === 0 ? 1 : 1 - currentState.timeLeft / currentState.time;
            for (const transition of currentState.transitions) {
                const value = progress === 1 && transition.isDefault
                    ? null
                    : {
                        color: new THREE.Color().lerpColors(transition.start.color, transition.target.color, progress),
                        intensity: transition.start.intensity +
                            (transition.target.intensity - transition.start.intensity) * progress,
                    };
                if (transition.isSun) {
                    Manager.GL.lightingSun = value;
                }
                else {
                    Manager.GL.lightingAmbient = value;
                }
            }
            return currentState.timeLeft === 0 ? 1 : 0;
        }
        return 1;
    }
}
export { ChangeSunlightAmbientLight };
