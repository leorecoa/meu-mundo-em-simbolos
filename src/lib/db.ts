import Dexie, { type Table } from 'dexie';

// --- Interfaces de Dados ---

export interface Profile { id?: number; name: string; }
export interface Category { id?: number; profileId: number; key: string; name: string; color: string; }
export interface Symbol { id?: number; profileId: number; text: string; categoryKey: string; image?: Blob; order: number; }
export interface UserSettings { 
  id?: number; 
  voiceType: string; 
  voiceSpeed: number; 
  largeIcons: boolean; 
  useAudioFeedback: boolean; 
  theme: string; 
  language: string; 
  onboardingCompleted: boolean; // Novo campo
}
export interface Phrase { id?: number; text: string; symbols: { id: string; text: string }[]; timestamp: number; isFavorite: boolean; }
export interface Coin { id?: number; total: number; }
export interface DailyGoal { id: string; name: string; target: number; current: number; completed: boolean; reward: number; lastUpdated: string; }
export interface Achievement { id: string; name: string; description: string; unlocked: boolean; reward: number; }
export interface Reward { id: string; name: string; description: string; cost: number; type: 'symbol_pack'; purchased: boolean; }
export interface PurchasedReward { id: string; }
export interface Security { id?: number; pin: string; }
export interface UsageEvent { id?: number; type: 'symbol_click' | 'phrase_created'; itemId: string; timestamp: number; }

// --- Definição do Banco de Dados ---

export class MySubClassedDexie extends Dexie {
  // ... (declarações de tabelas)

  constructor() {
    super('MeuMundoEmSimbolosDB');
    
    this.version(8).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order',
      userSettings: 'id, onboardingCompleted', // Campo indexado
      phrases: '++id, timestamp, isFavorite',
      coins: 'id',
      dailyGoals: 'id',
      achievements: 'id',
      rewards: '&id, type, purchased',
      purchasedRewards: 'id',
      security: 'id',
      usageEvents: '++id, type, itemId, timestamp',
    });

    // ... (versões anteriores)
  }

  async populateForProfile(profileId: number) {
    // ... (código)
  }
}

export const db = new MySubClassedDexie();
