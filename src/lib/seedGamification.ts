import { db } from '@/db';

const defaultAchievements = [
  { id: 'achievement_first_phrase', name: 'Primeira Comunicação', description: 'Crie sua primeira frase', unlocked: false, reward: 15 },
  { id: 'achievement_10_phrases', name: 'Comunicador Iniciante', description: 'Crie 10 frases', unlocked: false, reward: 25 },
  { id: 'achievement_custom_symbol', name: 'Mundo Personalizado', description: 'Crie seu primeiro símbolo', unlocked: false, reward: 30 },
];

const defaultGoals = [
  { id: 'goal_phrases', name: 'Crie 3 frases', target: 3, current: 0, completed: false, reward: 10, lastUpdated: '' },
  { id: 'goal_symbols', name: 'Use 10 símbolos', target: 10, current: 0, completed: false, reward: 15, lastUpdated: '' },
  { id: 'goal_categories', name: 'Explore 2 categorias', target: 2, current: 0, completed: false, reward: 5, lastUpdated: '' },
];

export async function seedGamification() {
  try {
    const achievementCount = await db.achievements.count();
    if (achievementCount === 0) {
      console.log('Populando conquistas...');
      await db.achievements.bulkAdd(defaultAchievements);
    }

    const goalCount = await db.dailyGoals.count();
    if (goalCount === 0) {
      console.log('Populando metas diárias...');
      const today = new Date().toISOString().split('T')[0];
      const goalsToSeed = defaultGoals.map(g => ({ ...g, lastUpdated: today }));
      await db.dailyGoals.bulkAdd(goalsToSeed);
    }

    const coinCount = await db.coins.count();
    if (coinCount === 0) {
      console.log('Inicializando moedas...');
      await db.coins.add({ id: 1, total: 100 });
    }
    
    const pinCount = await db.security.count();
    if (pinCount === 0) {
        console.log('Inicializando PIN padrão...');
        await db.security.add({ id: 1, pin: '1234' });
    }

  } catch (error) {
    console.error('Erro ao popular dados de gamificação:', error);
  }
}
