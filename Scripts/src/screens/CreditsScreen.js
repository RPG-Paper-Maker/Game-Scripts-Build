/**
 * ================================================================
 *  CreditsScreen.js — Reference / Documentation Copy
 * ================================================================
 *  @author   James Michael Restauro Siton
 *  @version  1.0.0
 *
 *  PURPOSE
 *  -------
 *  This file is the authoritative source for the IP2Live credits screen.
 *
 *  RUNTIME NOTE
 *  ------------
 *  The actual runtime code lives in: Plugins/IP2Live_Core/code.js § 2
 *  See MainMenuScreen.js header for full explanation of why.
 *
 *  When modifying this screen, edit here first, then sync to code.js.
 * ================================================================
 */

/**
 * IP2LiveCreditsScene
 *
 * A simple, dismissible credits screen that:
 *   • Reuses the title screen background image (if available)
 *   • Displays credits text centered inside a framed window box
 *   • Can be dismissed by pressing any key or clicking the mouse
 *   • Pops itself off Manager.Stack when dismissed
 *
 * Extends Scene.Base from the RPM engine.
 *
 * @class
 * @extends Scene.Base
 */
class IP2LiveCreditsScene extends Scene.Base {
    constructor() {
        super(true); // loading = true → triggers async load()
    }

    initialize() {
        // No extra initialization needed
    }

    /**
     * Async load — sets up background and credit text graphics.
     */
    async load() {
        // --- Background ---
        if (Data.TitlescreenGameover.isTitleBackgroundImage) {
            try {
                this.pictureBackground = await Core.Picture2D.createWithID(
                    Data.TitlescreenGameover.titleBackgroundImageID,
                    Common.PICTURE_KIND.TITLE_SCREEN,
                    { cover: true }
                );
            } catch (_e) {
                this.pictureBackground = null;
            }
        } else {
            this.pictureBackground = null;
        }

        // --- Credits content ---
        // Edit these lines to update the credits display.
        const lines = [
            { text: "IP2LIVE",                      size: 28, bold: true  },
            { text: "",                              size: 14, bold: false },
            { text: "Lead Developer",                size: 16, bold: true  },
            { text: "James Michael Restauro Siton",  size: 14, bold: false },
            { text: "",                              size: 14, bold: false },
            { text: "Game Engine",                   size: 16, bold: true  },
            { text: "RPG Paper Maker",               size: 14, bold: false },
            { text: "",                              size: 14, bold: false },
            { text: "Special Thanks",                size: 16, bold: true  },
            { text: "Wano & RPM Community",          size: 14, bold: false },
            { text: "",                              size: 14, bold: false },
            { text: "",                              size: 14, bold: false },
            { text: "Press any key to return",       size: 12, bold: false },
        ];

        this.creditTexts = [];
        const startY = 100;
        const lineHeight = 36;
        const screenW = Common.ScreenResolution.SCREEN_X;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.text === "") {
                this.creditTexts.push(null); // spacer
                continue;
            }
            const graphic = new Graphic.Text(line.text, {
                x: 0, y: 0, w: screenW, h: lineHeight,
                align: Common.ALIGN.CENTER,
                fontSize: line.size,
                bold: line.bold,
            });
            graphic._ip2Y = startY + i * lineHeight;
            this.creditTexts.push(graphic);
        }

        // --- Window frame around credits ---
        const totalHeight = lines.length * lineHeight + 60;
        const boxW = 500;
        const boxX = (screenW - boxW) / 2;
        const boxY = startY - 30;

        this.creditsWindow = new Core.WindowBox(
            boxX, boxY, boxW, totalHeight,
            { padding: Core.WindowBox.MEDIUM_PADDING_BOX }
        );

        this.loading = false;
    }

    /**
     * Dismiss credits on any key press.
     */
    onKeyPressed(key) {
        Data.Systems.soundCancel.playSound();
        Manager.Stack.pop();
    }

    /**
     * Dismiss credits on mouse click.
     */
    onMouseUp(x, y) {
        Data.Systems.soundCancel.playSound();
        Manager.Stack.pop();
    }

    onKeyPressedAndRepeat(key) {
        return true;
    }

    draw3D() {
        Manager.GL.renderer.clear();
    }

    /**
     * Render the credits screen.
     */
    drawHUD() {
        if (this.pictureBackground) {
            this.pictureBackground.draw();
        }
        if (this.creditsWindow) {
            this.creditsWindow.draw();
        }
        if (this.creditTexts) {
            const screenW = Common.ScreenResolution.SCREEN_X;
            for (const g of this.creditTexts) {
                if (g !== null) {
                    g.draw(0, g._ip2Y, screenW, 36);
                }
            }
        }
    }
}
