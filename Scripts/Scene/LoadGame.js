/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ALIGN, PICTURE_KIND } from '../Common/index.js';
import { Game, Picture2D } from '../Core/index.js';
import { Data, Graphic, Manager, Scene } from '../index.js';
import { SaveLoadGame } from './SaveLoadGame.js';
/** @class
 *  A scene in the menu for loading a game.
 *  @extends Scene.SaveLoadGame
 */
class LoadGame extends SaveLoadGame {
    constructor() {
        super();
    }
    /**
     *  Load async stuff.
     */
    async load() {
        await super.load();
        this.setContents(new Graphic.Text(Data.Languages.extras.loadAGame.name(), { align: ALIGN.CENTER }), new Graphic.Text(Data.Languages.extras.loadAGameDescription.name(), { align: ALIGN.CENTER }));
        if (Data.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Data.TitlescreenGameover.titleBackgroundImageID, PICTURE_KIND.TITLE_SCREEN, { cover: true });
        }
        this.loading = false;
    }
    async loadGame() {
        this.loading = true;
        await Game.current.loadPositions();
        // Initialize properties for hero
        Game.current.hero.initializeProperties();
        // Stop video if existing
        if (!Data.TitlescreenGameover.isTitleBackgroundImage) {
            Manager.Videos.stop();
        }
        // Pop load and title screen from the stack
        Manager.Stack.pop();
        Manager.Stack.replace(new Scene.Map(Game.current.currentMapID));
        this.loading = false;
    }
    /**
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: string, x?: number, y?: number }} [options={}]
     */
    action(isKey, options = {}) {
        if (Scene.MenuBase.checkActionMenu(isKey, options)) {
            Game.current = this.windowChoicesSlots.getCurrentContent().game;
            if (Game.current.isEmpty) {
                Game.current = null;
                Data.Systems.soundImpossible.playSound();
            }
            else {
                Data.Systems.soundConfirmation.playSound();
                this.loadGame();
            }
        }
    }
    /**
     *  Handle scene key pressed
     *  @param {number} key - The key ID
     */
    onKeyPressed(key) {
        super.onKeyPressed(key);
        this.action(true, { key: key });
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(x, y) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
    }
    /**
     *  Draw the HUD scene
     */
    drawHUD() {
        if (Data.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        super.drawHUD();
    }
}
export { LoadGame };
