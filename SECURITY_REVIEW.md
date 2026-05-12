# Security Review Notes

This document is intended for Nexus Mods or other file reviewers.

The Isle Prime Tracker is a local Electron overlay for manually tracking Prime Elder checklist progress in The Isle: Evrima. The source code is JavaScript, HTML, CSS, static assets, and PowerShell helper scripts. The packaged Windows download includes the Electron and Chromium runtime, which explains most of the binary size and many of the files present in the installer payload.

## Why Virus Scanners May Flag It

The Nexus upload is an unsigned Windows setup executable that contains an Electron application. Unsigned Electron and NSIS installer packages can trigger heuristic detections because they bundle:

- a large Chromium runtime
- DLLs, `.pak` files, and `app.asar`
- an installer/uninstaller stub
- an executable that creates shortcuts and writes into the user's profile

Those behaviors are common for desktop apps, but they can look suspicious to automated scanners when the publisher is not code-signed and the file has little reputation history.

## What the App Does

- Opens a frameless always-on-top overlay window.
- Lets the user manually check Prime-related objectives.
- Saves user-created runs locally in `%APPDATA%\the-isle-prime-tracker\prime-tracker-runs.json`.
- Uses global hotkeys `F6` and `F7` for overlay controls.
- Creates normal Windows shortcuts when installed through the NSIS setup.

## What the App Does Not Do

- It does not inject into The Isle.
- It does not modify game files.
- It does not read game memory.
- It does not install a driver, kernel component, Windows service, scheduled task, or browser extension.
- It does not collect Steam credentials.
- It does not contact a remote server.
- It does not auto-update or download executable payloads after install.

## Network Access

The Prime Tracker app itself has no intentional network calls. Network access during development/build may occur only when npm or Electron Builder downloads declared dependencies and Electron/NSIS build tools.

## Filesystem Access

At runtime the app writes only its saved run library through Electron's `app.getPath("userData")`, normally:

```text
%APPDATA%\the-isle-prime-tracker\prime-tracker-runs.json
```

The setup executable installs into the user's selected folder, defaulting to:

```text
Desktop\The Isle Prime Tracker
```

## Build Reproducibility

Build instructions are in `BUILD.md`. Dependencies are pinned through `package-lock.json`.
