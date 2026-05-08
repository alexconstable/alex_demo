# Nexus Mods Quarantine Response Draft

Hello,

Thank you for reviewing it. I believe the scanner results are most likely from the way the mod is packaged rather than from the mod source itself. It is a Windows Electron overlay, so the release includes the Electron/Chromium runtime, DLLs, `.pak` files, a bundled `resources/app.asar`, and PowerShell installer/launcher scripts. The build is currently unsigned, and I understand that unsigned Electron apps and self-extracting installer formats can produce heuristic detections.

The full source code and build instructions are available here:

https://github.com/alexconstable/alex_demo/tree/the-isle-bosch-overlay-source

The repository includes:

- Full application source
- Installer and launcher scripts
- Dependency lockfile
- Reproducible build instructions in `BUILD.md`
- Security/review notes in `SECURITY_REVIEW.md`

For clarity, the overlay does not inject into the game process, does not modify game files, does not install a service or scheduled task, does not include custom native code, and does not collect Steam credentials. Steam authentication happens directly inside the Bosch Island web page loaded in an Electron webview.

I am happy to make any packaging changes you recommend, such as submitting a zip/folder package instead of a self-extracting executable, removing optional installer wrappers, or adding any additional documentation that would help your review.

Thank you.
