@echo off
set EAS_NO_VCS=1
echo Iniciando EAS Build (Android - preview)...
eas build --platform android --profile preview
pause
