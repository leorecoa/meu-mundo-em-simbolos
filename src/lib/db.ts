import Dexie, { Table } from 'dexie';

// --- Interfaces de Dados ---

export interface Category {
  id?: number;
  key: string; // Ex: 'quero', 'sinto'
  name: string; // Ex: 'Quero', 'Sinto'
}

export interface Symbol {
  id?: number;
  text: string;
  categoryKey: string; // A que categoria este símbolo pertence
}

// --- Definição do Banco de Dados ---

export class MySubClassedDexie extends Dexie {
  categories!: Table<Category>; 
  symbols!: Table<Symbol>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    this.version(1).stores({
      categories: '++id, &key, name', // id auto-incrementado, key é única
      symbols: '++id, text, categoryKey' // id auto-incrementado
    });
    this.on('populate', () => this.populate()); // Hook para popular dados iniciais
  }

  async populate() {
    // Adiciona categorias padrão
    const defaultCategories: Category[] = [
      { key: 'quero', name: 'Quero' },
      { key: 'sinto', name: 'Sinto' },
      { key: 'preciso', name: 'Preciso' },
      { key: 'geral', name: 'Geral' },
    ];
    await db.categories.bulkAdd(defaultCategories);

    // Adiciona símbolos padrão
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
