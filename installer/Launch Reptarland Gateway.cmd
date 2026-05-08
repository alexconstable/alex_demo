@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Launch-ReptarlandGateway.ps1" %*
endlocal
