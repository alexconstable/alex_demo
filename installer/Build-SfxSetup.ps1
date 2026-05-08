[CmdletBinding()]
param(
  [string]$PackageRoot = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\The Isle Bosch Overlay Setup"),
  [string]$OutputExe = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\The-Isle-Bosch-Overlay-Setup.exe"),
  [string]$WorkingRoot = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

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
$sfxStub = "C:\Program Files\7-Zip\7z.sfx"
$sevenZipExe = "C:\Program Files\7-Zip\7z.exe"

if (-not (Test-Path -LiteralPath $sfxStub)) {
  throw "7-Zip SFX module was not found at '$sfxStub'."
}

if (-not (Test-Path -LiteralPath $sevenZipExe)) {
  throw "7-Zip executable was not found at '$sevenZipExe'."
}

New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$config = @'
;!@Install@!UTF-8!
Title="The Isle Bosch Overlay Setup"
BeginPrompt="This will extract and start The Isle Bosch Overlay installer."
RunProgram="Install Reptarland Gateway.cmd"
;!@InstallEnd@!
'@
Set-Content -LiteralPath $configPath -Value $config -Encoding UTF8

Push-Location $resolvedPackageRoot
try {
  & $sevenZipExe a -t7z -mx=9 $archivePath * | Out-Null
} finally {
  Pop-Location
}

if (Test-Path -LiteralPath $resolvedOutputExe) {
  Remove-Item -LiteralPath $resolvedOutputExe -Force
}

$sfxBytes = [System.IO.File]::ReadAllBytes($sfxStub)
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
