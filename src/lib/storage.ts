import { db } from '@/db';
import type { DailyGoal, Achievement } from '@/db';

// ... (outras funções) ...

export const updateGoalProgress = async (goalId: string, amount: number): Promise<DailyGoal | null> => {
  const goal = await db.dailyGoals.get(goalId);

  if (goal && !goal.completed) {
    const newCurrent = goal.current + amount;
    if (newCurrent >= goal.target) {
      await db.dailyGoals.update(goalId, { current: goal.target, completed: true });
      await updateCoins(goal.reward);
      return { ...goal, completed: true }; // Retorna a meta concluída
    } else {
      await db.dailyGoals.update(goalId, { current: newCurrent });
    }
  }
  return null; // Retorna nulo se nada foi concluído
};

export const unlockAchievement = async (achievementId: string): Promise<Achievement | null> => {
  const ach = await db.achievements.get(achievementId);
  if (ach && !ach.unlocked) {
    await db.achievements.update(achievementId, { unlocked: true });
    await updateCoins(ach.reward);
    return { ...ach, unlocked: true }; // Retorna a conquista desbloqueada
  }
  return null;
};

// Manter as outras funções exportadas para consistência...
// ... (código das outras funções permanece o mesmo)
