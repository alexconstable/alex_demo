[CmdletBinding()]
param(
  [switch]$NoMumble,
  [switch]$CheckOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$installRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$overlayWorkingDirectory = Join-Path $installRoot "app"

function Resolve-OverlayExecutable {
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

  return $null
}

$overlayExe = Resolve-OverlayExecutable -Root $overlayWorkingDirectory

function Get-ShortcutTarget {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ShortcutPath
  )

  if (-not (Test-Path -LiteralPath $ShortcutPath)) {
    return $null
  }

  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($ShortcutPath)

  if ([string]::IsNullOrWhiteSpace($shortcut.TargetPath)) {
    return $null
  }

  return $shortcut.TargetPath
}

function Resolve-MumbleExecutable {
  $candidates = @()

  if ($env:REPTAR_MUMBLE_PATH) {
    $candidates += $env:REPTAR_MUMBLE_PATH
  }

  $candidates += @(
    "C:\\Program Files\\Mumble\\client\\mumble.exe",
    "C:\\Program Files (x86)\\Mumble\\client\\mumble.exe",
    "C:\\Program Files\\Mumble\\mumble.exe",
    "C:\\Program Files (x86)\\Mumble\\mumble.exe"
  )

  $shortcutRoots = @(
    (Join-Path $env:ProgramData "Microsoft\\Windows\\Start Menu\\Programs\\Mumble\\Mumble.lnk"),
    (Join-Path $env:APPDATA "Microsoft\\Windows\\Start Menu\\Programs\\Mumble\\Mumble.lnk")
  )

  foreach ($shortcut in $shortcutRoots) {
    $target = Get-ShortcutTarget -ShortcutPath $shortcut

    if ($target) {
      $candidates += $target
    }
  }

  foreach ($candidate in $candidates | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique) {
    if (Test-Path -LiteralPath $candidate) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  return $null
}

function Get-OverlayProcess {
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -in @("The Isle Bosch Overlay.exe", "Reptarland Gateway Overlay.exe", "electron.exe")
  } | Select-Object -First 1
}

function Get-MumbleProcess {
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -ieq "mumble.exe"
  } | Select-Object -First 1
}

if (-not (Test-Path -LiteralPath $overlayExe)) {
  throw "Overlay executable was not found at '$overlayExe'. Reinstall The Isle Bosch Overlay package."
}

$mumblePath = $null
if (-not $NoMumble) {
  $mumblePath = Resolve-MumbleExecutable
}

$status = [pscustomobject]@{
  OverlayExecutable = $overlayExe
  OverlayRunning = [bool](Get-OverlayProcess)
  MumbleExecutable = $mumblePath
  MumbleRunning = [bool](Get-MumbleProcess)
}

if ($CheckOnly) {
  $status | Format-List | Out-String | Write-Output
  exit 0
}

if (-not $status.OverlayRunning) {
  Start-Process -FilePath $overlayExe -WorkingDirectory $overlayWorkingDirectory
}

if (-not $NoMumble -and -not $status.MumbleRunning) {
  if ($mumblePath) {
    Start-Process -FilePath $mumblePath -WorkingDirectory (Split-Path -Parent $mumblePath)
  } else {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show(
      "Mumble could not be found on this PC. Install Mumble or set REPTAR_MUMBLE_PATH, then launch The Isle Bosch Overlay again.",
      "The Isle Bosch Overlay Launcher",
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Warning
    ) | Out-Null
  }
}
