/**
 * PauseMenuScreen.js — Reference / Documentation Copy
 * @author James Michael Restauro Siton  @version 1.0.0
 *
 * RUNTIME: Actual code lives in Plugins/IP2Live_Core/code.js § 7 & § 8
 *
 * DESIGN SPEC
 * ───────────
 * Trigger    : ESC / Cancel key while in Scene.Map (gameplay)
 *              Intercepted via inject(Scene.Map, 'onKeyPressed', ..., overwrite=true)
 * Layout     : Centered 420×420 panel over a dimmed full-screen background
 * Background : Same backgroundscreen01.png as main menu (78% dark overlay)
 * Font       : Tourner.ttf (loaded via IP2Live.Assets)
 * Palette    : Cyan #00FFFF · Yellow #FFE600 · Danger Red #FF4466 · Warn Orange #FF8800
 *
 * BUTTON LAYOUT
 * ─────────────
 *   01  RESUME          — yellow  — Manager.Stack.pop()
 *   02  RESTART         — orange  — new Scene.Map(currentMapId) with fresh Core.Game
 *   03  EXPORT REPORT   — yellow  — IP2Live telemetry export (stub → ReportExporter)
 *   04  MAIN MENU       — yellow  — Manager.Stack.popAll() + new IP2LiveMainMenu()
 *   05  QUIT GAME       — red     — Common.Platform.quit()
 *
 * BUTTON STATES
 * ─────────────
 *   Normal   — cyan accent bar + dim bg
 *   Selected — color-coded accent (yellow/orange/red) + animated scan bar + ► arrow
 *   Hover    — same as selected (mouse over)
 *
 * SPECIAL BEHAVIOR
 * ────────────────
 *   • ESC while paused → Resume (same as pressing RESUME button)
 *   • Confirm glitch   → 6-frame pixel-slice + cyan flash before action executes
 *   • Restart keeps current map ID: `Scene.Map.current?.id || ID_MAP_START_HERO`
 *   • Main Menu routes to IP2LiveMainMenu (custom), NOT Scene.TitleScreen
 *
 * ESC HOOK (§ 8 in code.js)
 * ─────────────────────────
 *   inject(Scene.Map, 'onKeyPressed', fn, staticType=false, overwrite=true, loadBefore=false)
 *   • overwrite=true  → we replace the method entirely
 *   • this.super(key) → forwards all non-cancel keys to the original handler
 */
