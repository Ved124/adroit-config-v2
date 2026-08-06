@echo off
REM Double-click this file to start the exhibition server with auto-restart.
REM If the server ever crashes, it restarts itself automatically — keep this
REM window open all day. Closing this window stops the server.

cd /d "%~dp0"
echo Starting Adroit Configurator (auto-restart enabled)...
echo Keep this window open. Closing it will stop the server for all devices.
echo.
call npm run start:watch

echo.
echo Server stopped. Press any key to close this window.
pause >nul
