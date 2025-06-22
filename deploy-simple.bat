@echo off
echo Implantando página simples...

echo 1. Criando pasta de implantação...
mkdir simple-deploy
copy public\index-simple.html simple-deploy\index.html

echo 2. Copiando arquivos de configuração...
copy public\_redirects simple-deploy\_redirects
copy vercel.json simple-deploy\vercel.json

echo Processo concluído.
echo Agora você pode implantar a pasta simple-deploy no Vercel.
echo Comando: vercel simple-deploy
pause