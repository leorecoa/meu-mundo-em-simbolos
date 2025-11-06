import Dexie, { type Table } from 'dexie';

// --- INTERFACES ---
export interface Profile { id?: number; name: string; }
export interface Category { id?: number; profileId: number; key: string; name: string; color: string; }
export interface Symbol { id?: number; profileId: number; text: string; categoryKey: string; image?: Blob; order: number; }
export interface UserSettings {
  id?: number;
  profileId: number;
  onboardingCompleted: boolean;
  voiceType?: string;
  voiceSpeed?: number;
  theme?: string;
  language?: string;
}
export interface Coins { id: number; total: number; }
export interface DailyGoal { id: string; name: string; target: number; current: number; completed: boolean; reward: number; lastUpdated: string; }
export interface Achievement { id: string; name: string; description: string; unlocked: boolean; reward: number; }
export interface Reward { id: string; name: string; description: string; cost: number; type: 'symbol_pack'; purchased: boolean; }
export interface Security { id: number; pin: string; }
export interface UsageEvent {
  id?: number;
  profileId: number;
  type: 'symbol_used' | 'phrase_created' | 'category_accessed';
  itemId?: string;
  symbolId?: number;
  categoryKey?: string;
  timestamp: number;
}

// --- DADOS INICIAIS ---
const defaultAchievements: Achievement[] = [
    { id: 'first_symbol', name: 'Primeiro Símbolo', description: 'Use seu primeiro símbolo', unlocked: false, reward: 10 },
    { id: 'ten_phrases', name: '10 Frases', description: 'Crie 10 frases', unlocked: false, reward: 50 },
    { id: 'daily_streak_7', name: '7 Dias Seguidos', description: 'Use o app por 7 dias consecutivos', unlocked: false, reward: 100 }
];

const defaultGoals: DailyGoal[] = [
    { id: 'daily_5_symbols', name: 'Usar 5 símbolos', target: 5, current: 0, completed: false, reward: 20, lastUpdated: new Date().toISOString() },
    { id: 'daily_3_phrases', name: 'Criar 3 frases', target: 3, current: 0, completed: false, reward: 30, lastUpdated: new Date().toISOString() }
];
const defaultRewards: Reward[] = [
    { id: 'pack_animals', name: 'Pacote: Animais', description: 'Desbloqueie 10 símbolos de animais.', cost: 150, type: 'symbol_pack', purchased: false },
    { id: 'pack_toys', name: 'Pacote: Brinquedos', description: 'Desbloqueie 10 símbolos de brinquedos.', cost: 200, type: 'symbol_pack', purchased: false },
    { id: 'pack_vehicles', name: 'Pacote: Veículos', description: 'Desbloqueie 10 símbolos de veículos.', cost: 250, type: 'symbol_pack', purchased: false },
    { id: 'pack_clothing', name: 'Pacote: Roupas', description: 'Desbloqueie 10 símbolos de roupas.', cost: 180, type: 'symbol_pack', purchased: false },
    { id: 'pack_weather', name: 'Pacote: Clima', description: 'Desbloqueie 5 símbolos sobre o tempo.', cost: 120, type: 'symbol_pack', purchased: false },
];

export class MySubClassedDexie extends Dexie {
    // Declaração explícita de todas as tabelas
    profiles!: Table<Profile>;
    categories!: Table<Category>;
    symbols!: Table<Symbol>;
    userSettings!: Table<UserSettings>;
    coins!: Table<Coins>;
    dailyGoals!: Table<DailyGoal>;
    achievements!: Table<Achievement>;
    rewards!: Table<Reward>;
    security!: Table<Security>;
    usageEvents!: Table<UsageEvent>;

    constructor() {
        super('MeuMundoEmSimbolosDB');
        this.version(12).stores({
            profiles: '++id, name',
            categories: '++id, profileId, key, &[profileId+key]',
            symbols: '++id, profileId, categoryKey, text, order',
            userSettings: '++id, &profileId',
            coins: '&id',
            dailyGoals: '&id, name, completed',
            achievements: '&id, unlocked',
            rewards: '&id, purchased, type',
            security: '&id',
            usageEvents: '++id, profileId, type, timestamp'
        });
    }

    async populateInitialData() {
        await this.transaction('rw', [this.achievements, this.dailyGoals, this.coins, this.security, this.rewards], async () => {
            if ((await this.coins.count()) === 0) await this.coins.put({ id: 1, total: 100 });
            if ((await this.security.count()) === 0) await this.security.put({ id: 1, pin: '1234' });
            if ((await this.achievements.count()) === 0) await this.achievements.bulkAdd(defaultAchievements as any);
            if ((await this.dailyGoals.count()) === 0) await this.dailyGoals.bulkAdd(defaultGoals.map(g => ({ ...g, lastUpdated: new Date().toISOString().split('T')[0] })) as any);
            if ((await this.rewards.count()) === 0) await this.rewards.bulkAdd(defaultRewards as any);
        });
    }

    async populateForProfile(profileId: number) {
        // 1. Adicionar UserSettings padrão
        const settingsCount = await this.userSettings.where({ profileId }).count();
        if (settingsCount === 0) {
            await this.userSettings.add({
                profileId,
                onboardingCompleted: false,
                voiceType: 'feminina',
                voiceSpeed: 1,
                theme: 'light',
                language: 'pt-BR'
            });
        }
        
        // 2. Popular categorias e símbolos usando seedDatabase
        const categoryCount = await this.categories.where({ profileId }).count();
        if (categoryCount === 0) {
            const { seedDatabase } = await import('./seedDatabase');
            await seedDatabase(profileId);
        }
    }
}

export const db = new MySubClassedDexie();
