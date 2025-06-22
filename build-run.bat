@echo off
echo Construindo e executando o aplicativo...

echo 1. Construindo o aplicativo web...
call npm run build

echo 2. Sincronizando com o projeto Android...
call npx cap sync android

echo 3. Compilando o APK...
cd android
call .\gradlew.bat clean
call .\gradlew.bat assembleDebug

echo 4. Instalando o APK no dispositivo...
call .\gradlew.bat installDebug

echo Processo concluído! O aplicativo foi instalado no seu dispositivo.
echo Abra o aplicativo "Meu Mundo em Símbolos" no seu dispositivo.
pause