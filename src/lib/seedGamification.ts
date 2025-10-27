import { db } from '@/db';

const defaultTasks = [
  { id: 'task_1', name: 'Primeira frase', completed: false },
  { id: 'task_2', name: 'Explorador de categorias', completed: false },
  { id: 'task_3', name: 'Comunicador frequente', completed: false },
];

const defaultAchievements = [
  { id: 'achievement_first_phrase', name: 'Primeira Comunicação', unlocked: false },
  { id: 'achievement_10_phrases', name: 'Comunicador Iniciante', unlocked: false },
  { id: 'achievement_all_categories', name: 'Explorador Completo', unlocked: false },
];

export async function seedGamification() {
  try {
    const taskCount = await db.tasks.count();
    if (taskCount === 0) {
      console.log('Populando tarefas...');
      await db.tasks.bulkAdd(defaultTasks);
    }

    const achievementCount = await db.achievements.count();
    if (achievementCount === 0) {
      console.log('Populando conquistas...');
      await db.achievements.bulkAdd(defaultAchievements);
    }

    const coinCount = await db.coins.count();
    if (coinCount === 0) {
      console.log('Inicializando moedas...');
      await db.coins.add({ id: 1, total: 0 });
    }
  } catch (error) {
    console.error('Erro ao popular gamificação:', error);
  }
}
