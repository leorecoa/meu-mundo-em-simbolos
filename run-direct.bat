@echo off
echo Executando o aplicativo diretamente...
cd android
call .\gradlew.bat runApp
echo Processo concluído!
pause