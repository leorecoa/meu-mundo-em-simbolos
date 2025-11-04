import Dexie, { type Table } from 'dexie';

// ... (Interfaces e Dados Iniciais)

export class MySubClassedDexie extends Dexie {
  // ... (Tabelas)

  constructor() {
    super('MeuMundoEmSimbolosDB');
    // Definição de Schema ÚNICA E FINAL.
    this.version(1).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order',
      userSettings: '++id, &profileId', // <<<<<< CORREÇÃO APLICADA AQUI
      coins: '&id',
      dailyGoals: '&id',
      achievements: '&id',
      rewards: '&id',
      security: '&id',
      usageEvents: '++id'
    });
  }

  // ... (Restante do código do db.ts)
}

export const db = new MySubClassedDexie();
