@echo off
echo Otimizando o aplicativo...

echo 1. Navegando para o diretório correto...
cd /d c:\Users\Leorecoa\meu-mundo-em-simbolos\meu-mundo-em-simbolos

echo 2. Removendo arquivos temporários e de cache...
if exist ".cache" rmdir /s /q .cache
if exist ".temp" rmdir /s /q .temp
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

echo 3. Otimizando configuração do Vite...
call npm install --save-dev vite-plugin-compression vite-plugin-pwa

echo 4. Reconstruindo o projeto...
call npm run build

echo 5. Verificando tamanho dos arquivos...
powershell "Get-ChildItem -Path dist -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10 | Format-Table Name, @{Name='Size (KB)';Expression={[math]::Round($_.Length/1KB, 2)}}"

echo Processo concluído!
echo O aplicativo foi otimizado e reconstruído.
pause