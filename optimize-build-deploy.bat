@echo off
echo Otimizando, construindo e preparando para deploy...

echo 1. Navegando para o diretório correto...
cd /d c:\Users\Leorecoa\meu-mundo-em-simbolos\meu-mundo-em-simbolos

echo 2. Instalando dependências de otimização...
call npm install --save-dev vite-plugin-compression vite-plugin-pwa terser

echo 3. Limpando cache...
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache
if exist "dist" rmdir /s /q dist

echo 4. Construindo o projeto otimizado...
call npm run build

echo 5. Criando arquivo ZIP para deploy...
powershell Compress-Archive -Path dist\* -DestinationPath dist.zip -Force

echo Processo concluído!
echo O aplicativo foi otimizado, construído e está pronto para deploy.
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