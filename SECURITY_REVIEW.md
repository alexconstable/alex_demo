# Security Review Notes

The Isle Bosch Overlay v2 is an external Electron desktop overlay.

## Behavior

- Opens a transparent/frameless desktop overlay window.
- Uses global hotkeys for show/hide and compact/full map toggles.
- Loads Bosch Island tracker pages in an Electron webview for the current user's own tracker data.
- Opens Bosch login in a full-size normal Electron `BrowserWindow`.
- Renders local map assets, Vulnona-style overlay data, and resource markers.

## What It Does Not Do

- Does not inject into The Isle.
- Does not modify The Isle files.
- Does not read or write game memory.
- Does not install drivers or services.
- Does not bypass anti-cheat.
- Does not collect all-player positional data.
- Does not include a hidden background updater.

## Network Use

The app contacts Bosch Island tracker pages because the user explicitly connects their Bosch tracker session. The app also includes locally bundled map assets derived from public map references used during development; normal map rendering is local.

## Local Data

Electron may persist normal web/session data for Bosch login. The overlay also stores small local UI/party state in the user's app data/session storage as part of normal Electron behavior.

## Build Verification

Reviewers can rebuild from source using:

```powershell
npm ci
npm run pack
```

Detailed instructions are in `BUILD.md`.
