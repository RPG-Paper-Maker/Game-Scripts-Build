/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ALIGN, Constants, Utils } from '../Common/index.js';
import { WindowBox } from '../Core/index.js';
import { Data, Graphic, Manager, Model, Scene } from '../index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ShowText extends Base {
    constructor(command) {
        super();
        const iterator = {
            i: 0,
        };
        this.interlocutor = Model.DynamicValue.createValueCommand(command, iterator);
        this.facesetID = command[iterator.i++];
        this.facesetIndexX = command[iterator.i++];
        this.facesetIndexY = command[iterator.i++];
        const lang = new Model.Localization();
        while (iterator.i < command.length) {
            lang.getCommand(command, iterator);
        }
        this.message = lang.name();
        this.windowMain = new WindowBox(0, 0, 0, 0, {
            content: new Graphic.Message(this.message, this.facesetID, this.facesetIndexX, this.facesetIndexY),
            padding: WindowBox.HUGE_PADDING_BOX,
        });
        this.windowInterlocutor = new WindowBox(this.windowMain.oX + WindowBox.MEDIUM_SLOT_HEIGHT / 2, this.windowMain.oY - WindowBox.MEDIUM_SLOT_HEIGHT / 2, WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.MEDIUM_SLOT_HEIGHT, {
            content: new Graphic.Text('', { align: ALIGN.CENTER }),
            padding: WindowBox.SMALL_SLOT_PADDING,
        });
    }
    /**
     *  An event action.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: string, x?: number, y?: number }} [options={}]
     */
    action(currentState, isKey, options = {}) {
        if (Scene.MenuBase.checkActionMenu(isKey, options) &&
            (isKey || (!isKey && this.windowMain.isInside(options.x, options.y)))) {
            const message = this.windowMain.content;
            if (message.isFullyRevealed()) {
                currentState.clicked = true;
            }
            else {
                message.visibleCharacters = -1;
                Manager.Stack.requestPaintHUD = true;
            }
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        this.windowMain.setX(Utils.valueOrDefault(Data.Systems.dbOptions.v_x, 0));
        this.windowMain.setY(Utils.valueOrDefault(Data.Systems.dbOptions.v_y, 0));
        this.windowMain.setW(Utils.valueOrDefault(Data.Systems.dbOptions.v_w, 0));
        this.windowMain.setH(Utils.valueOrDefault(Data.Systems.dbOptions.v_h, 0));
        this.windowInterlocutor.setX(this.windowMain.oX + Utils.valueOrDefault(Data.Systems.dbOptions.v_iX, WindowBox.MEDIUM_SLOT_HEIGHT / 2));
        this.windowInterlocutor.setY(this.windowMain.oY + Utils.valueOrDefault(Data.Systems.dbOptions.v_iY, -WindowBox.MEDIUM_SLOT_HEIGHT / 2));
        this.windowInterlocutor.setW(Utils.valueOrDefault(Data.Systems.dbOptions.v_iW, WindowBox.MEDIUM_SLOT_WIDTH));
        this.windowInterlocutor.setH(Utils.valueOrDefault(Data.Systems.dbOptions.v_iH, WindowBox.MEDIUM_SLOT_HEIGHT));
        this.windowMain.padding[0] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pLeft, 0);
        this.windowMain.padding[1] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pTop, 0);
        this.windowMain.padding[2] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pRight, 0);
        this.windowMain.padding[3] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pBottom, 0);
        this.windowMain.updateDimensions();
        this.windowMain.content.update();
        const nameTagText = this.windowInterlocutor.content;
        nameTagText.setFontSize(Utils.valueOrDefault(Data.Systems.dbOptions.v_tSize, Constants.DEFAULT_FONT_SIZE));
        nameTagText.setText(this.interlocutor.getValue());
        const message = this.windowMain.content;
        message.visibleCharacters = Data.Systems.dbOptions.v_tTypewriter && message.getCharactersCount() > 0 ? 0 : -1;
        return {
            clicked: false,
            frame: 0,
            frameTick: 0,
            frameDuration: 150,
            typewriterTick: 0,
            typewriterSoundTick: ShowText.TYPEWRITER_SOUND_MIN_INTERVAL,
        };
    }
    /**
     *  Reveal the message characters progressively.
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    updateTypewriter(currentState) {
        const message = this.windowMain.content;
        if (message.isFullyRevealed()) {
            message.visibleCharacters = -1;
            return;
        }
        const interval = Math.max(0, Utils.valueOrDefault(Data.Systems.dbOptions.v_tTypewriterInterval, ShowText.DEFAULT_TYPEWRITER_INTERVAL));
        currentState.typewriterTick += Manager.Stack.elapsedTime;
        currentState.typewriterSoundTick += Manager.Stack.elapsedTime;
        const previous = message.visibleCharacters;
        if (interval === 0) {
            message.visibleCharacters = -1;
        }
        else {
            const count = Math.floor(currentState.typewriterTick / interval);
            if (count > 0) {
                message.visibleCharacters += count;
                currentState.typewriterTick -= count * interval;
            }
        }
        if (message.visibleCharacters !== previous) {
            Manager.Stack.requestPaintHUD = true;
            if (currentState.typewriterSoundTick >= ShowText.TYPEWRITER_SOUND_MIN_INTERVAL) {
                currentState.typewriterSoundTick = 0;
                const soundID = Utils.valueOrDefault(Data.Systems.dbOptions.v_tTypewriterSound, -1);
                if (soundID !== -1) {
                    const volume = Utils.valueOrDefault(Data.Systems.dbOptions.v_tTypewriterVolume, ShowText.DEFAULT_TYPEWRITER_VOLUME);
                    Manager.Songs.playSound(soundID, Math.max(0, Math.min(100, volume)) / 100);
                }
            }
        }
        if (message.isFullyRevealed()) {
            message.visibleCharacters = -1;
        }
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (currentState.clicked) {
            return 1;
        }
        this.updateTypewriter(currentState);
        currentState.frameTick += Manager.Stack.elapsedTime;
        if (currentState.frameTick >= currentState.frameDuration) {
            currentState.frame = (currentState.frame + 1) % Data.Systems.FRAMES;
            currentState.frameTick = 0;
            Manager.Stack.requestPaintHUD = true;
        }
        this.windowInterlocutor.content.setText(this.interlocutor.getValue());
        return 0;
    }
    /**
     *  First key press handle for the current stack
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState, key) {
        this.action(currentState, true, { key: key });
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(currentState, x, y) {
        this.action(currentState, false, { x: x, y: y });
    }
    /**
     *  Draw the HUD
     *  @param {Record<string ,any>} - currentState The current state of the event
     */
    drawHUD(currentState) {
        this.windowMain.draw();
        if (this.windowInterlocutor.content.text) {
            this.windowInterlocutor.draw();
        }
        if (Data.Systems.dbOptions.v_fPosAbove) {
            const cd = this.windowMain.contentDimension;
            this.windowMain.content.drawFaceset(cd[0], cd[1], cd[2], cd[3]);
        }
        if (currentState && this.windowMain.content.isFullyRevealed()) {
            Data.Systems.getCurrentWindowSkin().drawArrowMessage(currentState.frame, this.windowMain.oX + this.windowMain.oW / 2, this.windowMain.oY + (this.windowMain.oH - WindowBox.MEDIUM_SLOT_HEIGHT));
        }
    }
}
ShowText.DEFAULT_TYPEWRITER_INTERVAL = 30;
ShowText.DEFAULT_TYPEWRITER_VOLUME = 100;
ShowText.TYPEWRITER_SOUND_MIN_INTERVAL = 50;
export { ShowText };
