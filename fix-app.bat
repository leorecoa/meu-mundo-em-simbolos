@echo off
echo Sincronizando alterações...
call npx cap sync android

echo Limpando o projeto Android...
cd android
call .\gradlew.bat clean
cd ..

echo Construindo o aplicativo...
call npm run build

echo Sincronizando novamente...
call npx cap sync android

echo Gerando APK de debug...
cd android
call .\gradlew.bat assembleDebug

echo APK de debug gerado em android\app\build\outputs\apk\debug\app-debug.apk
echo Instale este APK no seu dispositivo para testar.

echo Processo concluído!
pause