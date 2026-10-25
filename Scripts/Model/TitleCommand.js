/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Interpreter, Platform, SONG_KIND, TITLE_COMMAND_KIND, Utils } from '../Common/index.js';
import { Game } from '../Core/index.js';
import { Data, Manager, Scene } from '../index.js';
import { Localization } from './Localization.js';
import { Main } from '../main.js';
import { PlaySong } from './PlaySong.js';
/**
 * A title command of the game.
 */
export class TitleCommand extends Localization {
    constructor(json) {
        super(json);
    }
    /**
     * Start a new game.
     */
    static startNewGame() {
        TitleCommand.waitForGameData(() => {
            if (Data.TitlescreenGameover.isTitleBackgroundVideo) {
                Manager.Videos.stop();
            }
            Game.current = new Game();
            Game.current.initializeDefault();
            Manager.Stack.replace(new Scene.Map(Data.Systems.ID_MAP_START_HERO));
            Manager.Stack.clearHUD();
        });
        return true;
    }
    /** Show the loading scene until deferred game data has completed, then continue. */
    static waitForGameData(action) {
        const titleScreen = Manager.Stack.top;
        titleScreen.loading = true;
        Manager.Stack.requestPaintHUD = true;
        Main.waitForGameData()
            .then(action)
            .catch(console.error)
            .finally(() => {
            titleScreen.loading = false;
            Manager.Stack.requestPaintHUD = true;
        });
    }
    /**
     * Load an existing game.
     */
    static loadGame() {
        TitleCommand.waitForGameData(() => Manager.Stack.push(new Scene.LoadGame()));
        return true;
    }
    /**
     * Show settings screen.
     */
    static showSettings(titleCommand) {
        Manager.Stack.push(new Scene.TitleSettings(titleCommand));
        return true;
    }
    static showCredits(titleCommand) {
        Manager.Stack.push(new Scene.TitleCredits(titleCommand));
        return true;
    }
    /**
     * Exit the game.
     */
    static exit() {
        Platform.quit();
        return true;
    }
    /**
     * Get the action function according to the command kind.
     */
    getAction() {
        switch (this.kind) {
            case TITLE_COMMAND_KIND.NEW_GAME:
                return TitleCommand.startNewGame;
            case TITLE_COMMAND_KIND.LOAD_GAME:
                return TitleCommand.loadGame;
            case TITLE_COMMAND_KIND.SETTINGS:
                return () => TitleCommand.showSettings(this);
            case TITLE_COMMAND_KIND.EXIT:
                return TitleCommand.exit;
            case TITLE_COMMAND_KIND.SCRIPT:
                return this.executeScript;
            case TITLE_COMMAND_KIND.CREDITS:
                return () => TitleCommand.showCredits(this);
        }
    }
    /**
     * Execute custom script.
     */
    executeScript() {
        Interpreter.evaluate(this.script, { addReturn: false });
        return true;
    }
    /**
     * Read JSON into this title command.
     */
    read(json) {
        super.read(json);
        this.kind = Utils.valueOrDefault(json.k, TITLE_COMMAND_KIND.NEW_GAME);
        this.script = Utils.valueOrDefault(json.s, '');
        this.creditsTexts = Utils.valueOrDefault(json.ct, {});
        this.creditsSpeed = Utils.valueOrDefault(json.cs, 40);
        this.creditsBackgroundColorID = Utils.valueOrDefault(json.cbc, 1);
        this.creditsBackgroundImageID = Utils.valueOrDefault(json.cbi, -1);
        this.creditsBackgroundVideoID = Utils.valueOrDefault(json.cbv, -1);
        this.creditsMusic = new PlaySong(SONG_KIND.MUSIC, json.cm);
        this.creditsCanSkip = Utils.valueOrDefault(json.ccs, true);
        this.creditsSkipKeyID = Utils.valueOrDefault(json.csk, 11);
        this.creditsMaintainKey = Utils.valueOrDefault(json.cmk, true);
        this.creditsMaintainDuration = json.cmd > 0 ? json.cmd : 3;
    }
}
