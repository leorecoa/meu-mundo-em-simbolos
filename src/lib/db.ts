import Dexie, { Table } from 'dexie';

// --- Novas Interfaces com profileId ---

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
}

// --- Definição do Banco de Dados com Versão Atualizada ---

export class MySubClassedDexie extends Dexie {
  profiles!: Table<Profile>;
  categories!: Table<Category>; 
  symbols!: Table<Symbol>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    
    // Versão 4: Adiciona a tabela de perfis e o profileId
    this.version(4).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]', // Garante que a chave da categoria é única por perfil
      symbols: '++id, profileId, text, categoryKey'
    });

    // Mantém as versões anteriores para migração suave
    this.version(3).stores({ categories: '++id, &key, name, color', symbols: '++id, text, categoryKey, image' });
    this.version(2).stores({ categories: '++id, &key, name, color', symbols: '++id, text, categoryKey' });
    this.version(1).stores({ categories: '++id, &key, name', symbols: '++id, text, categoryKey' });
  }

  // Nova função para popular dados para um perfil específico
  async populateForProfile(profileId: number) {
    const defaultCategories: Omit<Category, 'id'>[] = [
      { profileId, key: 'quero', name: 'Quero', color: 'rose' },
      { profileId, key: 'sinto', name: 'Sinto', color: 'amber' },
      { profileId, key: 'preciso', name: 'Preciso', color: 'sky' },
      { profileId, key: 'geral', name: 'Geral', color: 'slate' },
    ];
    await db.categories.bulkAdd(defaultCategories as Category[]);

    const defaultSymbols: Omit<Symbol, 'id'>[] = [
      { profileId, text: 'Eu', categoryKey: 'geral' },
      { profileId, text: 'Comer', categoryKey: 'quero' },
      { profileId, text: 'Beber', categoryKey: 'quero' },
      { profileId, text: 'Brincar', categoryKey: 'quero' },
      { profileId, text: 'Ir ao banheiro', categoryKey: 'preciso' },
      { profileId, text: 'Sim', categoryKey: 'geral' },
      { profileId, text: 'Não', categoryKey: 'geral' },
      { profileId, text: 'Por favor', categoryKey: 'geral' },
      { profileId, text: 'Obrigado', categoryKey: 'geral' },
      { profileId, text: 'Água', categoryKey: 'geral' },
      { profileId, text: 'Feliz', categoryKey: 'sinto' },
      { profileId, text: 'Triste', categoryKey: 'sinto' },
      { profileId, text: 'Com raiva', categoryKey: 'sinto' },
      { profileId, text: 'Ajuda', categoryKey: 'preciso' },
    ];
    await db.symbols.bulkAdd(defaultSymbols as Symbol[]);
  }
}

export const db = new MySubClassedDexie();
