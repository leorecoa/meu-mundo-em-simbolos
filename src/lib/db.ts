import Dexie, { type Table } from 'dexie';

// --- INTERFACES ---
export interface Profile { id?: number; name: string; }
export interface Category { id?: number; profileId: number; key: string; name: string; color: string; }
export interface Symbol { id?: number; profileId: number; text: string; categoryKey: string; image?: Blob; order: number; }
export interface UserSettings { id?: number; profileId: number; onboardingCompleted: boolean; }
export interface Coin { id: number; total: number; }
export interface DailyGoal { id: string; name: string; target: number; current: number; completed: boolean; reward: number; lastUpdated: string; }
export interface Achievement { id: string; name: string; description: string; unlocked: boolean; reward: number; }
export interface Reward { id: string; name: string; description: string; cost: number; type: 'symbol_pack'; purchased: boolean; }
export interface Security { id: number; pin: string; }

// --- DADOS INICIAIS ---
const defaultAchievements = [/* ... */];
const defaultGoals = [/* ... */];
const defaultRewards: Reward[] = [
    { id: 'pack_animals', name: 'Pacote: Animais', description: 'Desbloqueie 10 símbolos de animais.', cost: 150, type: 'symbol_pack', purchased: false },
    { id: 'pack_toys', name: 'Pacote: Brinquedos', description: 'Desbloqueie 10 símbolos de brinquedos.', cost: 200, type: 'symbol_pack', purchased: false },
    { id: 'pack_vehicles', name: 'Pacote: Veículos', description: 'Desbloqueie 10 símbolos de veículos.', cost: 250, type: 'symbol_pack', purchased: false },
    { id: 'pack_clothing', name: 'Pacote: Roupas', description: 'Desbloqueie 10 símbolos de roupas.', cost: 180, type: 'symbol_pack', purchased: false },
    { id: 'pack_weather', name: 'Pacote: Clima', description: 'Desbloqueie 5 símbolos sobre o tempo.', cost: 120, type: 'symbol_pack', purchased: false },
];

export class MySubClassedDexie extends Dexie {
    // ... (tabelas)
    constructor() {
        super('MeuMundoEmSimbolosDB');
        this.version(1).stores({
            profiles: '++id', categories: '++id, profileId, &[profileId+key]', symbols: '++id, profileId, categoryKey',
            userSettings: '++id, &profileId', coins: '&id', dailyGoals: '&id', achievements: '&id', rewards: '&id', security: '&id'
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
        const defaultCategories = [ { key: 'pessoas', name: 'Pessoas', color: 'sky' }, { key: 'acoes', name: 'Ações', color: 'rose' }, { key: 'sentimentos', name: 'Sentimentos', color: 'amber' }, { key: 'lugares', name: 'Lugares', color: 'emerald' }, { key: 'comida', name: 'Comida', color: 'orange' }, { key: 'geral', name: 'Geral', color: 'slate' } ];
        const defaultSymbols = [
            // Pessoas
            { text: 'Eu', categoryKey: 'pessoas', order: 1 }, { text: 'Você', categoryKey: 'pessoas', order: 2 }, { text: 'Mãe', categoryKey: 'pessoas', order: 3 }, { text: 'Pai', categoryKey: 'pessoas', order: 4 }, { text: 'Amigo', categoryKey: 'pessoas', order: 5 }, { text: 'Amiga', categoryKey: 'pessoas', order: 6 }, { text: 'Doutor', categoryKey: 'pessoas', order: 7 },
            // Ações
            { text: 'Quero', categoryKey: 'acoes', order: 10 }, { text: 'Não quero', categoryKey: 'acoes', order: 11 }, { text: 'Gosto', categoryKey: 'acoes', order: 12 }, { text: 'Não gosto', categoryKey: 'acoes', order: 13 }, { text: 'Ir', categoryKey: 'acoes', order: 14 }, { text: 'Brincar', categoryKey: 'acoes', order: 15 }, { text: 'Ajudar', categoryKey: 'acoes', order: 16 },
            // Sentimentos
            { text: 'Feliz', categoryKey: 'sentimentos', order: 20 }, { text: 'Triste', categoryKey: 'sentimentos', order: 21 }, { text: 'Com raiva', categoryKey: 'sentimentos', order: 22 }, { text: 'Com medo', categoryKey: 'sentimentos', order: 23 }, { text: 'Cansado', categoryKey: 'sentimentos', order: 24 },
            // Lugares
            { text: 'Casa', categoryKey: 'lugares', order: 30 }, { text: 'Escola', categoryKey: 'lugares', order: 31 }, { text: 'Parque', categoryKey: 'lugares', order: 32 }, { text: 'Banheiro', categoryKey: 'lugares', order: 33 },
            // Comida
            { text: 'Comer', categoryKey: 'comida', order: 40 }, { text: 'Beber', categoryKey: 'comida', order: 41 }, { text: 'Água', categoryKey: 'comida', order: 42 }, { text: 'Leite', categoryKey: 'comida', order: 43 }, { text: 'Pão', categoryKey: 'comida', order: 44 }, { text: 'Maçã', categoryKey: 'comida', order: 45 },
            // Geral
            { text: 'Sim', categoryKey: 'geral', order: 50 }, { text: 'Não', categoryKey: 'geral', order: 51 }, { text: 'Por favor', categoryKey: 'geral', order: 52 }, { text: 'Obrigado', categoryKey: 'geral', order: 53 }, { text: 'Oi', categoryKey: 'geral', order: 54 }, { text: 'Tchau', categoryKey: 'geral', order: 55 }
        ];
        
        await this.transaction('rw', [this.categories, this.symbols, this.userSettings], async () => {
            if ((await this.userSettings.where({ profileId }).count()) === 0) {
                await this.userSettings.add({ profileId, onboardingCompleted: false });
            }
            if ((await this.categories.where({ profileId }).count()) === 0) {
                await this.categories.bulkAdd(defaultCategories.map(c => ({...c, profileId})));
                await this.symbols.bulkAdd(defaultSymbols.map(s => ({...s, profileId})));
            }
        });
    }
}

export const db = new MySubClassedDexie();
