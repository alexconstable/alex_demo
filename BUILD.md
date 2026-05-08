# Build Instructions

These steps rebuild the Windows Electron package from the source in this repository.

## Prerequisites

- Windows 10 or newer
- Node.js 20 LTS or newer
- npm, included with Node.js
- PowerShell 5 or newer

Optional tools:

- 7-Zip, only if building the optional 7-Zip self-extracting setup executable with `installer/Build-SfxSetup.ps1`
- Windows IExpress, included with many Windows installs, only if building the optional IExpress setup executable with `installer/Build-IExpressSetup.ps1`

## Install Dependencies

```powershell
npm ci
```

`npm ci` installs the exact versions from `package-lock.json`.

## Run From Source

```powershell
npm start
```

This starts Electron from the source tree. The default hotkeys are:

- `F8` toggles compact and full map modes.
- `F9` shows or hides the overlay.

## Package the Electron App

```powershell
npm run pack
```

This runs `electron-packager` and writes the unpacked Windows application to:

```text
release/win-unpacked
```

The generated output contains Electron and Chromium runtime files such as `electron.exe`, DLLs, `.pak` files, and `resources/app.asar`. These are generated build artifacts and are not source files.

## Build the Folder Installer Package

```powershell
npm run bundle:installer
```

This copies `release/win-unpacked` plus the installer scripts into:

```text
dist/The Isle Bosch Overlay Setup
```

To also produce a zip archive:

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\Build-InstallerPackage.ps1 -ZipOutput
```

## Optional NSIS Installer

```powershell
npm run dist
```

This uses `electron-builder` and the `build` configuration in `package.json` to create an NSIS installer under `release/`.

## Optional Self-Extracting Installer

After building the folder installer package, this command uses 7-Zip's SFX module:

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\Build-SfxSetup.ps1
```

After building the zipped installer package, this command uses IExpress:

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\Build-IExpressSetup.ps1
```

These optional self-extracting formats are more likely to trigger antivirus heuristics because they embed a compressed payload plus installer script in a single unsigned executable.

## Clean Build Outputs

Generated outputs are intentionally excluded from source control:

- `node_modules/`
- `release/`
- `dist/`
- `tmp/`
- Electron `app.asar`
- Generated setup executables and temporary installer files

Delete those folders before making a clean source-only archive.
