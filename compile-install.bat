@echo off
echo Compilando e instalando o aplicativo...

cd android
call .\gradlew.bat clean
call .\gradlew.bat assembleDebug
call .\gradlew.bat installDebug

echo APK instalado no dispositivo.
echo Abra o aplicativo "Meu Mundo em Símbolos" no seu dispositivo.
pause