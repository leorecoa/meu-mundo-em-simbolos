import Dexie, { Table } from 'dexie';

// --- Interfaces de Dados ---

export interface Category {
  id?: number;
  key: string;
  name: string;
  color: string;
}

export interface Symbol {
  id?: number;
  text: string;
  categoryKey: string;
  image?: Blob; // Novo campo para armazenar a imagem como um Blob
}

// --- Definição do Banco de Dados ---

export class MySubClassedDexie extends Dexie {
  categories!: Table<Category>; 
  symbols!: Table<Symbol>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    
    // Incrementamos a versão para adicionar o campo de imagem
    this.version(3).stores({
      categories: '++id, &key, name, color',
      symbols: '++id, text, categoryKey, image' // Adicionado o campo image
    });

    this.version(2).stores({
      categories: '++id, &key, name, color',
      symbols: '++id, text, categoryKey'
    });
    
    this.version(1).stores({
      categories: '++id, &key, name',
      symbols: '++id, text, categoryKey'
    });

    this.on('populate', () => this.populate());
  }

  async populate() {
    const defaultCategories: Category[] = [
      { key: 'quero', name: 'Quero', color: 'rose' },
      { key: 'sinto', name: 'Sinto', color: 'amber' },
      { key: 'preciso', name: 'Preciso', color: 'sky' },
      { key: 'geral', name: 'Geral', color: 'slate' },
    ];
    await db.categories.bulkAdd(defaultCategories);

    // Os símbolos padrão não têm imagens, demonstrando a retrocompatibilidade
    const defaultSymbols: Symbol[] = [
      { text: 'Eu', categoryKey: 'geral' },
      { text: 'Comer', categoryKey: 'quero' },
      { text: 'Beber', categoryKey: 'quero' },
      { text: 'Brincar', categoryKey: 'quero' },
      { text: 'Ir ao banheiro', categoryKey: 'preciso' },
      { text: 'Sim', categoryKey: 'geral' },
      { text: 'Não', categoryKey: 'geral' },
      { text: 'Por favor', categoryKey: 'geral' },
      { text: 'Obrigado', categoryKey: 'geral' },
      { text: 'Água', categoryKey: 'geral' },
      { text: 'Feliz', categoryKey: 'sinto' },
      { text: 'Triste', categoryKey: 'sinto' },
      { text: 'Com raiva', categoryKey: 'sinto' },
      { text: 'Ajuda', categoryKey: 'preciso' },
    ];
    await db.symbols.bulkAdd(defaultSymbols);
  }
}

export const db = new MySubClassedDexie();
