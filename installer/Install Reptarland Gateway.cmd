@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-ReptarlandGateway.ps1" %*
endlocal
