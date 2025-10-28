import { db } from '@/db';
import type { Category, Symbol, UserSettings, Phrase, Coin, DailyGoal, Achievement, PurchasedReward, Security } from '@/db';

// ... (outras funções mantidas) ...

// ===== Funções de Backup e Restauração =====

export const exportAllData = async (): Promise<string> => {
  try {
    const allData = {
      categories: await db.categories.toArray(),
      symbols: await db.symbols.toArray(),
      userSettings: await db.userSettings.toArray(),
      phrases: await db.phrases.toArray(),
      coins: await db.coins.toArray(),
      dailyGoals: await db.dailyGoals.toArray(),
      achievements: await db.achievements.toArray(),
      purchasedRewards: await db.purchasedRewards.toArray(),
      security: await db.security.toArray(),
    };
    return JSON.stringify(allData, null, 2); // O 2 formata o JSON para ser legível
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return '';
  }
};

export const importAllData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);

    await db.transaction('rw', ...db.tables, async () => {
      // Limpa todas as tabelas antes de importar
      for (const table of db.tables) {
        await table.clear();
      }

      // Repopula as tabelas com os dados do backup
      if (data.categories) await db.categories.bulkAdd(data.categories);
      if (data.symbols) await db.symbols.bulkAdd(data.symbols);
      if (data.userSettings) await db.userSettings.bulkAdd(data.userSettings);
      if (data.phrases) await db.phrases.bulkAdd(data.phrases);
      if (data.coins) await db.coins.bulkAdd(data.coins);
      if (data.dailyGoals) await db.dailyGoals.bulkAdd(data.dailyGoals);
      if (data.achievements) await db.achievements.bulkAdd(data.achievements);
      if (data.purchasedRewards) await db.purchasedRewards.bulkAdd(data.purchasedRewards);
      if (data.security) await db.security.bulkAdd(data.security);
    });

    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};

// Manter as outras funções exportadas para consistência...
// ... (código das outras funções permanece o mesmo)
export const getCategories = async (): Promise<Category[]> => db.categories.toArray();
export const getCategoryWithSymbolsByKey = async (key: string) => {
  const category = await db.categories.get({ key });
  if (category?.id) {
    const symbols = await db.symbols.where('categoryId').equals(category.id).toArray();
    return { category, symbols };
  }
  return { category: null, symbols: [] };
};
export const getCustomSymbols = async (): Promise<Symbol[]> => db.symbols.where('isCustom').equals(true).toArray();
export const addCustomSymbol = async (name: string, imageUrl: string, categoryId: number) => db.symbols.add({ name, imageUrl, categoryId, isCustom: true });
export const deleteSymbol = async (id: number) => db.symbols.delete(id);
export const getSettings = async (): Promise<UserSettings> => {
    const settings = await db.userSettings.get(1);
    if (settings) return settings;
    const defaultSettings: UserSettings = { id: 1, voiceType: 'feminina', voiceSpeed: 50, largeIcons: false, useAudioFeedback: true, theme: 'Padrão', language: 'pt-BR' };
    await db.userSettings.add(defaultSettings);
    return defaultSettings;
};
export const saveSettings = async (settings: Partial<UserSettings>) => db.userSettings.update(1, settings);
export const getPhrases = async (): Promise<Phrase[]> => db.phrases.orderBy('timestamp').reverse().toArray();
export const savePhrase = async (phraseData: Omit<Phrase, 'id'>) => db.phrases.add(phraseData as Phrase);
export const deletePhrase = async (id: number) => db.phrases.delete(id);
export const toggleFavoritePhrase = async (id: number) => {
    const phrase = await db.phrases.get(id);
    if (phrase) {
      await db.phrases.update(id, { isFavorite: !phrase.isFavorite });
    }
};
export const getCoins = async (): Promise<number> => {
  const coin = await db.coins.get(1);
  return coin ? coin.total : 0;
};
export const updateCoins = async (amount: number): Promise<number> => {
  const currentCoins = await getCoins();
  const newTotal = Math.max(0, currentCoins + amount);
  await db.coins.put({ id: 1, total: newTotal });
  return newTotal;
};
export const getDailyGoals = async (): Promise<DailyGoal[]> => {
  const today = new Date().toISOString().split('T')[0];
  let goals = await db.dailyGoals.toArray();
  if (goals.length === 0 || goals[0].lastUpdated !== today) {
    const defaultGoals: Omit<DailyGoal, 'current' | 'completed' | 'lastUpdated'>[] = [
      { id: 'goal_phrases', name: 'Crie 3 frases', target: 3, reward: 10 },
      { id: 'goal_symbols', name: 'Use 10 símbolos', target: 10, reward: 15 },
    ];
    const newGoals = defaultGoals.map(g => ({ ...g, current: 0, completed: false, lastUpdated: today }));
    await db.dailyGoals.clear();
    await db.dailyGoals.bulkAdd(newGoals);
    return newGoals;
  }
  return goals;
};
export const updateGoalProgress = async (goalId: string, amount: number) => {
  const goal = await db.dailyGoals.get(goalId);
  if (goal && !goal.completed) {
    const newCurrent = goal.current + amount;
    if (newCurrent >= goal.target) {
      await db.dailyGoals.update(goalId, { current: goal.target, completed: true });
      await updateCoins(goal.reward);
    } else {
      await db.dailyGoals.update(goalId, { current: newCurrent });
    }
  }
};
export const getAchievements = async (): Promise<Achievement[]> => db.achievements.toArray();
export const unlockAchievement = async (achievementId: string) => {
  const ach = await db.achievements.get(achievementId);
  if (ach && !ach.unlocked) {
    await db.achievements.update(achievementId, { unlocked: true });
    await updateCoins(ach.reward);
  }
};
export const getPurchasedRewards = async (): Promise<PurchasedReward[]> => db.purchasedRewards.toArray();
export const purchaseReward = async (rewardId: string, cost: number) => {
  const currentCoins = await getCoins();
  if (currentCoins >= cost) {
    await updateCoins(-cost);
    await db.purchasedRewards.add({ id: rewardId });
    return true;
  }
  return false;
};
export const getPin = async (): Promise<string> => {
  try {
    const security = await db.security.get(1);
    if (security) return security.pin;
    const defaultPin = '1234';
    await db.security.add({ id: 1, pin: defaultPin });
    return defaultPin;
  } catch (error) {
    console.error('Erro ao buscar PIN:', error);
    return '1234';
  }
};
export const setPin = async (newPin: string): Promise<void> => {
  try {
    await db.security.put({ id: 1, pin: newPin });
  } catch (error) {
    console.error('Erro ao salvar PIN:', error);
  }
};
