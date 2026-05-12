# The Isle Prime Tracker

External Windows overlay for tracking Prime Elder eligibility in The Isle runs.

This app is intentionally a companion overlay, not a game-memory mod. It does not inject into The Isle, modify game files, install services, or read process memory. The checklist is manual-first.

## Prime Checklist

The app tracks 5-of-9 objectives from the public `EligiblePrimeElder` checklist:

- Visit a sanctuary as juvenile
- Hatch from an egg
- Achieve perfect diet
- Visit a mass migration zone
- Visit 2 migration zones
- Visit 4 patrol zones
- Never become temporarily infertile
- Never get muscle spasms
- Raise children to subadult

The public community consensus is that at least 5 objectives are needed, but this can change with The Isle patches and server behavior.

## Use

- `F6`: compact / expanded Prime Tracker
- `F7`: hide / show Prime Tracker
- `Esc`: return from expanded to compact

Check objectives as they happen. The migration and patrol counters can mark their matching objectives automatically.

## Build

Install dependencies:

```powershell
npm ci
```

Restore the app icon:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Restore-PrimeTrackerIcon.ps1
```

Run from source:

```powershell
npm start
```

Build the shareable Windows app folder:

```powershell
npm run pack
```

The packaged executable will be under:

```text
release\The Isle Prime Tracker-win32-x64\The Isle Prime Tracker.exe
```

Build an NSIS installer:

```powershell
npm run dist
```

Full build instructions are in `BUILD.md`.

## Distribution Notes

Unsigned Electron apps can trigger antivirus or SmartScreen warnings. For mod-community review, publish the full source, build steps, release hash, and `SECURITY_REVIEW.md` with the `.exe`.
