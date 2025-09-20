/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data, Manager, Model, Scene } from "../index.js";
import { Mathf, ScreenResolution } from '../Common/index.js';
import { Game, WindowChoices } from '../Core/index.js';
import { SpinBox } from '../Core/SpinBox.js';
import { Base } from './Base.js';
/** @class
 *  An event command for entering a number inside a variable.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class InputNumber extends Base {
    constructor(command) {
        super();
        const iterator = {
            i: 0,
        };
        this.stockVariableID = Model.DynamicValue.createValueCommand(command, iterator);
        this.digits = Model.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Set the show text property.
     *  @param {EventCommand.ShowText} showText - The show text value
     */
    setShowText(showText) {
        this.showText = showText;
    }
    /**
     *  An event action.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: string, x?: number, y?: number }} [options={}]
     */
    action(currentState, isKey, options = {}) {
        if (Scene.MenuBase.checkActionMenu(isKey, options) || Scene.MenuBase.checkCancel(isKey, options)) {
            currentState.confirmed = true;
        }
    }
    /**
     *  An event move.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: string, x?: number, y?: number }} [options={}]
     */
    move(currentState, isKey, options = {}) {
        currentState.spinBoxes[currentState.index].move(isKey, options);
        // Wait for a slower update
        const t = new Date().getTime();
        if (!isKey || (isKey && t - currentState.startTime >= WindowChoices.TIME_WAIT_PRESS)) {
            currentState.startTime = t;
            currentState.spinBoxes[currentState.index].setActive(false);
            if (isKey) {
                if (Data.Keyboards.isKeyEqual(options.key, Data.Keyboards.menuControls.Right)) {
                    currentState.index = Mathf.mod(currentState.index + 1, currentState.digits);
                    Data.Systems.soundCursor.playSound();
                    Manager.Stack.requestPaintHUD = true;
                }
                else if (Data.Keyboards.isKeyEqual(options.key, Data.Keyboards.menuControls.Left)) {
                    currentState.index = Mathf.mod(currentState.index - 1, currentState.digits);
                    Data.Systems.soundCursor.playSound();
                    Manager.Stack.requestPaintHUD = true;
                }
            }
            else {
                for (let i = 0; i < currentState.digits; i++) {
                    if (currentState.index !== i && currentState.spinBoxes[i].isInside(options.x, options.y)) {
                        currentState.index = i;
                        Data.Systems.soundCursor.playSound();
                        Manager.Stack.requestPaintHUD = true;
                    }
                }
            }
            currentState.spinBoxes[currentState.index].setActive(true);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        const spinBoxes = [];
        const digits = this.digits.getValue();
        const w = 50;
        const h = 50;
        const totalWidth = w * digits;
        const x = (ScreenResolution.SCREEN_X - totalWidth) / 2;
        const y = (ScreenResolution.SCREEN_Y - h) / 2;
        for (let i = 0; i < digits; i++) {
            spinBoxes.push(new SpinBox(x + i * w, y, {
                w: w,
                h: h,
                value: 0,
                min: 0,
                max: 9,
                active: false,
                allowLeftRight: false,
                times: false,
            }));
        }
        spinBoxes[0].setActive(true);
        Manager.Stack.requestPaintHUD = true;
        return {
            spinBoxes: spinBoxes,
            digits: digits,
            confirmed: false,
            index: 0,
            startTime: new Date().getTime(),
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
        for (const spinbox of currentState.spinBoxes) {
            spinbox.update();
        }
        if (currentState.confirmed) {
            let value = '';
            for (const spinbox of currentState.spinBoxes) {
                value += spinbox.value;
            }
            Game.current.variables.set(this.stockVariableID.getValue(true), parseInt(value));
            return 1;
        }
        return 0;
    }
    /**
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState, key) {
        this.action(currentState, true, { key: key });
    }
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Record<string, any>} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState, key) {
        this.move(currentState, true, { key: key });
        return true;
    }
    /**
     *  @inheritdoc
     */
    onMouseMove(currentState, x, y) {
        this.move(currentState, false, { x: x, y: y });
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(currentState, x, y) {
        this.action(currentState, false, { x: x, y: y });
    }
    /**
     *  Draw the HUD.
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    drawHUD(currentState) {
        if (this.showText) {
            this.showText.drawHUD();
        }
        for (let i = 0; i < currentState.digits; i++) {
            currentState.spinBoxes[i].draw();
        }
    }
}
export { InputNumber };
