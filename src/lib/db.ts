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
  order: number; // Campo para a ordem de exibição
}

// --- Definição do Banco de Dados ---

export class MySubClassedDexie extends Dexie {
  profiles!: Table<Profile>;
  categories!: Table<Category>; 
  symbols!: Table<Symbol>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    
    this.version(5).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order'
    });

    // Versões anteriores para migração
    this.version(4).stores({ profiles: '++id, name', categories: '++id, profileId, &[profileId+key]', symbols: '++id, profileId, text, categoryKey, image' });
    this.version(3).stores({ categories: '++id, &key, name, color', symbols: '++id, text, categoryKey, image' });
    this.version(2).stores({ categories: '++id, &key, name, color', symbols: '++id, text, categoryKey' });
    this.version(1).stores({ categories: '++id, &key, name', symbols: '++id, text, categoryKey' });
  }

  async populateForProfile(profileId: number) {
    const defaultCategories: Omit<Category, 'id'>[] = [
      { profileId, key: 'pessoas', name: 'Pessoas', color: 'sky' },
      { profileId, key: 'acoes', name: 'Ações', color: 'rose' },
      { profileId, key: 'sentimentos', name: 'Sentimentos', color: 'amber' },
      { profileId, key: 'lugares', name: 'Lugares', color: 'emerald' },
      { profileId, key: 'comida', name: 'Comida', color: 'orange' },
      { profileId, key: 'geral', name: 'Geral', color: 'slate' },
    ];
    await db.categories.bulkAdd(defaultCategories as Category[]);

    const defaultSymbols: Omit<Symbol, 'id'>[] = [
      // Pessoas
      { profileId, text: 'Eu', categoryKey: 'pessoas', order: 1 },
      { profileId, text: 'Você', categoryKey: 'pessoas', order: 2 },
      { profileId, text: 'Mãe', categoryKey: 'pessoas', order: 3 },
      { profileId, text: 'Pai', categoryKey: 'pessoas', order: 4 },
      { profileId, text: 'Amigo(a)', categoryKey: 'pessoas', order: 5 },
      { profileId, text: 'Doutor(a)', categoryKey: 'pessoas', order: 6 },
      { profileId, text: 'Professor(a)', categoryKey: 'pessoas', order: 7 },

      // Ações
      { profileId, text: 'Quero', categoryKey: 'acoes', order: 10 },
      { profileId, text: 'Não quero', categoryKey: 'acoes', order: 11 },
      { profileId, text: 'Gosto', categoryKey: 'acoes', order: 12 },
      { profileId, text: 'Não gosto', categoryKey: 'acoes', order: 13 },
      { profileId, text: 'Preciso', categoryKey: 'acoes', order: 14 },
      { profileId, text: 'Ir', categoryKey: 'acoes', order: 15 },
      { profileId, text: 'Brincar', categoryKey: 'acoes', order: 16 },
      { profileId, text: 'Ajudar', categoryKey: 'acoes', order: 17 },
      { profileId, text: 'Fazer', categoryKey: 'acoes', order: 18 },
      { profileId, text: 'Ouvir música', categoryKey: 'acoes', order: 19 },
      { profileId, text: 'Assistir TV', categoryKey: 'acoes', order: 20 },

      // Sentimentos
      { profileId, text: 'Feliz', categoryKey: 'sentimentos', order: 21 },
      { profileId, text: 'Triste', categoryKey: 'sentimentos', order: 22 },
      { profileId, text: 'Com raiva', categoryKey: 'sentimentos', order: 23 },
      { profileId, text: 'Com medo', categoryKey: 'sentimentos', order: 24 },
      { profileId, text: 'Cansado(a)', categoryKey: 'sentimentos', order: 25 },
      { profileId, text: 'Animado(a)', categoryKey: 'sentimentos', order: 26 },

      // Lugares
      { profileId, text: 'Casa', categoryKey: 'lugares', order: 30 },
      { profileId, text: 'Escola', categoryKey: 'lugares', order: 31 },
      { profileId, text: 'Parque', categoryKey: 'lugares', order: 32 },
      { profileId, text: 'Banheiro', categoryKey: 'lugares', order: 33 },
      { profileId, text: 'Loja', categoryKey: 'lugares', order: 34 },

      // Comida
      { profileId, text: 'Comer', categoryKey: 'comida', order: 40 },
      { profileId, text: 'Beber', categoryKey: 'comida', order: 41 },
      { profileId, text: 'Estou com fome', categoryKey: 'comida', order: 42 },
      { profileId, text: 'Estou com sede', categoryKey: 'comida', order: 43 },
      { profileId, text: 'Água', categoryKey: 'comida', order: 44 },
      { profileId, text: 'Maçã', categoryKey: 'comida', order: 45 },
      { profileId, text: 'Leite', categoryKey: 'comida', order: 46 },
      
      // Geral (respostas rápidas, etc)
      { profileId, text: 'Sim', categoryKey: 'geral', order: 50 },
      { profileId, text: 'Não', categoryKey: 'geral', order: 51 },
      { profileId, text: 'Por favor', categoryKey: 'geral', order: 52 },
      { profileId, text: 'Obrigado(a)', categoryKey: 'geral', order: 53 },
      { profileId, text: 'Bom dia', categoryKey: 'geral', order: 54 },
      { profileId, text: 'Boa tarde', categoryKey: 'geral', order: 55 },
      { profileId, text: 'Boa noite', categoryKey: 'geral', order: 56 },
      { profileId, text: 'Como você está?', categoryKey: 'geral', order: 57 },
      { profileId, text: 'Eu estou bem', categoryKey: 'geral', order: 58 },
    ];
    await db.symbols.bulkAdd(defaultSymbols as Symbol[]);
  }
}

export const db = new MySubClassedDexie();
