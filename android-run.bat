@echo off
echo Este script ajuda a executar o aplicativo Android corretamente.
echo.
echo IMPORTANTE: No Android Studio, NÃO tente executar com o botão "Run" padrão.
echo Em vez disso, siga estas etapas:
echo.
echo 1. No Android Studio, clique em "Run" no menu superior
echo 2. Selecione "Edit Configurations..."
echo 3. Clique no "+" no canto superior esquerdo
echo 4. Selecione "Android App"
echo 5. Em "Module", selecione "app"
echo 6. Clique em "Apply" e depois em "OK"
echo 7. Agora você pode executar o aplicativo com o botão "Run"
echo.
echo Alternativamente, você pode instalar o APK diretamente no seu dispositivo:
echo.

cd android
call .\gradlew.bat assembleDebug
echo.
echo APK gerado em: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Deseja instalar o APK no dispositivo conectado? (S/N)
set /p resposta=

if /i "%resposta%"=="S" (
  call .\gradlew.bat installDebug
  echo APK instalado no dispositivo.
) else (
  echo Instalação cancelada.
)

pause