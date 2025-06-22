@echo off
echo Corrigindo problemas do site...

echo 1. Construindo o aplicativo...
call npm run build

echo 2. Copiando arquivos de configuração...
copy public\_redirects dist\_redirects
copy vercel.json dist\vercel.json
copy public\fallback.html dist\fallback.html

echo Processo concluído.
echo Agora você pode implantar a pasta dist no Vercel.
pause