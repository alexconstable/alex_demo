[CmdletBinding()]
param(
  [string]$InstallRoot = (Join-Path $env:LOCALAPPDATA "TheIsleBoschOverlay"),
  [string]$SourceAppRoot = "",
  [switch]$SkipShortcuts,
  [switch]$LaunchAfterInstall
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$packageAppRoot = Join-Path $packageRoot "app"
$packageIconPath = Join-Path $packageRoot "app-icon.ico"
$repoBuildRoot = Join-Path (Split-Path -Parent $packageRoot) "release\\win-unpacked"
$effectiveSourceAppRoot = if (-not [string]::IsNullOrWhiteSpace($SourceAppRoot)) {
  $SourceAppRoot
} elseif (Test-Path -LiteralPath $packageAppRoot) {
  $packageAppRoot
} else {
  $repoBuildRoot
}

if (-not (Test-Path -LiteralPath $effectiveSourceAppRoot)) {
  throw "Could not find the packaged overlay app. Expected '$packageAppRoot', '$repoBuildRoot', or the provided SourceAppRoot."
}

$resolvedInstallRoot = [System.IO.Path]::GetFullPath($InstallRoot)
$installAppRoot = Join-Path $resolvedInstallRoot "app"
$installMarker = Join-Path $resolvedInstallRoot ".the-isle-bosch-overlay-install.json"
$installIconPath = Join-Path $resolvedInstallRoot "app-icon.ico"

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

function Resolve-OverlayExecutablePath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $candidates = @(
    (Join-Path $Root "The Isle Bosch Overlay.exe"),
    (Join-Path $Root "Reptarland Gateway Overlay.exe"),
    (Join-Path $Root "electron.exe")
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  throw "Could not find an overlay executable inside '$Root'."
}

function Copy-Tree {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,
    [Parameter(Mandatory = $true)]
    [string]$Destination
  )

  if (Test-Path -LiteralPath $Destination) {
    Clear-TreeAttributes -Path $Destination
    Remove-Item -LiteralPath $Destination -Recurse -Force
  }

  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  Get-ChildItem -LiteralPath $Source -Force | Copy-Item -Destination $Destination -Recurse -Force
}

function Copy-FileSafe {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,
    [Parameter(Mandatory = $true)]
    [string]$Destination
  )

  Copy-Item -LiteralPath $Source -Destination $Destination -Force
}

function New-WindowsShortcut {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ShortcutPath,
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,
    [string]$Arguments = "",
    [string]$WorkingDirectory = "",
    [string]$Description = "",
    [string]$IconLocation = ""
  )

  $shortcutFolder = Split-Path -Parent $ShortcutPath
  New-Item -ItemType Directory -Path $shortcutFolder -Force | Out-Null

  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($ShortcutPath)
  $shortcut.TargetPath = $TargetPath
  $shortcut.Arguments = $Arguments
  $shortcut.WorkingDirectory = $WorkingDirectory
  $shortcut.Description = $Description

  if (-not [string]::IsNullOrWhiteSpace($IconLocation)) {
    $shortcut.IconLocation = $IconLocation
  }

  $shortcut.Save()
}

function Remove-PathIfExists {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  if (Test-Path -LiteralPath $Path) {
    Clear-TreeAttributes -Path $Path
    Remove-Item -LiteralPath $Path -Recurse -Force -ErrorAction SilentlyContinue
  }
}

Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
  $_.Name -in @("The Isle Bosch Overlay.exe", "Reptarland Gateway Overlay.exe")
} | ForEach-Object {
  Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

$desktopRoot = [Environment]::GetFolderPath("Desktop")
$legacyInstallRoots = @(
  (Join-Path $env:LOCALAPPDATA "ReptarlandGatewayOverlay"),
  (Join-Path $env:LOCALAPPDATA "Reptarland Gateway Overlay"),
  (Join-Path $env:LOCALAPPDATA "TheIsleBoschOverlay"),
  (Join-Path $desktopRoot "Reptarland Gateway Overlay"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay v1"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay v2")
) | Where-Object {
  -not [string]::IsNullOrWhiteSpace($_) -and
  ([System.IO.Path]::GetFullPath($_) -ne $resolvedInstallRoot)
}

foreach ($legacyRoot in $legacyInstallRoots) {
  Remove-PathIfExists -Path $legacyRoot
}

$legacyShortcutPaths = @(
  (Join-Path $desktopRoot "Reptarland Gateway Overlay.lnk"),
  (Join-Path $desktopRoot "Reptarland Gateway Launcher.lnk"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay v1.lnk"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay v2.lnk"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay.lnk"),
  (Join-Path $desktopRoot "The Isle Bosch Overlay Launcher.lnk")
)

foreach ($legacyShortcut in $legacyShortcutPaths) {
  if (Test-Path -LiteralPath $legacyShortcut) {
    Remove-Item -LiteralPath $legacyShortcut -Force -ErrorAction SilentlyContinue
  }
}

if (Test-Path -LiteralPath $resolvedInstallRoot) {
  Clear-TreeAttributes -Path $resolvedInstallRoot
  Remove-Item -LiteralPath $resolvedInstallRoot -Recurse -Force -ErrorAction SilentlyContinue
}

New-Item -ItemType Directory -Path $resolvedInstallRoot -Force | Out-Null

Copy-Tree -Source $effectiveSourceAppRoot -Destination $installAppRoot

$scriptFiles = @(
  "Launch-ReptarlandGateway.ps1",
  "Launch Reptarland Gateway.cmd",
  "Uninstall-ReptarlandGateway.ps1",
  "Uninstall Reptarland Gateway.cmd"
)

foreach ($file in $scriptFiles) {
  Copy-FileSafe -Source (Join-Path $packageRoot $file) -Destination (Join-Path $resolvedInstallRoot $file)
}

if (Test-Path -LiteralPath $packageIconPath) {
  Copy-FileSafe -Source $packageIconPath -Destination $installIconPath
}

[pscustomobject]@{
  Product = "The Isle Bosch Overlay"
  InstalledAt = (Get-Date).ToString("o")
  InstallRoot = $resolvedInstallRoot
} | ConvertTo-Json | Set-Content -LiteralPath $installMarker -Encoding UTF8

$overlayExe = Resolve-OverlayExecutablePath -Root $installAppRoot
$launcherCmd = Join-Path $resolvedInstallRoot "Launch Reptarland Gateway.cmd"
$uninstallCmd = Join-Path $resolvedInstallRoot "Uninstall Reptarland Gateway.cmd"

if (-not $SkipShortcuts) {
  $desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "The Isle Bosch Overlay.lnk"
  $desktopLauncherShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "The Isle Bosch Overlay Launcher.lnk"
  $desktopV2Shortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "The Isle Bosch Overlay v2.lnk"
  $startMenuRoot = Join-Path $env:APPDATA "Microsoft\\Windows\\Start Menu\\Programs\\The Isle Bosch Overlay"
  $startMenuApp = Join-Path $startMenuRoot "The Isle Bosch Overlay.lnk"
  $startMenuLauncher = Join-Path $startMenuRoot "The Isle Bosch Overlay Launcher.lnk"
  $startMenuUninstall = Join-Path $startMenuRoot "Uninstall The Isle Bosch Overlay.lnk"
  $shortcutIcon = if (Test-Path -LiteralPath $installIconPath) { $installIconPath } else { $overlayExe }

  New-WindowsShortcut -ShortcutPath $desktopShortcut -TargetPath $overlayExe -WorkingDirectory $installAppRoot -Description "Launches The Isle Bosch Overlay." -IconLocation $shortcutIcon
  New-WindowsShortcut -ShortcutPath $desktopLauncherShortcut -TargetPath $launcherCmd -WorkingDirectory $resolvedInstallRoot -Description "Starts Mumble and The Isle Bosch Overlay." -IconLocation $shortcutIcon
  New-WindowsShortcut -ShortcutPath $desktopV2Shortcut -TargetPath $launcherCmd -WorkingDirectory $resolvedInstallRoot -Description "Starts The Isle Bosch Overlay v2." -IconLocation $shortcutIcon
  New-WindowsShortcut -ShortcutPath $startMenuApp -TargetPath $overlayExe -WorkingDirectory $installAppRoot -Description "Launches The Isle Bosch Overlay." -IconLocation $shortcutIcon
  New-WindowsShortcut -ShortcutPath $startMenuLauncher -TargetPath $launcherCmd -WorkingDirectory $resolvedInstallRoot -Description "Starts Mumble and The Isle Bosch Overlay." -IconLocation $shortcutIcon
  New-WindowsShortcut -ShortcutPath $startMenuUninstall -TargetPath $uninstallCmd -WorkingDirectory $resolvedInstallRoot -Description "Removes The Isle Bosch Overlay from this PC." -IconLocation $shortcutIcon
}

if ($LaunchAfterInstall) {
  Start-Process -FilePath $launcherCmd -WorkingDirectory $resolvedInstallRoot
}

[pscustomobject]@{
  InstallRoot = $resolvedInstallRoot
  SourceAppRoot = $effectiveSourceAppRoot
  OverlayExecutable = $overlayExe
  Launcher = $launcherCmd
  InstallMarker = $installMarker
  ShortcutsCreated = (-not $SkipShortcuts)
} | Format-List | Out-String | Write-Output
