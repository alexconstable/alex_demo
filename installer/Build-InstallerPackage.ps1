[CmdletBinding()]
param(
  [string]$SourceAppRoot = "",
  [string]$OutputRoot = (Join-Path (Split-Path -Parent $PSScriptRoot) "dist\\The Isle Bosch Overlay Setup"),
  [switch]$ZipOutput
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$releaseRoot = if (-not [string]::IsNullOrWhiteSpace($SourceAppRoot)) {
  $SourceAppRoot
} else {
  Join-Path $projectRoot "release\\win-unpacked"
}

if (-not (Test-Path -LiteralPath $releaseRoot)) {
  throw "Packaged overlay build not found at '$releaseRoot'. Run npm run pack first."
}

$resolvedOutputRoot = [System.IO.Path]::GetFullPath($OutputRoot)
$appOutputRoot = Join-Path $resolvedOutputRoot "app"

if (Test-Path -LiteralPath $resolvedOutputRoot) {
  Remove-Item -LiteralPath $resolvedOutputRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $resolvedOutputRoot -Force | Out-Null
New-Item -ItemType Directory -Path $appOutputRoot -Force | Out-Null

$filesToCopy = @(
  "Install-ReptarlandGateway.ps1",
  "Install Reptarland Gateway.cmd",
  "Launch-ReptarlandGateway.ps1",
  "Launch Reptarland Gateway.cmd",
  "Uninstall-ReptarlandGateway.ps1",
  "Uninstall Reptarland Gateway.cmd",
  "app-icon.ico",
  "README.md",
  "RELEASE_NOTES_v2.md"
)

foreach ($file in $filesToCopy) {
  Copy-Item -LiteralPath (Join-Path $PSScriptRoot $file) -Destination (Join-Path $resolvedOutputRoot $file) -Force
}

Get-ChildItem -LiteralPath $releaseRoot -Force | Copy-Item -Destination $appOutputRoot -Recurse -Force

$zipPath = "$resolvedOutputRoot.zip"
if ($ZipOutput) {
  if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }

  Compress-Archive -Path (Join-Path $resolvedOutputRoot "*") -DestinationPath $zipPath -CompressionLevel Optimal
}

[pscustomobject]@{
  PackageRoot = $resolvedOutputRoot
  AppRoot = $appOutputRoot
  ZipPath = if ($ZipOutput) { $zipPath } else { "" }
} | Format-List | Out-String | Write-Output
