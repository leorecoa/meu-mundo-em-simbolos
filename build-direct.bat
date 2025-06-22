@echo off
echo Compilando APK diretamente...

cd android
call .\gradlew.bat clean
call .\gradlew.bat assembleDebug --stacktrace

echo APK gerado em: android\app\build\outputs\apk\debug\app-debug.apk
pause