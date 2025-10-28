import Dexie, { type Table } from 'dexie';

export interface Category { id?: number; key: string; name: string; }
export interface Symbol { id?: number; name: string; imageUrl: string; categoryId: number; isCustom: boolean; }
export interface UserSettings { id?: number; voiceType: 'feminina' | 'masculina' | 'infantil'; voiceSpeed: number; largeIcons: boolean; useAudioFeedback: boolean; theme: string; language: string; }
export interface Phrase { id?: number; text: string; symbols: { id: string; text: string }[]; timestamp: number; isFavorite: boolean; }
export interface Coin { id?: number; total: number; }
export interface DailyGoal { id: string; name: string; target: number; current: number; completed: boolean; reward: number; lastUpdated: string; }
export interface Achievement { id: string; name: string; description: string; unlocked: boolean; reward: number; }
export interface PurchasedReward { id: string; }
export interface Security { id?: number; pin: string; }

export class MySubClassedDexie extends Dexie {
  categories!: Table<Category>;
  symbols!: Table<Symbol>;
  userSettings!: Table<UserSettings>;
  phrases!: Table<Phrase>;
  coins!: Table<Coin>;
  dailyGoals!: Table<DailyGoal>;
  achievements!: Table<Achievement>;
  purchasedRewards!: Table<PurchasedReward>;
  security!: Table<Security>;

  constructor() {
    super('meuMundoEmSimbolosDB');
    this.version(7).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId, isCustom',
      userSettings: 'id',
      phrases: '++id, timestamp, isFavorite',
      coins: 'id',
      dailyGoals: 'id',
      achievements: 'id',
      purchasedRewards: 'id',
      security: 'id',
    });
  }
}

export const db = new MySubClassedDexie();
