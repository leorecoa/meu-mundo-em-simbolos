import Dexie, { type Table } from 'dexie';

// ... (Interfaces e Dados Iniciais)

export class MySubClassedDexie extends Dexie {
  // ... (Tabelas)

  constructor() {
    super('MeuMundoEmSimbolosDB');
    this.version(12).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order',
      userSettings: '++id, &profileId',
      coins: '&id',
      dailyGoals: '&id',
      achievements: '&id',
      rewards: '&id',
      security: '&id',
      usageEvents: '++id, type, itemId, timestamp',
    });
  }

  async populateInitialData() { /* ... */ }

  async populateForProfile(profileId: number) {
    const defaultCategories = [ { key: 'pessoas', name: 'Pessoas', color: 'sky' }, { key: 'acoes', name: 'Ações', color: 'rose' }, { key: 'sentimentos', name: 'Sentimentos', color: 'amber' }, { key: 'lugares', name: 'Lugares', color: 'emerald' }, { key: 'comida', name: 'Comida', color: 'orange' }, { key: 'geral', name: 'Geral', color: 'slate' } ];
    const defaultSymbols = [ { text: 'Eu', categoryKey: 'pessoas', order: 1 }, { text: 'Você', categoryKey: 'pessoas', order: 2 }, { text: 'Mãe', categoryKey: 'pessoas', order: 3 }, { text: 'Pai', categoryKey: 'pessoas', order: 4 }, { text: 'Quero', categoryKey: 'acoes', order: 10 }, { text: 'Não quero', categoryKey: 'acoes', order: 11 }, { text: 'Feliz', categoryKey: 'sentimentos', order: 21 }, { text: 'Triste', categoryKey: 'sentimentos', order: 22 }, { text: 'Casa', categoryKey: 'lugares', order: 30 }, { text: 'Escola', categoryKey: 'lugares', order: 31 }, { text: 'Comer', categoryKey: 'comida', order: 40 }, { text: 'Beber', categoryKey: 'comida', order: 41 }, { text: 'Sim', categoryKey: 'geral', order: 50 }, { text: 'Não', categoryKey: 'geral', order: 51 } ];
    
    await this.transaction('rw', this.categories, this.symbols, this.userSettings, async () => {
      // Garante a criação de configurações para o perfil
      const settingsCount = await this.userSettings.where({ profileId }).count();
      if (settingsCount === 0) {
        await this.userSettings.add({ profileId, onboardingCompleted: false } as any);
      }
      // Garante a criação de categorias e símbolos padrão
      const catCount = await this.categories.where({ profileId }).count();
      if(catCount === 0) {
        const categoriesWithProfile = defaultCategories.map(c => ({...c, profileId}));
        await this.categories.bulkAdd(categoriesWithProfile as any);
        const symbolsWithProfile = defaultSymbols.map(s => ({...s, profileId}));
        await this.symbols.bulkAdd(symbolsWithProfile as any);
      }
    });
  }
}

export const db = new MySubClassedDexie();
