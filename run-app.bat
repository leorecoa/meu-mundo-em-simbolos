@echo off
echo Executando o aplicativo...
cd android
call .\gradlew.bat installDebug
echo Aplicativo instalado no dispositivo.
pause