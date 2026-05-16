# The Isle Bosch Overlay v2

Source code for the Windows desktop overlay used with the Bosch Island tracker for The Isle Gateway.

This is an external Electron overlay. It does not inject into the game, patch game files, install drivers, read game memory, or modify The Isle. It displays map and tracker information in a normal desktop window over the game.

## What V2 Adds

- Vulnona-style Gateway map presentation.
- Bosch tracker calibration against Vulnona reference points.
- Migration, patrol, and sanctuary overlays.
- Gastro, salt, and mud resource toggles.
- Vulnona drinking-water overlay for lakes, ponds, rivers, and puddles.
- Compact and full map modes.
- Rotating compass around the compact map.
- Improved player, friend, and location marker visibility.
- Full-size Bosch login window instead of the old tiny embedded login strip.
- Installer scripts that install v2 to Desktop and replace older known launchers.

Vulnona deserves a clear shoutout here: v2 uses Vulnona-style Gateway map data and visual reference layers to make the overlay more accurate and readable for players.

## Hotkeys

- `F8`: toggle compact/full map mode.
- `F9`: show/hide the overlay.

## Using The Map Overlays

Open the full map with `F8`. The overlay buttons are hidden in compact mode so the small overlay stays clean.

- `Migration`: shows purple migration-zone overlays.
- `Patrol`: shows red patrol-zone overlays.
- `Sanctuary`: shows pink sanctuary overlays.
- `Gastro`: shows flat Gastro food-resource icons from Vulnona map data.
- `Salt`: shows salt-rock icons from Vulnona map data.
- `Mud`: shows Vulnona's brown mud areas with yellow outlines.

Migration, Patrol, and Sanctuary are enabled by default. Gastro, Salt, and Mud are optional toggles for resource routing.

## Repository Contents

- `main.js`: Electron main process, overlay window handling, hotkeys, Bosch login window.
- `preload.js`: safe bridge between renderer and Electron APIs.
- `webviews/`: Bosch tracker webview preload logic.
- `renderer/`: map UI, calibration, overlays, labels, party markers, route rendering.
- `assets/`: map, water, mud, migration, and app icon assets.
- `installer/`: PowerShell and SFX packaging scripts.
- `RELEASE_NOTES_v2.md`: player-facing v2 update notes.
- `BUILD.md`: detailed build and packaging instructions.
- `SECURITY_REVIEW.md`: review notes for Nexus/mod-hosting verification.

Generated folders such as `node_modules/`, `release/`, and `dist/` are intentionally excluded from source.

## Quick Build

```powershell
npm ci
npm run pack
```

The unpacked Windows app is created at:

```text
release\The Isle Bosch Overlay-win32-x64\The Isle Bosch Overlay.exe
```

Full build and installer steps are in `BUILD.md`.
