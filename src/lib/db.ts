import Dexie, { Table } from 'dexie';

// --- Interfaces de Dados ---

export interface Profile {
  id?: number;
  name: string;
}

export interface Category {
  id?: number;
  profileId: number;
  key: string;
  name: string;
  color: string;
}

export interface Symbol {
  id?: number;
  profileId: number;
  text: string;
  categoryKey: string;
  image?: Blob;
  order: number; // Novo campo para a ordem de exibição
}

// --- Definição do Banco de Dados com Versão Atualizada ---

export class MySubClassedDexie extends Dexie {
  profiles!: Table<Profile>;
  categories!: Table<Category>; 
  symbols!: Table<Symbol>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    
    // Versão 5: Adiciona o campo 'order' aos símbolos
    this.version(5).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order' // Adicionado 'order'
    });

    // Mantém as versões anteriores para migração suave
    this.version(4).stores({ profiles: '++id, name', categories: '++id, profileId, &[profileId+key]', symbols: '++id, profileId, text, categoryKey, image' });
    this.version(3).stores({ categories: '++id, &key, name, color', symbols: '++id, text, categoryKey, image' });
    this.version(2).stores({ categories: '++id, &key, name, color', symbols: '++id, text, categoryKey' });
    this.version(1).stores({ categories: '++id, &key, name', symbols: '++id, text, categoryKey' });
  }

  async populateForProfile(profileId: number) {
    const defaultCategories: Omit<Category, 'id'>[] = [
      { profileId, key: 'quero', name: 'Quero', color: 'rose' },
      { profileId, key: 'sinto', name: 'Sinto', color: 'amber' },
      { profileId, key: 'preciso', name: 'Preciso', color: 'sky' },
      { profileId, key: 'geral', name: 'Geral', color: 'slate' },
    ];
    await db.categories.bulkAdd(defaultCategories as Category[]);

    const defaultSymbols: Omit<Symbol, 'id'>[] = [
      { profileId, text: 'Eu', categoryKey: 'geral', order: 1 },
      { profileId, text: 'Sim', categoryKey: 'geral', order: 2 },
      { profileId, text: 'Não', categoryKey: 'geral', order: 3 },
      { profileId, text: 'Por favor', categoryKey: 'geral', order: 4 },
      { profileId, text: 'Obrigado', categoryKey: 'geral', order: 5 },
      { profileId, text: 'Comer', categoryKey: 'quero', order: 6 },
      { profileId, text: 'Beber', categoryKey: 'quero', order: 7 },
      { profileId, text: 'Brincar', categoryKey: 'quero', order: 8 },
      { profileId, text: 'Ir ao banheiro', categoryKey: 'preciso', order: 9 },
      { profileId, text: 'Água', categoryKey: 'geral', order: 10 },
      { profileId, text: 'Feliz', categoryKey: 'sinto', order: 11 },
      { profileId, text: 'Triste', categoryKey: 'sinto', order: 12 },
      { profileId, text: 'Com raiva', categoryKey: 'sinto', order: 13 },
      { profileId, text: 'Ajuda', categoryKey: 'preciso', order: 14 },
    ];
    await db.symbols.bulkAdd(defaultSymbols as Symbol[]);
  }
}

export const db = new MySubClassedDexie();
