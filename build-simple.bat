@echo off
echo Construindo e preparando para deploy...

echo 1. Navegando para o diretório correto...
cd /d c:\Users\Leorecoa\meu-mundo-em-simbolos\meu-mundo-em-simbolos

echo 2. Limpando pasta dist...
if exist "dist" rmdir /s /q dist

echo 3. Construindo o projeto...
call npm run build

echo 4. Verificando se a pasta dist foi criada...
if not exist "dist" (
  echo ERRO: A pasta dist não foi criada!
  pause
  exit /b 1
)

echo 5. Copiando arquivos importantes...
copy public\manifest.json dist\manifest.json
copy public\_redirects dist\_redirects

echo 6. Criando arquivo ZIP para deploy...
powershell Compress-Archive -Path dist\* -DestinationPath dist.zip -Force

echo Processo concluído!
echo Arquivo ZIP criado: c:\Users\Leorecoa\meu-mundo-em-simbolos\meu-mundo-em-simbolos\dist.zip
echo.
echo Para fazer deploy no Vercel:
echo 1. Acesse https://vercel.com/ no seu navegador
echo 2. Faça login na sua conta
echo 3. Clique em "Add New..." > "Project"
echo 4. Escolha "Upload" na seção "Import Git Repository"
echo 5. Arraste e solte o arquivo dist.zip
echo 6. Clique em "Deploy"
pause