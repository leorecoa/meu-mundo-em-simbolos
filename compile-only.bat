@echo off
echo Compilando APK...

cd android
call .\gradlew.bat assembleDebug --info

echo Processo concluído.
pause