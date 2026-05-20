/**
 * MainMenuScreen.js — Reference / Documentation Copy
 * @author James Michael Restauro Siton  @version 1.0.0
 *
 * RUNTIME: This file documents the custom cyberpunk main menu.
 * Actual runtime code → Plugins/IP2Live_Core/code.js § 3
 *
 * DESIGN SPEC
 * ───────────
 * Background : Scripts/src/assets/screens/main_menu/backgroundscreen01.png
 *              (pixel art night cityscape)
 * Font       : Fonts/Tourner.ttf (loaded via FontFace API)
 * Title      : "IP2LIVE" — large, layered neon glow (cyan + magenta + white)
 * Palette    : Neon Cyan #00FFFF · Neon Yellow #FFE600 · Magenta #FF00FF
 * Buttons    : Custom canvas-drawn, NO RPM WindowChoices
 *
 * BUTTON ANATOMY (each item)
 * ──────────────────────────
 *   ┌─────────────────────────────────────────┐  ← top border (neon line)
 *   █  01  START                            ►  │  ← left bar · index · label · arrow
 *   └────────────────────────             ─────┘  ← partial bottom border
 *
 * States:
 *   Normal   — cyan accent, subtle bg tint
 *   Hover    — cyan accent, brighter bg
 *   Selected — yellow #FFE600 accent, animated scan bar, arrow indicator
 *
 * MENU ITEMS
 * ──────────
 *   START     → new game → Scene.Map
 *   SETTINGS  → Scene.TitleSettings
 *   CREDITS   → IP2LiveCreditsScene
 *   QUIT GAME → Platform.quit()
 *
 * EFFECTS
 * ───────
 *   - Scanlines (subtle, animated)
 *   - Title glow animation (sine wave offset)
 *   - Glitch on confirm (horizontal slice + cyan flash)
 *   - Animated scan bar on selected button
 *   - Left cyan accent strip on viewport edge
 *   - Corner decoration tag at bottom-left
 *
 * HOW TO SYNC
 * ───────────
 * When modifying this design, copy the _drawHUD / _drawButton / _drawTitle
 * implementations back into Plugins/IP2Live_Core/code.js § 3.
 */

// Asset paths resolved at runtime:
//   Common.Platform.ROOT_DIRECTORY + 'Fonts/Tourner.ttf'
//   Common.Platform.ROOT_DIRECTORY + 'Scripts/src/assets/screens/main_menu/backgroundscreen01.png'

// Canvas scale factors used throughout:
//   scaleX = CANVAS_WIDTH  / SCREEN_X   (typically 1 at 1280×720 native)
//   scaleY = CANVAS_HEIGHT / SCREEN_Y
