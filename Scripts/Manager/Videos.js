/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Platform } from '../Common/index.js';
/** @class
 *  The manager for songs.
 *  @static
 */
class Videos {
    constructor() {
        throw new Error('This is a static class');
    }
    /**
     *  Play the video.
     *  @param {string} src
     *  @param {EventListener} endedHandler
     *  @param {boolean} loop
     *  @param {number} loopMs - millisecond position to seek to on loop (0 = beginning)
     */
    static async play(src, endedHandler = null, loop = false, loopMs = 0) {
        Platform.canvasVideos.classList.remove('hidden');
        if (!this.paused) {
            Platform.canvasVideos.src = src;
            Platform.canvasVideos.load();
        }
        this.removeEndedEventListener();
        this.removeCustomLoopEventListener();
        if (endedHandler !== null) {
            Platform.canvasVideos.addEventListener('ended', endedHandler, false);
        }
        this.currentEndedHandler = endedHandler;
        if (loop && loopMs > 0) {
            Platform.canvasVideos.loop = false;
            const handler = () => {
                Platform.canvasVideos.currentTime = loopMs / 1000;
                Platform.canvasVideos.play().catch(() => { });
            };
            Platform.canvasVideos.addEventListener('ended', handler, false);
            this.customLoopHandler = handler;
        }
        else {
            Platform.canvasVideos.loop = loop;
        }
        this.paused = false;
        try {
            await Platform.canvasVideos.play();
            return true;
        }
        catch (e) {
            if (e.name === 'NotAllowedError') {
                return false;
            }
            if (e.name === 'AbortError') {
                return false;
            }
            throw e;
        }
    }
    /**
     *  Pause the current video.
     */
    static pause() {
        Platform.canvasVideos.pause();
        this.paused = true;
    }
    /**
     *  Stop the current video.
     */
    static stop() {
        Platform.canvasVideos.classList.add('hidden');
        Platform.canvasVideos.pause();
        Platform.canvasVideos.src = '';
        Platform.canvasVideos.loop = false;
        this.removeEndedEventListener();
        this.removeCustomLoopEventListener();
    }
    /**
     *  Remove ended event listener.
     */
    static removeEndedEventListener() {
        if (this.currentEndedHandler !== null) {
            Platform.canvasVideos.removeEventListener('ended', this.currentEndedHandler, false);
        }
    }
    /**
     *  Remove custom loop event listener.
     */
    static removeCustomLoopEventListener() {
        if (this.customLoopHandler !== null) {
            Platform.canvasVideos.removeEventListener('ended', this.customLoopHandler, false);
            this.customLoopHandler = null;
        }
    }
}
Videos.customLoopHandler = null;
Videos.paused = false;
export { Videos };
