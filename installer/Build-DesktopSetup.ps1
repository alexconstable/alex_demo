[CmdletBinding()]
param(
  [string]$PackagedApp = "",
  [string]$OutputExe = "",
  [string]$WorkingRoot = "",
  [switch]$KeepTemp
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($PackagedApp)) {
  $PackagedApp = Join-Path $projectRoot "release\The Isle Prime Tracker-win32-x64"
}
if ([string]::IsNullOrWhiteSpace($OutputExe)) {
  $OutputExe = Join-Path $projectRoot "dist\The-Isle-Prime-Tracker-Desktop-Setup.exe"
}

if (-not (Test-Path -LiteralPath $PackagedApp)) {
  throw "Packaged app folder not found at '$PackagedApp'. Run npm run pack first."
}

$resolvedPackagedApp = [System.IO.Path]::GetFullPath($PackagedApp)
$resolvedOutputExe = [System.IO.Path]::GetFullPath($OutputExe)
$outputDir = Split-Path -Parent $resolvedOutputExe
$effectiveWorkingRoot = if ([string]::IsNullOrWhiteSpace($WorkingRoot)) {
  Join-Path $outputDir "_build"
} else {
  [System.IO.Path]::GetFullPath($WorkingRoot)
}

$tempRoot = Join-Path $effectiveWorkingRoot ("prime-tracker-iexpress-" + [guid]::NewGuid().ToString("N"))
$payloadRoot = Join-Path $tempRoot "payload"
$payloadApp = Join-Path $payloadRoot "The Isle Prime Tracker"
$payloadZipPath = Join-Path $tempRoot "prime-tracker-package.zip"
$bootstrapCmdPath = Join-Path $tempRoot "Install-PrimeTracker.cmd"
$bootstrapPs1Path = Join-Path $tempRoot "Install-PrimeTracker.ps1"
$sedPath = Join-Path $tempRoot "setup.sed"
$iexpressExe = Join-Path $env:WINDIR "System32\iexpress.exe"

New-Item -ItemType Directory -Path $payloadApp -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Copy-Item -LiteralPath (Join-Path $resolvedPackagedApp "*") -Destination $payloadApp -Recurse -Force

if (Test-Path -LiteralPath $payloadZipPath) {
  Remove-Item -LiteralPath $payloadZipPath -Force
}
Compress-Archive -Path (Join-Path $payloadRoot "*") -DestinationPath $payloadZipPath -CompressionLevel Optimal -Force

$bootstrapCmd = @'
@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-PrimeTracker.ps1"
endlocal
'@
Set-Content -LiteralPath $bootstrapCmdPath -Value $bootstrapCmd -Encoding ASCII

$bootstrapPs1 = @'
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$payloadZip = Join-Path $scriptRoot "prime-tracker-package.zip"
$desktop = [Environment]::GetFolderPath("DesktopDirectory")
$installDir = Join-Path $desktop "The Isle Prime Tracker"
$extractRoot = Join-Path $env:TEMP ("TheIslePrimeTrackerSetup_" + [guid]::NewGuid().ToString("N"))

New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
try {
  Expand-Archive -LiteralPath $payloadZip -DestinationPath $extractRoot -Force
  $sourceDir = Join-Path $extractRoot "The Isle Prime Tracker"
  if (-not (Test-Path -LiteralPath $sourceDir)) {
    throw "Payload did not contain the expected The Isle Prime Tracker folder."
  }

  if (Test-Path -LiteralPath $installDir) {
    $backupDir = Join-Path $desktop ("The Isle Prime Tracker Backup " + (Get-Date -Format "yyyyMMdd-HHmmss"))
    Move-Item -LiteralPath $installDir -Destination $backupDir -Force
  }

  Copy-Item -LiteralPath $sourceDir -Destination $installDir -Recurse -Force

  $exePath = Join-Path $installDir "The Isle Prime Tracker.exe"
  if (-not (Test-Path -LiteralPath $exePath)) {
    throw "Installed executable was not found at '$exePath'."
  }

  $shortcutPath = Join-Path $desktop "The Isle Prime Tracker.lnk"
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $exePath
  $shortcut.WorkingDirectory = $installDir
  $shortcut.IconLocation = "$exePath,0"
  $shortcut.Save()

  Start-Process -FilePath $exePath -WorkingDirectory $installDir
} finally {
  Start-Sleep -Milliseconds 500
  if (Test-Path -LiteralPath $extractRoot) {
    Remove-Item -LiteralPath $extractRoot -Recurse -Force -ErrorAction SilentlyContinue
  }
}
'@
Set-Content -LiteralPath $bootstrapPs1Path -Value $bootstrapPs1 -Encoding UTF8

$sedContent = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=The Isle Prime Tracker was extracted to your Desktop.
TargetName=$resolvedOutputExe
FriendlyName=The Isle Prime Tracker Desktop Setup
AppLaunched=cmd /c Install-PrimeTracker.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[Strings]
FILE0=prime-tracker-package.zip
FILE1=Install-PrimeTracker.cmd
FILE2=Install-PrimeTracker.ps1
[SourceFiles]
SourceFiles0=$tempRoot\
[SourceFiles0]
%FILE0%=
%FILE1%=
%FILE2%=
"@
Set-Content -LiteralPath $sedPath -Value $sedContent -Encoding ASCII

if (-not (Test-Path -LiteralPath $iexpressExe)) {
  throw "IExpress was not found at '$iexpressExe'."
}

& $iexpressExe /N $sedPath

if (-not (Test-Path -LiteralPath $resolvedOutputExe)) {
  throw "IExpress did not produce the expected setup executable at '$resolvedOutputExe'. Temp files are in '$tempRoot'."
}

[pscustomobject]@{
  PackagedApp = $resolvedPackagedApp
  OutputExe = $resolvedOutputExe
  PayloadZip = $payloadZipPath
  TempRoot = $tempRoot
} | Format-List | Out-String | Write-Output

if (-not $KeepTemp -and (Test-Path -LiteralPath $tempRoot)) {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
