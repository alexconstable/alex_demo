[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$base64Path = Join-Path $projectRoot "assets\prime-tracker.ico.base64"
$iconPath = Join-Path $projectRoot "assets\prime-tracker.ico"

if (-not (Test-Path -LiteralPath $base64Path)) {
  throw "Missing icon source at '$base64Path'."
}

$base64 = (Get-Content -LiteralPath $base64Path -Raw) -replace "\s", ""
$bytes = [Convert]::FromBase64String($base64)
[System.IO.File]::WriteAllBytes($iconPath, $bytes)

Write-Output "Restored $iconPath"
