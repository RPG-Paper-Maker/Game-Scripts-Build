# Screen Assets

This folder contains custom background images and visual assets used by the IP2Live screen system (main menu, credits, pause menu, etc.).

## Folder Structure

```
assets/
└── screens/
    ├── main_menu/       ← Main Menu backgrounds & UI elements
    ├── credits/         ← Credits screen backgrounds
    ├── pause_menu/      ← Pause menu backgrounds (future)
    └── shared/          ← Assets shared across multiple screens
```

## Usage

These images are loaded at runtime by the plugin code in `Plugins/IP2Live_Core/code.js`.

To use a custom background in a screen, place your image file in the appropriate subfolder and reference it in the plugin code using:

```javascript
// Example: loading a custom background from the assets folder
const img = new Image();
img.src = "Scripts/src/assets/screens/main_menu/background.png";
```

> **Note:** RPM also supports loading images through its built-in picture system via `Images/HUD/TitleScreen/`. If you want the image to be managed by RPM's editor (selectable in the Title Screen settings), place it there instead. This `assets/` folder is for custom images loaded directly by plugin code.

## Supported Formats

- `.png` (recommended — supports transparency)
- `.jpg` / `.jpeg`
- `.webp`
