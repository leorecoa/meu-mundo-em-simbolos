@echo off
echo Limpando o projeto...
cd android
call .\gradlew.bat clean
cd ..

echo Removendo diretório de build...
rmdir /s /q android\app\build

echo Construindo o aplicativo...
call npm run build

echo Sincronizando com o projeto Android...
call npx cap sync android

echo Compilando o aplicativo...
cd android
call .\gradlew.bat assembleDebug

echo APK gerado em android\app\build\outputs\apk\debug\app-debug.apk
echo Instale este APK no seu dispositivo.

echo Processo concluído!
pause