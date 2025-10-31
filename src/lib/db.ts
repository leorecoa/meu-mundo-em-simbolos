import Dexie, { Table } from 'dexie';

// --- Interfaces de Dados ---

export interface Category {
  id?: number;
  key: string;
  name: string;
  color: string; // Novo campo para a cor da categoria (ex: 'blue', 'red')
}

export interface Symbol {
  id?: number;
  text: string;
  categoryKey: string;
}

// --- Definição do Banco de Dados ---

export class MySubClassedDexie extends Dexie {
  categories!: Table<Category>; 
  symbols!: Table<Symbol>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    // Incrementamos a versão do DB para aplicar a nova estrutura
    this.version(2).stores({
      categories: '++id, &key, name, color',
      symbols: '++id, text, categoryKey' 
    }).upgrade(tx => {
      // A atualização é gerenciada pelo Dexie, mas podemos adicionar lógica aqui se necessário
    });
    
    // A versão antiga ainda é suportada para não quebrar usuários existentes
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
