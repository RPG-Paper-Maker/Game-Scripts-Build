/**
 * ================================================================
 *  IP2Live_Core.js — Custom Plugin Entry Point (DEPRECATED LOCATION)
 * ================================================================
 *  @author   James Michael Restauro Siton
 *  @version  1.0.0
 *
 *  IMPORTANT — This file is NO LONGER the runtime entry point.
 *  ─────────────────────────────────────────────────────────────
 *  RPG Paper Maker loads plugins from:
 *      Plugins/IP2Live_Core/code.js
 *
 *  The engine resolves the plugin path from scripts.json:
 *      {"plugins": [{"id": 1, "name": "IP2Live_Core", "type": 1}]}
 *
 *  Which maps to:
 *      Plugins/IP2Live_Core/details.json   ← metadata
 *      Plugins/IP2Live_Core/code.js        ← runtime code
 *
 *  The runtime code is loaded via Interpreter.evaluate(), which
 *  wraps it in `new Function(...)`. Therefore NO import/export
 *  statements are allowed in the runtime file.
 *
 *  ─────────────────────────────────────────────────────────────
 *  REFERENCE FILES (readable, documented source):
 *      Scripts/src/screens/MainMenuScreen.js   ← Main Menu logic
 *      Scripts/src/screens/PauseMenuScreen.js  ← Pause Menu logic
 *      Scripts/src/screens/SettingsScreen.js   ← Settings Menu logic
 *      Scripts/src/screens/CreditsScreen.js    ← Credits screen
 *
 *  This file is kept for backwards compatibility and as a reference
 *  pointer. Do NOT import this file directly — it will not work.
 * ================================================================
 */

// This file intentionally left as documentation only.
// All runtime logic has moved to: Plugins/IP2Live_Core/code.js
// See Scripts/src/screens/ for readable reference copies.