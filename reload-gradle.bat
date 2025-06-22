@echo off
echo Recarregando configurações do Gradle...

cd android
call .\gradlew.bat --refresh-dependencies
call .\gradlew.bat --stop
call .\gradlew.bat --status

echo Configurações recarregadas.
pause