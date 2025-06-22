@echo off
echo Preparando arquivos para upload manual...

echo 1. Copiando arquivos de configuração...
copy vercel.json dist\vercel.json
copy public\_redirects dist\_redirects

echo 2. Criando arquivo ZIP...
powershell Compress-Archive -Path dist\* -DestinationPath dist.zip -Force

echo Processo concluído!
echo Arquivo ZIP criado: dist.zip
echo.
echo Agora você pode fazer upload deste arquivo ZIP no Vercel manualmente.
echo Veja as instruções em vercel-manual.txt
pause