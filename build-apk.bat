@echo off
echo Construindo o aplicativo para produção...
call npm run build:android

echo Sincronizando com o projeto Android...
call npx cap sync android

echo Gerando APK de release...
cd android
call .\gradlew.bat assembleRelease

echo APK de release gerado em android\app\build\outputs\apk\release\app-release.apk

echo Gerando Bundle AAB para a Play Store...
call .\gradlew.bat bundleRelease

echo Bundle AAB gerado em android\app\build\outputs\bundle\release\app-release.aab

echo Processo concluído!
pause