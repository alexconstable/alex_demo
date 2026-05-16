[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$InstallRoot = $PSScriptRoot,
  [switch]$KeepDesktopShortcut
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$resolvedInstallRoot = [System.IO.Path]::GetFullPath($InstallRoot)
$installMarker = Join-Path $resolvedInstallRoot ".the-isle-bosch-overlay-install.json"

if (-not (Test-Path -LiteralPath $installMarker)) {
  throw "Refusing to uninstall from '$resolvedInstallRoot' because The Isle Bosch Overlay install marker was not found."
}

$desktopShortcuts = @(
  (Join-Path ([Environment]::GetFolderPath("Desktop")) "The Isle Bosch Overlay.lnk"),
  (Join-Path ([Environment]::GetFolderPath("Desktop")) "The Isle Bosch Overlay Launcher.lnk")
)
$startMenuRoot = Join-Path $env:APPDATA "Microsoft\\Windows\\Start Menu\\Programs\\The Isle Bosch Overlay"

function Clear-TreeAttributes {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return
  }

  & attrib.exe -R "$Path\\*" /S /D 2>$null | Out-Null
}

Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
  $_.Name -in @("The Isle Bosch Overlay.exe", "Reptarland Gateway Overlay.exe", "electron.exe")
} | ForEach-Object {
  Stop-Process -Id $_.ProcessId -Force
}

if (-not $KeepDesktopShortcut) {
  foreach ($desktopShortcut in $desktopShortcuts) {
    if (Test-Path -LiteralPath $desktopShortcut) {
      Remove-Item -LiteralPath $desktopShortcut -Force
    }
  }
}

if (Test-Path -LiteralPath $startMenuRoot) {
  Clear-TreeAttributes -Path $startMenuRoot
  Remove-Item -LiteralPath $startMenuRoot -Recurse -Force
}

if (Test-Path -LiteralPath $resolvedInstallRoot) {
  Clear-TreeAttributes -Path $resolvedInstallRoot
  Remove-Item -LiteralPath $resolvedInstallRoot -Recurse -Force
}
