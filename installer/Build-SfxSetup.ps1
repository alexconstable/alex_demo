[CmdletBinding()]
param(
  [string]$PackageRoot = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\The Isle Bosch Overlay Setup"),
  [string]$OutputExe = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\The-Isle-Bosch-Overlay-Setup.exe"),
  [string]$WorkingRoot = "",
  [switch]$InstallToDesktop
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path -LiteralPath $PackageRoot)) {
  throw "Package root not found at '$PackageRoot'. Run Build-InstallerPackage.ps1 first."
}

$resolvedPackageRoot = [System.IO.Path]::GetFullPath($PackageRoot)
$resolvedOutputExe = [System.IO.Path]::GetFullPath($OutputExe)
$outputDir = Split-Path -Parent $resolvedOutputExe
$effectiveWorkingRoot = if ([string]::IsNullOrWhiteSpace($WorkingRoot)) {
  Join-Path $outputDir "_build"
} else {
  [System.IO.Path]::GetFullPath($WorkingRoot)
}
$tempRoot = Join-Path $effectiveWorkingRoot ("isle-bosch-overlay-sfx-" + [guid]::NewGuid().ToString("N"))
$archivePath = Join-Path $tempRoot "payload.7z"
$configPath = Join-Path $tempRoot "config.txt"
$payloadRoot = Join-Path $tempRoot "payload"
$iconStubPath = Join-Path $tempRoot "7z-icon.sfx"
$sfxStub = "C:\Program Files\7-Zip\7z.sfx"
$sevenZipExe = "C:\Program Files\7-Zip\7z.exe"
$appIconPath = Join-Path $PSScriptRoot "app-icon.ico"
$rceditCandidates = @(
  (Join-Path $projectRoot "node_modules\rcedit\bin\rcedit-x64.exe"),
  (Join-Path $projectRoot "node_modules\rcedit\bin\rcedit.exe"),
  (Join-Path $projectRoot "node_modules\electron-winstaller\vendor\rcedit.exe")
)

if (-not (Test-Path -LiteralPath $sfxStub)) {
  throw "7-Zip SFX module was not found at '$sfxStub'."
}

if (-not (Test-Path -LiteralPath $sevenZipExe)) {
  throw "7-Zip executable was not found at '$sevenZipExe'."
}

New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
New-Item -ItemType Directory -Path $payloadRoot -Force | Out-Null

Get-ChildItem -LiteralPath $resolvedPackageRoot -Force | Copy-Item -Destination $payloadRoot -Recurse -Force

$runProgram = "Install Reptarland Gateway.cmd"
if ($InstallToDesktop) {
  $desktopInstallCmd = @'
@echo off
setlocal
set "INSTALL_ROOT=%USERPROFILE%\Desktop\The Isle Bosch Overlay v2"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-ReptarlandGateway.ps1" -InstallRoot "%INSTALL_ROOT%" -LaunchAfterInstall
endlocal
'@
  Set-Content -LiteralPath (Join-Path $payloadRoot "Install The Isle Bosch Overlay v2 to Desktop.cmd") -Value $desktopInstallCmd -Encoding ASCII
  $runProgram = "Install The Isle Bosch Overlay v2 to Desktop.cmd"
}

$config = @"
;!@Install@!UTF-8!
Title="The Isle Bosch Overlay Setup"
BeginPrompt="This will extract and start The Isle Bosch Overlay installer."
RunProgram="$runProgram"
;!@InstallEnd@!
"@
Set-Content -LiteralPath $configPath -Value $config -Encoding UTF8

Push-Location $payloadRoot
try {
  & $sevenZipExe a -t7z -mx=9 $archivePath * | Out-Null
} finally {
  Pop-Location
}

if (Test-Path -LiteralPath $resolvedOutputExe) {
  Remove-Item -LiteralPath $resolvedOutputExe -Force
}

$effectiveSfxStub = $sfxStub
$rceditExe = $rceditCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ((Test-Path -LiteralPath $appIconPath) -and $rceditExe) {
  Copy-Item -LiteralPath $sfxStub -Destination $iconStubPath -Force
  & $rceditExe $iconStubPath --set-icon $appIconPath
  $effectiveSfxStub = $iconStubPath
}

$sfxBytes = [System.IO.File]::ReadAllBytes($effectiveSfxStub)
$configBytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content -LiteralPath $configPath -Raw))
$archiveBytes = [System.IO.File]::ReadAllBytes($archivePath)

$stream = [System.IO.File]::Open($resolvedOutputExe, [System.IO.FileMode]::CreateNew)
try {
  $stream.Write($sfxBytes, 0, $sfxBytes.Length)
  $stream.Write($configBytes, 0, $configBytes.Length)
  $stream.Write($archiveBytes, 0, $archiveBytes.Length)
} finally {
  $stream.Dispose()
}

if (-not (Test-Path -LiteralPath $resolvedOutputExe)) {
  throw "Self-extracting setup executable was not created at '$resolvedOutputExe'."
}

[pscustomobject]@{
  PackageRoot = $resolvedPackageRoot
  OutputExe = $resolvedOutputExe
  TempRoot = $tempRoot
} | Format-List | Out-String | Write-Output
