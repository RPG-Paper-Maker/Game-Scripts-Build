/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { ALIGN } from '../Common/index.js';
import { Data, Graphic, Scene } from '../index.js';
/** @class
 *   A scene for the loading.
 *   @extends SceneGame
 */
class Loading extends Scene.Base {
    constructor() {
        super(false);
        this.text = new Graphic.Text(Data.Languages.extras.loading.name(), {
            align: ALIGN.RIGHT,
            x: 1180,
            y: 675,
            w: 80,
            h: 30,
        });
    }
    /** Draw the HUD scene
     */
    drawHUD() {
        this.text.draw();
    }
}
Loading.MIN_DELAY = 100;
export { Loading };
