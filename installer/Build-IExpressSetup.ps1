[CmdletBinding()]
param(
  [string]$PackageZip = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\The Isle Bosch Overlay Setup.zip"),
  [string]$OutputExe = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\The-Isle-Bosch-Overlay-Setup.exe"),
  [string]$WorkingRoot = "",
  [switch]$KeepTemp
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $PackageZip)) {
  throw "Package zip not found at '$PackageZip'. Run Build-InstallerPackage.ps1 -ZipOutput first."
}

$resolvedPackageZip = [System.IO.Path]::GetFullPath($PackageZip)
$resolvedOutputExe = [System.IO.Path]::GetFullPath($OutputExe)
$outputDir = Split-Path -Parent $resolvedOutputExe
$effectiveWorkingRoot = if ([string]::IsNullOrWhiteSpace($WorkingRoot)) {
  Join-Path $outputDir "_build"
} else {
  [System.IO.Path]::GetFullPath($WorkingRoot)
}
$tempRoot = Join-Path $effectiveWorkingRoot ("isle-bosch-overlay-iexpress-" + [guid]::NewGuid().ToString("N"))
$bootstrapCmdPath = Join-Path $tempRoot "Run-Installer.cmd"
$bootstrapPs1Path = Join-Path $tempRoot "Run-Installer.ps1"
$payloadZipPath = Join-Path $tempRoot "overlay-package.zip"
$sedPath = Join-Path $tempRoot "setup.sed"
$iexpressExe = Join-Path $env:WINDIR "System32\iexpress.exe"

New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
Copy-Item -LiteralPath $resolvedPackageZip -Destination $payloadZipPath -Force

$bootstrapCmd = @'
@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Run-Installer.ps1"
endlocal
'@
Set-Content -LiteralPath $bootstrapCmdPath -Value $bootstrapCmd -Encoding ASCII

$bootstrapPs1 = @'
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$payloadZip = Join-Path $scriptRoot "overlay-package.zip"
$extractRoot = Join-Path $env:TEMP ("TheIsleBoschOverlaySetup_" + [guid]::NewGuid().ToString("N"))

New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
Expand-Archive -LiteralPath $payloadZip -DestinationPath $extractRoot -Force

$installerCmd = Join-Path $extractRoot "Install Reptarland Gateway.cmd"
if (-not (Test-Path -LiteralPath $installerCmd)) {
  throw "Installer command not found in extracted package at '$installerCmd'."
}

try {
  $process = Start-Process -FilePath $installerCmd -ArgumentList "-LaunchAfterInstall" -WorkingDirectory $extractRoot -PassThru -Wait
  if ($process.ExitCode -ne 0) {
    throw "Install command exited with code $($process.ExitCode)."
  }
} finally {
  Start-Sleep -Seconds 1
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
FinishMessage=
TargetName=$resolvedOutputExe
FriendlyName=The Isle Bosch Overlay Setup
AppLaunched=cmd /c Run-Installer.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[Strings]
FILE0=overlay-package.zip
FILE1=Run-Installer.cmd
FILE2=Run-Installer.ps1
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
  PackageZip = $resolvedPackageZip
  OutputExe = $resolvedOutputExe
  TempRoot = $tempRoot
} | Format-List | Out-String | Write-Output

if (-not $KeepTemp -and (Test-Path -LiteralPath $tempRoot)) {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
