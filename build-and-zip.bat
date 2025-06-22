@echo off
echo Construindo o projeto e preparando para upload...

echo 1. Construindo o projeto...
cd c:\Users\Leorecoa\meu-mundo-em-simbolos\meu-mundo-em-simbolos
call npm run build

echo 2. Verificando se a pasta dist foi criada...
if not exist "dist" (
  echo ERRO: A pasta dist não foi criada!
  pause
  exit /b 1
)

echo 3. Criando arquivo ZIP...
powershell Compress-Archive -Path dist\* -DestinationPath dist.zip -Force

echo Processo concluído!
echo Arquivo ZIP criado: dist.zip
echo.
echo Agora você pode fazer upload deste arquivo ZIP no Vercel manualmente:
echo 1. Acesse https://vercel.com/ no seu navegador
echo 2. Faça login na sua conta
echo 3. Clique em "Add New..." > "Project"
echo 4. Escolha "Upload" na seção "Import Git Repository"
echo 5. Arraste e solte o arquivo dist.zip
echo 6. Clique em "Deploy"
pause