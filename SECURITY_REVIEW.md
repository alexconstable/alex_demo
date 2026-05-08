# Security Review Notes

This document is intended for Nexus Mods or other file reviewers.

## Summary

The project is an Electron overlay. The source code is JavaScript, HTML, CSS, static image assets, and PowerShell packaging scripts. The released Windows package includes the Electron and Chromium runtime, which explains most of the binary files present in the Nexus upload.

There is no custom compiled native module in this repository.

## Likely Causes of Antivirus Detections

The release package may produce scanner results for these reasons:

- The app is an unsigned Windows Electron executable.
- Electron packages include Chromium DLLs, `electron.exe`, `.pak` files, and `resources/app.asar`.
- The optional setup formats can be self-extracting archives or installer wrappers.
- The installer and launcher use PowerShell scripts to copy files, create shortcuts, start the overlay, and optionally start Mumble.
- The app opens external websites in Electron webviews, including Bosch Island and Steam sign-in pages.

The source does not contain malware logic, persistence logic, process injection, credential theft, or hidden download-and-execute behavior.

## Network Access

The overlay uses these network locations:

- `https://bosch-island.com/`
- `https://bosch-island.com/map-tracker`
- Steam login pages opened by Bosch Island when the user signs in
- `https://reptarland-gateway-map.constvble.workers.dev`, the default optional party-room API endpoint

The party API origin can be overridden with:

```powershell
$env:ISLE_OVERLAY_PARTY_API_ORIGIN = "https://example.invalid"
```

The Electron main process restricts new-window handling to known Bosch, Steam, and Vulnona domains. Other attempted popups are opened externally through the OS browser.

## Filesystem Access

Runtime filesystem writes are limited to:

- `tmp/bosch-debug.json` in the app directory when the debug snapshot IPC method is used.
- Electron/Chromium profile data created by the persistent Bosch webview partition.
- Installer-created files under `%LOCALAPPDATA%\TheIsleBoschOverlay`.
- Desktop and Start Menu shortcuts created by the installer unless `-SkipShortcuts` is used.

The app does not scan user folders or read arbitrary local files.

## Installer Behavior

`installer/Install-ReptarlandGateway.ps1`:

- Copies the packaged app into `%LOCALAPPDATA%\TheIsleBoschOverlay\app`.
- Copies launcher and uninstaller scripts into `%LOCALAPPDATA%\TheIsleBoschOverlay`.
- Writes a local install marker JSON file.
- Creates Desktop and Start Menu shortcuts unless `-SkipShortcuts` is supplied.
- Optionally launches the app when `-LaunchAfterInstall` is supplied.

`installer/Launch-ReptarlandGateway.ps1`:

- Starts the overlay executable if it is not already running.
- Optionally starts Mumble if it can find `mumble.exe`.
- Does not install services or scheduled tasks.

`installer/Uninstall-ReptarlandGateway.ps1`:

- Requires the install marker before deleting the install folder.
- Stops the overlay process.
- Removes shortcuts and the install directory.

## Webview Behavior

`webviews/bosch-preload.js` runs only inside the Bosch Island webview. It:

- Keeps Steam/Bosch auth popups in the same webview.
- Reads visible page text and extracts status, server, Map X, Map Y, altitude, and last updated values.
- Sends those parsed values to the host renderer with `ipcRenderer.sendToHost("bosch:update", snapshot)`.
- Does not read password fields, cookies, local storage, or Steam credentials.

## Build Artifact Review

For a source review, inspect these files:

- `main.js`
- `preload.js`
- `renderer/index.html`
- `renderer/styles.css`
- `renderer/app-local.js`
- `webviews/bosch-preload.js`
- `webviews/vulnona-preload.js`
- `installer/*.ps1`
- `installer/*.cmd`
- `package.json`
- `package-lock.json`

Generated folders such as `node_modules`, `release`, `dist`, and `tmp` should not be treated as authored source.
