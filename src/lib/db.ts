import Dexie, { type Table } from 'dexie';

// --- INTERFACES DEFINITIVAS ---
export interface Profile { id?: number; name: string; }
export interface Category { id?: number; profileId: number; key: string; name: string; color: string; }
export interface Symbol { id?: number; profileId: number; text: string; categoryKey: string; image?: Blob; order: number; }
export interface UserSettings { id?: number; profileId: number; onboardingCompleted: boolean; voiceType?: string; voiceSpeed?: number; theme?: string; language?: string; }
export interface Coin { id: number; total: number; }
export interface DailyGoal { id: string; name: string; target: number; current: number; completed: boolean; reward: number; lastUpdated: string; }
export interface Achievement { id: string; name: string; description: string; unlocked: boolean; reward: number; }
export interface Reward { id: string; name: string; description: string; cost: number; type: 'symbol_pack'; purchased: boolean; }
export interface Security { id: number; pin: string; }
export interface UsageEvent { id?: number; type: string; itemId: string; timestamp: number; }

// --- DADOS INICIAIS GLOBAIS ---
const defaultAchievements = [{ id: 'achievement_first_phrase', name: 'Primeira Comunicação', description: 'Crie sua primeira frase', unlocked: false, reward: 15 }, { id: 'achievement_custom_symbol', name: 'Mundo Personalizado', description: 'Crie seu primeiro símbolo', unlocked: false, reward: 30 }];
const defaultGoals = [{ id: 'goal_phrases', name: 'Crie 3 frases', target: 3, current: 0, completed: false, reward: 10, lastUpdated: '' }, { id: 'goal_symbols', name: 'Use 10 símbolos', target: 10, current: 0, completed: false, reward: 15, lastUpdated: '' }, { id: 'goal_categories', name: 'Explore 2 categorias', target: 2, current: 0, completed: false, reward: 5, lastUpdated: '' }];
const defaultRewards: Reward[] = [{ id: 'pack_animals', name: 'Pacote: Animais', description: 'Desbloqueie 5 símbolos de animais.', cost: 150, type: 'symbol_pack', purchased: false }, { id: 'pack_toys', name: 'Pacote: Brinquedos', description: 'Desbloqueie 5 símbolos de brinquedos.', cost: 200, type: 'symbol_pack', purchased: false }, { id: 'pack_vehicles', name: 'Pacote: Veículos', description: 'Desbloqueie 5 símbolos de veículos.', cost: 250, type: 'symbol_pack', purchased: false }];

export class MySubClassedDexie extends Dexie {
  profiles!: Table<Profile>;
  categories!: Table<Category>;
  symbols!: Table<Symbol>;
  userSettings!: Table<UserSettings>;
  coins!: Table<Coin>;
  dailyGoals!: Table<DailyGoal>;
  achievements!: Table<Achievement>;
  rewards!: Table<Reward>;
  security!: Table<Security>;
  usageEvents!: Table<UsageEvent>;

  constructor() {
    super('MeuMundoEmSimbolosDB');
    // Incrementar a versão para aplicar a nova estrutura de índice
    this.version(10).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order',
      userSettings: '++id, &profileId, onboardingCompleted, voiceType, voiceSpeed, theme, language', // Corrigido: &profileId torna-o um índice único
      coins: '&id',
      dailyGoals: '&id',
      achievements: '&id',
      rewards: '&id',
      security: '&id',
      usageEvents: '++id, type, itemId, timestamp',
    });
    // Manter a versão anterior para a migração
    this.version(9).stores({
        profiles: '++id, name',
        categories: '++id, profileId, &[profileId+key]',
        symbols: '++id, profileId, text, categoryKey, order',
        userSettings: '++id, profileId, onboardingCompleted',
        coins: '&id',
        dailyGoals: '&id',
        achievements: '&id',
        rewards: '&id',
        security: '&id',
        usageEvents: '++id, type, itemId, timestamp',
      });
  }

  async populateInitialData() {
    await this.transaction('rw', this.achievements, this.dailyGoals, this.coins, this.security, this.rewards, async () => {
      if ((await this.coins.count()) === 0) await this.coins.put({ id: 1, total: 100 });
      if ((await this.security.count()) === 0) await this.security.put({ id: 1, pin: '1234' });
      if ((await this.achievements.count()) === 0) await this.achievements.bulkAdd(defaultAchievements as any);
      if ((await this.dailyGoals.count()) === 0) {
        const today = new Date().toISOString().split('T')[0];
        await this.dailyGoals.bulkAdd(defaultGoals.map(g => ({ ...g, lastUpdated: today })) as any);
      }
      if ((await this.rewards.count()) === 0) await this.rewards.bulkAdd(defaultRewards as any);
    });
  }

  async populateForProfile(profileId: number) {
    const defaultCategories = [ { key: 'pessoas', name: 'Pessoas', color: 'sky' }, { key: 'acoes', name: 'Ações', color: 'rose' }, { key: 'sentimentos', name: 'Sentimentos', color: 'amber' }, { key: 'lugares', name: 'Lugares', color: 'emerald' }, { key: 'comida', name: 'Comida', color: 'orange' }, { key: 'geral', name: 'Geral', color: 'slate' } ];
    const defaultSymbols = [ { text: 'Eu', categoryKey: 'pessoas', order: 1 }, { text: 'Você', categoryKey: 'pessoas', order: 2 }, { text: 'Mãe', categoryKey: 'pessoas', order: 3 }, { text: 'Pai', categoryKey: 'pessoas', order: 4 }, { text: 'Quero', categoryKey: 'acoes', order: 10 }, { text: 'Não quero', categoryKey: 'acoes', order: 11 }, { text: 'Feliz', categoryKey: 'sentimentos', order: 21 }, { text: 'Triste', categoryKey: 'sentimentos', order: 22 }, { text: 'Casa', categoryKey: 'lugares', order: 30 }, { text: 'Escola', categoryKey: 'lugares', order: 31 }, { text: 'Comer', categoryKey: 'comida', order: 40 }, { text: 'Beber', categoryKey: 'comida', order: 41 }, { text: 'Sim', categoryKey: 'geral', order: 50 }, { text: 'Não', categoryKey: 'geral', order: 51 } ];
    
    await this.transaction('rw', this.categories, this.symbols, this.userSettings, async () => {
      if ((await this.userSettings.where({ profileId }).count()) === 0) {
        await this.userSettings.add({ profileId, onboardingCompleted: false, voiceType: 'feminina', voiceSpeed: 50, theme: 'Padrão', language: 'pt-BR' } as any);
      }
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
