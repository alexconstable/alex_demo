# Build Instructions

These steps rebuild The Isle Bosch Overlay v2 from source on Windows.

## Prerequisites

- Windows 10 or newer.
- Node.js 20 LTS or newer.
- npm, included with Node.js.
- PowerShell 5 or newer.
- Optional for the self-extracting installer: 7-Zip installed at `C:\Program Files\7-Zip\7z.exe`.

No game files, game SDKs, native compiler toolchains, Steam credentials, drivers, or administrator-only game integrations are required.

## Install Dependencies

From the repository root:

```powershell
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

## Run From Source

```powershell
npm start
```

Hotkeys:

- `F8`: compact/full map.
- `F9`: show/hide overlay.

## Package The Unpacked Windows App

```powershell
npm run pack
```

This runs `electron-packager` and writes the unpacked app to:

```text
release\The Isle Bosch Overlay-win32-x64
```

Main executable:

```text
release\The Isle Bosch Overlay-win32-x64\The Isle Bosch Overlay.exe
```

The `pack` script excludes generated and review-only folders:

```text
dist\
release\
debug\
installer\
```

That exclusion prevents old packaged builds from being embedded back into `app.asar`.

## Build The Desktop Setup Folder

After `npm run pack`, create the installer payload folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\installer\Build-InstallerPackage.ps1 `
  -SourceAppRoot ".\release\The Isle Bosch Overlay-win32-x64" `
  -OutputRoot ".\dist\The Isle Bosch Overlay v2 Desktop Setup"
```

Output:

```text
dist\The Isle Bosch Overlay v2 Desktop Setup
```

This folder contains:

- the packaged Electron app under `app\`
- install, launch, and uninstall scripts
- `README.md`
- `RELEASE_NOTES_v2.md`

## Build The Nexus-Uploadable EXE

The self-extracting setup executable requires 7-Zip.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\installer\Build-SfxSetup.ps1 `
  -PackageRoot ".\dist\The Isle Bosch Overlay v2 Desktop Setup" `
  -OutputExe ".\dist\The-Isle-Bosch-Overlay-v2-Desktop-Setup.exe" `
  -InstallToDesktop
```

Final output:

```text
dist\The-Isle-Bosch-Overlay-v2-Desktop-Setup.exe
```

When run, that setup extracts v2, installs it to the user's Desktop as:

```text
Desktop\The Isle Bosch Overlay v2
```

It also removes older known v1/Reptarland overlay folders and replaces old desktop launcher shortcuts where possible.

## Clean Source Archive

These generated folders are not source and should not be committed:

- `node_modules\`
- `release\`
- `dist\`
- `debug\`
- temporary SFX build folders

The source required to rebuild the app is contained in this repository plus npm dependencies restored by `npm ci`.
