/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 * Provides quick access to screen resolution variables and transformation
 * functions.
 *
 * This class is static-only and is responsible for converting normalized
 * coordinates to screen pixels (and vice versa).
 */
export class ScreenResolution {
    // -------------------------------------------------------------------------
    // Conversion methods
    // -------------------------------------------------------------------------
    /**
     * Convert a normalized X coordinate to screen pixels (rounded up).
     * @param x - Normalized X position.
     */
    static getScreenX(x) {
        return Math.ceil(ScreenResolution.getDoubleScreenX(x));
    }
    /**
     * Convert a normalized Y coordinate to screen pixels (rounded up).
     * @param y - Normalized Y position.
     */
    static getScreenY(y) {
        return Math.ceil(ScreenResolution.getDoubleScreenY(y));
    }
    /**
     * Convert a screen X coordinate back to normalized value.
     * @param x - Screen X position in pixels.
     */
    static getScreenXReverse(x) {
        return Math.floor(x / ScreenResolution.WINDOW_X);
    }
    /**
     * Convert a screen Y coordinate back to normalized value.
     * @param y - Screen Y position in pixels.
     */
    static getScreenYReverse(y) {
        return Math.floor(y / ScreenResolution.WINDOW_Y);
    }
    /**
     * Convert a normalized XY value using the average of width and height
     * scaling factors.
     * @param xy - Normalized coordinate.
     */
    static getScreenXY(xy) {
        return ((ScreenResolution.WINDOW_X + ScreenResolution.WINDOW_Y) / 2) * xy;
    }
    /**
     * Convert a normalized XY value using the smaller of width and height
     * scaling factors.
     * @param xy - Normalized coordinate.
     */
    static getScreenMinXY(xy) {
        return xy * Math.min(ScreenResolution.WINDOW_X, ScreenResolution.WINDOW_Y);
    }
    /**
     * Convert a normalized X coordinate to screen pixels (without rounding).
     * @param x - Normalized X position.
     */
    static getDoubleScreenX(x) {
        return ScreenResolution.WINDOW_X * x;
    }
    /**
     * Convert a normalized Y coordinate to screen pixels (without rounding).
     * @param y - Normalized Y position.
     */
    static getDoubleScreenY(y) {
        return ScreenResolution.WINDOW_Y * y;
    }
}
// -------------------------------------------------------------------------
// Base resolution
// -------------------------------------------------------------------------
/** Default screen width in pixels. */
ScreenResolution.SCREEN_X = 640;
/** Default screen height in pixels. */
ScreenResolution.SCREEN_Y = 480;
