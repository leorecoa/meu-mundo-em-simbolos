import Dexie, { type Table } from 'dexie';
import type { Category, Symbol as DbSymbol, Reward } from './db';

// ... (interfaces de dados)

const defaultAchievements = [ /* ... */ ];
const defaultGoals = [ /* ... */ ];
const defaultRewards: Reward[] = [
  { id: 'pack_animals', name: 'Pacote: Animais', description: 'Desbloqueie 5 símbolos de animais.', cost: 150, type: 'symbol_pack', purchased: false },
  { id: 'pack_toys', name: 'Pacote: Brinquedos', description: 'Desbloqueie 5 símbolos de brinquedos.', cost: 200, type: 'symbol_pack', purchased: false },
  { id: 'pack_vehicles', name: 'Pacote: Veículos', description: 'Desbloqueie 5 símbolos de veículos.', cost: 250, type: 'symbol_pack', purchased: false },
];

export class MySubClassedDexie extends Dexie {
  // ... (declarações de tabelas)

  constructor() {
    super('MeuMundoEmSimbolosDB');
    // ... (definição de versões)
  }

  async populateInitialData() {
    await db.transaction('rw', this.achievements, this.dailyGoals, this.coins, this.security, this.rewards, async () => {
        if ((await this.achievements.count()) === 0) await this.achievements.bulkAdd(defaultAchievements as any);
        if ((await this.dailyGoals.count()) === 0) {
            const today = new Date().toISOString().split('T')[0];
            await this.dailyGoals.bulkAdd(defaultGoals.map(g => ({ ...g, lastUpdated: today })) as any);
        }
        if ((await this.coins.count()) === 0) await this.coins.add({ total: 100 } as any);
        if ((await this.security.count()) === 0) await this.security.add({ pin: '1234' } as any);
        if ((await this.rewards.count()) === 0) await this.rewards.bulkAdd(defaultRewards as any);
    });
  }

  async populateForProfile(profileId: number) {
    // ... (código que popula categorias e símbolos para um perfil)
  }
}

export const db = new MySubClassedDexie();
