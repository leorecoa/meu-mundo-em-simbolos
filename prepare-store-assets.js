// Script para preparar assets para a Google Play Store
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar diretório para assets da loja se não existir
const storeAssetsDir = path.join(__dirname, 'store-assets');
if (!fs.existsSync(storeAssetsDir)) {
  fs.mkdirSync(storeAssetsDir);
  console.log('✅ Diretório store-assets criado');
}

// Criar arquivo de metadados para a loja
const storeMetadata = {
  appName: 'Meu Mundo em Símbolos',
  shortDescription: 'Tecnologia inclusiva para comunicação alternativa.',
  fullDescription: `Meu Mundo em Símbolos é um aplicativo de comunicação alternativa e aumentativa (CAA) que ajuda pessoas com dificuldades de comunicação a se expressarem através de símbolos e frases.

Recursos principais:
- Construtor de frases intuitivo
- Síntese de voz em português
- Categorias de palavras organizadas
- Frases rápidas personalizáveis
- Interface amigável e acessível
- Modo de alto contraste para acessibilidade visual`,
  keywords: [
    'comunicação alternativa',
    'CAA',
    'acessibilidade',
    'inclusão',
    'síntese de voz',
    'educação especial'
  ],
  category: 'Educação',
  contentRating: 'Para todos',
  contactEmail: 'contato@meumundoemsimbolos.com.br'
};

// Salvar metadados em um arquivo JSON
fs.writeFileSync(
  path.join(storeAssetsDir, 'metadata.json'),
  JSON.stringify(storeMetadata, null, 2),
  'utf8'
);
console.log('✅ Arquivo de metadados criado');

// Criar arquivo com instruções para screenshots
const screenshotInstructions = `# Instruções para Screenshots da Google Play Store

## Tamanhos necessários:
- Phone: 1080 x 1920 pixels (16:9)
- 7-inch tablet: 1080 x 1920 pixels (16:9)
- 10-inch tablet: 1080 x 1920 pixels (16:9)

## Screenshots sugeridos:
1. Tela inicial com categorias
2. Construtor de frases em uso
3. Tela de configurações
4. Modo de alto contraste
5. Teclado virtual em uso
6. Frases salvas

## Dicas:
- Inclua texto explicativo em cada screenshot
- Destaque os recursos principais
- Use dispositivos reais ou mockups de alta qualidade
- Mantenha consistência visual entre as imagens`;

fs.writeFileSync(
  path.join(storeAssetsDir, 'screenshot-instructions.md'),
  screenshotInstructions,
  'utf8'
);
console.log('✅ Instruções para screenshots criadas');

console.log('\n🎉 Preparação de assets para a Google Play Store concluída!');
console.log('📁 Coloque seus screenshots e ícones na pasta store-assets');
console.log('🔗 Mais informações: https://developer.android.com/distribute/best-practices/launch/store-listing');