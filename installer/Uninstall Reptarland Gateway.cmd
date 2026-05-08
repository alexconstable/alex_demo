@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Uninstall-ReptarlandGateway.ps1" %*
endlocal
