@echo off
echo Compilando APK...

cd android
call .\gradlew.bat assembleDebug

echo APK gerado em: android\app\build\outputs\apk\debug\app-debug.apk
pause