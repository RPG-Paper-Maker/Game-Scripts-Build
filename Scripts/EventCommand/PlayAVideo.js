/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Data, Graphic, Manager, Model } from "../index.js";
import { ALIGN, ALIGN_VERTICAL, Constants, Inputs, Platform, ScreenResolution, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for playing a video.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class PlayAVideo extends Base {
    constructor(command) {
        super();
        this.isWaitEnd = true;
        this.canSkip = false;
        this.isMaintained = false;
        const iterator = {
            i: 0,
        };
        this.operation = command[iterator.i++];
        if (this.operation === 0) {
            this.videoID = command[iterator.i++];
            this.isStart = Utils.numberToBool(command[iterator.i++]);
            if (this.isStart) {
                this.start = Model.DynamicValue.createValueCommand(command, iterator);
            }
            this.isWaitEnd = Utils.numberToBool(command[iterator.i++]);
            if (iterator.i < command.length) {
                this.canSkip = Utils.numberToBool(command[iterator.i++]);
                if (this.canSkip) {
                    this.skipKeyID = Model.DynamicValue.createValueCommand(command, iterator);
                    this.isMaintained = Utils.numberToBool(command[iterator.i++]);
                    if (this.isMaintained) {
                        this.maintainDuration = Model.DynamicValue.createValueCommand(command, iterator);
                    }
                }
            }
        }
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let skipText = null;
        let keyText = null;
        if (this.canSkip && this.isMaintained) {
            const keyboard = Data.Keyboards.get(this.skipKeyID.getValue(), '');
            const keyLabel = keyboard?.sc?.[0]?.[0] ?? keyboard?.name() ?? '';
            const fontSize = Utils.valueOrDefault(Data.Systems.dbOptions.v_tSize, Constants.DEFAULT_FONT_SIZE);
            skipText = new Graphic.Text(Data.Languages.extras.skip.name(), {
                align: ALIGN.CENTER,
                verticalAlign: ALIGN_VERTICAL.TOP,
                fontSize: fontSize - 10,
                strokeColor: Model.Color.BLACK,
            });
            keyText = new Graphic.Text(keyLabel, {
                align: ALIGN.CENTER,
                verticalAlign: ALIGN_VERTICAL.TOP,
                fontSize: fontSize + 1,
                strokeColor: Model.Color.BLACK,
            });
        }
        return {
            parallel: this.isWaitEnd,
            started: false,
            finished: false,
            holdElapsed: 0,
            skipText,
            keyText,
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
        if (currentState.parallel) {
            if (!currentState.started) {
                switch (this.operation) {
                    case 0:
                        Manager.Videos.play(Data.Videos.get(this.videoID).getPath() +
                            (this.isStart ? '#t=' + this.start.getValue() : ''), () => {
                            Manager.Videos.stop();
                            currentState.finished = true;
                        });
                        break;
                    case 1:
                        Manager.Videos.pause();
                        currentState.finished = true;
                        break;
                    case 2:
                        Manager.Videos.stop();
                        currentState.finished = true;
                        break;
                }
                currentState.started = true;
            }
            if (!currentState.finished && this.canSkip) {
                const keyboard = Data.Keyboards.get(this.skipKeyID.getValue(), '');
                let keyHeld = false;
                for (const pressedKey of Inputs.keysPressed) {
                    if (Data.Keyboards.isKeyEqual(pressedKey, keyboard)) {
                        keyHeld = true;
                        break;
                    }
                }
                if (this.isMaintained) {
                    const duration = this.maintainDuration.getValue() * 1000;
                    if (keyHeld) {
                        currentState.holdElapsed += Manager.Stack.elapsedTime;
                        if (currentState.holdElapsed >= duration) {
                            Manager.Videos.stop();
                            currentState.finished = true;
                        }
                        Manager.Stack.requestPaintHUD = true;
                    }
                    else if (currentState.holdElapsed > 0) {
                        currentState.holdElapsed = 0;
                        Manager.Stack.requestPaintHUD = true;
                    }
                }
                else if (keyHeld) {
                    Manager.Videos.stop();
                    currentState.finished = true;
                }
            }
            return currentState.finished ? 1 : 0;
        }
        return 1;
    }
    /**
     *  Draw the HUD.
     *  @param {Record<string, any>} currentState - The current state of the event
     */
    drawHUD(currentState) {
        if (!this.canSkip || !this.isMaintained || currentState.holdElapsed <= 0) {
            return;
        }
        const duration = this.maintainDuration.getValue() * 1000;
        const progress = Math.min(currentState.holdElapsed / duration, 1);
        const radius = ScreenResolution.getScreenXY(20);
        const cx = ScreenResolution.CANVAS_WIDTH - ScreenResolution.getScreenXY(40);
        const cy = ScreenResolution.CANVAS_HEIGHT - ScreenResolution.getScreenXY(40);
        const lineWidth = ScreenResolution.getScreenXY(4);
        const ctx = Platform.ctx;
        ctx.save();
        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.stroke();
        // Progress arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();
        ctx.restore();
        // Text drawn on top of the ring
        const skipText = currentState.skipText;
        const keyText = currentState.keyText;
        const textW = radius * 3;
        const gap = Math.round(ScreenResolution.getScreenXY(2));
        keyText.draw(cx - textW / 2, cy - keyText.fontSize, textW, 0);
        skipText.draw(cx - textW / 2, cy + gap, textW, 0);
    }
}
export { PlayAVideo };
