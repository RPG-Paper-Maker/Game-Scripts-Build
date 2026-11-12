/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Inputs, PICTURE_KIND, Platform, ScreenResolution, SONG_KIND } from '../Common/index.js';
import { Picture2D } from '../Core/index.js';
import { Data, Graphic, Manager, Model, Scene } from '../index.js';
import { Base } from './Base.js';
/** A scrolling, localized credits screen opened from the title screen or a command. */
class TitleCredits extends Base {
    constructor(credits) {
        super(true, credits);
        this.background = null;
        this.offset = 0;
        this.lastFrame = 0;
        this.heldMilliseconds = 0;
        this.skipGraphic = null;
    }
    initialize(credits) {
        this.credits = credits;
        this.fromTitle = Manager.Stack.top instanceof Scene.TitleScreen;
        this.previousMusic = Model.PlaySong.currentPlayingMusic;
        this.skipKeyMustBeReleased = this.isSkipKeyHeld();
    }
    async load() {
        const credits = this.credits;
        Manager.Videos.stop();
        Manager.Songs.stopSong(SONG_KIND.MUSIC, 0, 0);
        Manager.Songs.isProgressionMusicEnd = true;
        if (credits.backgroundVideoID >= 0 && Data.Videos.has(credits.backgroundVideoID)) {
            const video = Data.Videos.get(credits.backgroundVideoID);
            try {
                await Manager.Videos.play(video.getPath(), null, true);
            }
            catch (error) {
                console.error(error);
            }
        }
        if (credits.backgroundImageID >= 0) {
            this.background = await Picture2D.createWithID(credits.backgroundImageID, PICTURE_KIND.TITLE_SCREEN, {
                cover: true,
            }).catch(() => null);
        }
        await Promise.resolve();
        if (Manager.Stack.top !== this)
            return;
        this.translate();
        this.offset = ScreenResolution.CANVAS_HEIGHT;
        this.lastFrame = performance.now();
        credits.music.playMusic();
        this.loading = false;
    }
    translate() {
        const language = String(Data.Settings.currentLanguage);
        const mainLanguage = String(Data.Languages.getMainLanguageID());
        const text = this.credits.texts[language] ?? this.credits.texts[mainLanguage] ?? '';
        this.message = new Graphic.Message(text, -1, 0, 0);
        this.message.update();
        this.skipGraphic =
            this.credits.canSkip && this.credits.maintainKey ? new Graphic.SkipHold(this.credits.skipKeyID) : null;
    }
    update() {
        const now = performance.now();
        const elapsed = Math.max(0, now - this.lastFrame);
        this.offset -=
            (ScreenResolution.getScreenMinXY(Math.max(0, this.credits.speed)) * Math.min(elapsed, 100)) / 1000;
        this.lastFrame = now;
        if (this.credits.canSkip && this.credits.maintainKey) {
            const keyHeld = this.isSkipKeyHeld();
            if (!keyHeld)
                this.skipKeyMustBeReleased = false;
            this.heldMilliseconds =
                keyHeld && !this.skipKeyMustBeReleased ? this.heldMilliseconds + Manager.Stack.elapsedTime : 0;
            if (this.heldMilliseconds >= this.credits.maintainDuration * 1000) {
                this.closeCredits();
                return;
            }
        }
        const contentHeight = this.message.heights.reduce((total, height) => total + height * 2, 0) + 60;
        if (this.offset < -contentHeight) {
            this.closeCredits();
            return;
        }
        Manager.Stack.requestPaintHUD = true;
    }
    isSkipKeyHeld() {
        if (!this.credits.canSkip || !this.credits.maintainKey)
            return false;
        const keyboard = Data.Keyboards.get(this.credits.skipKeyID, '');
        for (const pressedKey of Inputs.keysPressed) {
            if (keyboard && Data.Keyboards.isKeyEqual(pressedKey, keyboard))
                return true;
        }
        return false;
    }
    closeCredits() {
        Manager.Videos.stop();
        Manager.Songs.stopSong(SONG_KIND.MUSIC, 0, 0);
        Manager.Songs.isProgressionMusicEnd = true;
        Manager.Stack.pop();
        if (this.fromTitle) {
            Manager.Stack.replace(new Scene.TitleScreen(true));
        }
        else if (this.previousMusic && this.previousMusic.songID.getValue() >= 0) {
            this.previousMusic.playMusic();
        }
    }
    onKeyPressed(key) {
        if (!this.credits.canSkip || this.credits.maintainKey)
            return;
        const keyboard = Data.Keyboards.get(this.credits.skipKeyID, '');
        if (keyboard && Data.Keyboards.isKeyEqual(key, keyboard)) {
            this.closeCredits();
        }
    }
    draw3D() {
        const color = Data.Systems.getColor(this.credits.backgroundColorID) ?? Model.Color.BLACK;
        Manager.GL.renderer.setClearColor(color.getHex(), 1);
        Manager.GL.renderer.clear();
    }
    drawHUD() {
        if (this.background) {
            this.background.draw();
        }
        if (!this.message)
            return;
        const ctx = Platform.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        ctx.clip();
        this.message.draw(0, this.offset, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        ctx.restore();
        this.skipGraphic?.draw(this.heldMilliseconds, this.credits.maintainDuration * 1000);
    }
}
export { TitleCredits };
