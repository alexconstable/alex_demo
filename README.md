# The Isle Bosch Overlay

The Isle Bosch Overlay is a small Windows Electron overlay for The Isle: Evrima players. It displays a local Gateway map, reads the user's live coordinate values from the Bosch Island map tracker after the user signs in there, and optionally shares the user's position with a short-lived party room service.

This repository contains the full source used to build the Nexus Mods release. The packaged download is an Electron/Chromium Windows application, so the released archive contains an executable, `app.asar`, Chromium DLLs, `.pak` locale files, and installer/launcher PowerShell scripts. Those bundled runtime files can produce antivirus heuristic detections when the app is unsigned, but the application code in this repository is JavaScript, HTML, CSS, image assets, and PowerShell packaging scripts.

## What the Overlay Does

- Opens a frameless, always-on-top overlay window for the Gateway map.
- Uses `F8` to switch between compact and expanded map modes.
- Uses `F9` to show or hide the overlay.
- Loads Bosch Island in an Electron `<webview>` so the user can sign in with Steam directly on Bosch Island.
- Reads visible tracker text from the Bosch page in `webviews/bosch-preload.js` and sends only parsed tracker state back to the local overlay renderer.
- Renders local map labels, migration zones, sanctuary markers, route pins, and optional party markers from static data in `renderer/app-local.js`.
- Optionally talks to a Cloudflare Worker party API configured by `ISLE_OVERLAY_PARTY_API_ORIGIN` or the default endpoint in `main.js`.
- Installer scripts copy the packaged app into `%LOCALAPPDATA%\TheIsleBoschOverlay`, create shortcuts, and provide an uninstaller.

## What the Overlay Does Not Do

- It does not include custom native code.
- It does not install a driver, kernel component, browser extension, service, or scheduled task.
- It does not modify The Isle game files.
- It does not inject into the game process.
- It does not read arbitrary files from the user's system.
- It does not collect Steam credentials. Steam authentication happens inside the Bosch Island web page loaded in the webview.
- It does not auto-update or download executable payloads after install.

## Source Layout

- `main.js` - Electron main process, window setup, hotkeys, IPC handlers, URL allow-list, and party API proxy.
- `preload.js` - Safe renderer bridge exposed as `window.isleOverlay`.
- `renderer/index.html` - Overlay UI structure.
- `renderer/styles.css` - Overlay styling.
- `renderer/app-local.js` - Local map rendering, routing, Bosch tracker synchronization, custom coordinate plotting, and party tracking UI.
- `webviews/bosch-preload.js` - Bosch Island webview helper that reads visible tracker fields and keeps the tracker active.
- `webviews/vulnona-preload.js` - Reserved empty preload file for earlier Vulnona integration compatibility.
- `assets/` - Static map images and app icon.
- `installer/` - PowerShell and command scripts used to package, install, launch, and uninstall the overlay.
- `package.json` and `package-lock.json` - Node dependency manifest and locked dependency versions.

## Build Instructions

See [BUILD.md](BUILD.md) for exact steps to install dependencies, run the overlay from source, package the Windows app, and build the installer package.

## Security Review Notes

See [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for a detailed explanation of network access, filesystem access, installer behavior, and likely antivirus false-positive causes.

## License

No separate license has been selected yet. Please contact the maintainer before redistributing modified builds.
