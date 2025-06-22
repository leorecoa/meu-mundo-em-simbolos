@echo off
echo Gerando APK de debug...
cd android
call .\gradlew.bat assembleDebug

echo Instalando APK no dispositivo...
call .\gradlew.bat installDebug

echo Processo concluído! O aplicativo foi instalado no seu dispositivo.
echo Abra o aplicativo "Meu Mundo em Símbolos" no seu dispositivo.
pause