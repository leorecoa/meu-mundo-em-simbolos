@echo off
echo Limpando o projeto Android...
cd android
call .\gradlew.bat clean
cd ..

echo Construindo o aplicativo...
call npm run build

echo Sincronizando com o projeto Android...
call npx cap sync android

echo Projeto limpo e reconstruído com sucesso!
echo Agora você pode abrir o Android Studio com: npm run cap:open
pause