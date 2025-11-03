import { db } from '@/lib/db';

// ... (outras definições)

const defaultRewards = [
  { id: 'pack_animals', name: 'Pacote: Animais', description: 'Desbloqueie 5 símbolos de animais.', cost: 150, type: 'symbol_pack', purchased: false },
  { id: 'pack_toys', name: 'Pacote: Brinquedos', description: 'Desbloqueie 5 símbolos de brinquedos.', cost: 200, type: 'symbol_pack', purchased: false },
  { id: 'pack_vehicles', name: 'Pacote: Veículos', description: 'Desbloqueie 5 símbolos de veículos.', cost: 250, type: 'symbol_pack', purchased: false },
];

export async function seedGamification() {
  try {
    // ... (código de popular outras tabelas)

    const rewardCount = await db.rewards.count();
    if (rewardCount === 0) {
      console.log('Populando recompensas...');
      await db.rewards.bulkAdd(defaultRewards);
    }

  } catch (error) {
    console.error('Erro ao popular dados de gamificação:', error);
  }
}
