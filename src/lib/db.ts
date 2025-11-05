import Dexie, { type Table } from 'dexie';

// ===== INTERFACES COMPLETAS =====

export interface Profile {
  id?: number;
  name: string;
}

export interface Category {
  id?: number;
  profileId: number;
  key: string;
  name: string;
  color?: string; // ✅ ADICIONAR
}

export interface Symbol {
  id?: number;
  profileId: number;
  text: string;
  categoryKey: string;
  order: number;
  image?: Blob | string; // ✅ ADICIONAR
}

export interface UserSettings {
  id?: number;
  profileId: number;
  onboardingCompleted: boolean;
  voiceType?: string;
  voiceSpeed?: number;
  theme?: string;
  language?: string;
}

export interface Coins {
  id: number;
  count: number;
}

export interface DailyGoal {
  id: string;
  taskName: string;
  completed: boolean;
  rewardCoins: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'theme' | 'symbol_pack' | 'feature';
  purchased: boolean;
}

export interface Security {
  id: number;
  pin?: string;
}

export interface UsageEvent {
  id?: number;
  type: 'symbol_used' | 'phrase_created' | 'category_accessed';
  itemId: string;
  timestamp: number;
}

// ===== CLASSE DEXIE =====

export class MySubClassedDexie extends Dexie {
  profiles!: Table<Profile>;
  categories!: Table<Category>;
  symbols!: Table<Symbol>;
  userSettings!: Table<UserSettings>; // ✅ ADICIONAR
  coins!: Table<Coins>; // ✅ ADICIONAR
  dailyGoals!: Table<DailyGoal>; // ✅ ADICIONAR
  achievements!: Table<Achievement>; // ✅ ADICIONAR
  rewards!: Table<Reward>; // ✅ ADICIONAR
  security!: Table<Security>; // ✅ ADICIONAR
  usageEvents!: Table<UsageEvent>; // ✅ ADICIONAR

  constructor() {
    super('MeuMundoEmSimbolosDB');

    // Schema versão 11 (incrementar!)
    this.version(11).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order',
      userSettings: '++id, &profileId, onboardingCompleted, voiceType, voiceSpeed, theme, language',
      coins: '&id',
      dailyGoals: '&id',
      achievements: '&id',
      rewards: '&id',
      security: '&id',
      usageEvents: '++id, type, itemId, timestamp',
    });

    // Populate inicial
    this.on('populate', async () => {
      await this.transaction('rw', this.profiles, this.categories, this.symbols, this.userSettings, async () => {
        const defaultProfileId = await this.profiles.add({ name: 'Padrão' });

        await this.categories.bulkAdd([
          { profileId: defaultProfileId, key: 'pessoas', name: 'Pessoas', color: 'sky' },
          { profileId: defaultProfileId, key: 'acoes', name: 'Ações', color: 'rose' },
          { profileId: defaultProfileId, key: 'comida', name: 'Comida', color: 'amber' },
          { profileId: defaultProfileId, key: 'sentimentos', name: 'Sentimentos', color: 'emerald' },
          { profileId: defaultProfileId, key: 'lugares', name: 'Lugares', color: 'orange' },
          { profileId: defaultProfileId, key: 'tempo', name: 'Tempo', color: 'slate' },
        ]);

        await this.symbols.bulkAdd([
          { profileId: defaultProfileId, text: 'Eu', categoryKey: 'pessoas', order: 0 },
          { profileId: defaultProfileId, text: 'Você', categoryKey: 'pessoas', order: 1 },
          { profileId: defaultProfileId, text: 'Comer', categoryKey: 'acoes', order: 0 },
          { profileId: defaultProfileId, text: 'Beber', categoryKey: 'acoes', order: 1 },
          { profileId: defaultProfileId, text: 'Água', categoryKey: 'comida', order: 0 },
        ]);

        await this.userSettings.add({
          profileId: defaultProfileId,
          onboardingCompleted: false,
          voiceType: 'feminina',
          voiceSpeed: 1,
          theme: 'light',
          language: 'pt-BR',
        } as any);
      });
    });
  }

  // Método helper para popular um novo perfil
  async populateForProfile(profileId: number) {
    await this.userSettings.add({
      profileId,
      onboardingCompleted: false,
      voiceType: 'feminina',
      voiceSpeed: 1,
      theme: 'light',
      language: 'pt-BR',
    } as any);
  }
}

export const db = new MySubClassedDexie();
