@echo off
echo Construindo o aplicativo...
call npm run build

echo Sincronizando com o projeto Android...
call npx cap sync android

echo Gerando APK de debug...
cd android
call .\gradlew.bat assembleDebug

echo APK de debug gerado em android\app\build\outputs\apk\debug\app-debug.apk

echo Processo concluído!
pause