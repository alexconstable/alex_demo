# Build Instructions

These steps rebuild The Isle Prime Tracker Windows app and setup executable from source.

## Prerequisites

- Windows 10 or newer
- Node.js 20 LTS or newer
- npm, included with Node.js
- PowerShell 5 or newer

No game files, game SDKs, native compiler toolchains, drivers, or Steam credentials are required.

## Install Dependencies

```powershell
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

## Restore the App Icon

The repository includes the Windows icon as a base64 text file so the source can be reviewed through normal text diffs. Restore it before packaging:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Restore-PrimeTrackerIcon.ps1
```

This recreates:

```text
assets\prime-tracker.ico
```

## Run From Source

```powershell
npm start
```

Hotkeys:

- `F6`: compact / expanded Prime Tracker
- `F7`: hide / show Prime Tracker

## Package the Unpacked Windows App

```powershell
npm run pack
```

This writes the unpacked Electron app to:

```text
release\The Isle Prime Tracker-win32-x64
```

## Build the Nexus Setup EXE

```powershell
npm run dist
```

This builds an NSIS setup executable under:

```text
release\TheIslePrimeTracker-DesktopSetup-0.1.0.exe
```

The NSIS setup defaults the install folder to:

```text
Desktop\The Isle Prime Tracker
```

It also creates a Desktop shortcut. The app stores user-created run data in Electron's normal per-user application data folder:

```text
%APPDATA%\the-isle-prime-tracker\prime-tracker-runs.json
```

## Clean Source Archive

Generated folders are intentionally not source:

- `node_modules\`
- `release\`
- `dist\`
- `tmp\`
- generated `assets\prime-tracker.ico`

The generated Electron/Chromium runtime files in `release\` are build artifacts, not handwritten source.
