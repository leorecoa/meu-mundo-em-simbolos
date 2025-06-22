@echo off
echo Sincronizando projeto com Gradle...
cd android
call .\gradlew.bat --refresh-dependencies
call .\gradlew.bat clean
call .\gradlew.bat assembleDebug
echo Sincronização concluída. Agora você pode abrir o projeto no Android Studio.
pause