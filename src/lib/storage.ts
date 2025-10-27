import { db } from '@/db';
import type { Category, Symbol, UserSettings, Coin, Task, Achievement } from '@/db';

// ===== Funções para Categorias =====

export const getCategories = async (): Promise<Category[]> => {
  try {
    return await db.categories.toArray();
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};

export const getCategoryWithSymbolsByKey = async (key: string): Promise<{ category: Category | null; symbols: Symbol[] }> => {
  try {
    const category = await db.categories.get({ key });
    if (category && category.id) {
      const symbols = await db.symbols.where('categoryId').equals(category.id).toArray();
      return { category, symbols };
    }
    return { category: null, symbols: [] };
  } catch (error) {
    console.error('Erro ao buscar categoria e símbolos por chave:', error);
    return { category: null, symbols: [] };
  }
};


// ===== Funções para Símbolos =====

export const getCustomSymbols = async (): Promise<Symbol[]> => {
  try {
    return await db.symbols.where('isCustom').equals(true).toArray();
  } catch (error) {
    console.error('Erro ao buscar símbolos personalizados:', error);
    return [];
  }
};

export const addCustomSymbol = async (name: string, imageUrl: string, categoryId: number): Promise<number | undefined> => {
  try {
    return await db.symbols.add({ name, imageUrl, categoryId, isCustom: true });
  } catch (error) {
    console.error('Erro ao adicionar símbolo personalizado:', error);
  }
};

export const deleteSymbol = async (id: number): Promise<void> => {
  try {
    await db.symbols.delete(id);
  } catch (error) {
    console.error('Erro ao deletar símbolo:', error);
  }
};

// ===== Funções para Configurações do Usuário =====

const defaultSettings: UserSettings = {
  id: 1,
  voiceType: 'feminina',
  voiceSpeed: 50,
  largeIcons: false,
  useAudioFeedback: true,
  theme: 'Padrão',
  language: 'pt-BR',
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const settings = await db.userSettings.get(1);
    if (settings) return settings;
    await db.userSettings.add(defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return defaultSettings;
  }
};

export const saveSettings = async (settings: Partial<UserSettings>): Promise<void> => {
  try {
    await db.userSettings.update(1, settings);
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  }
};

// ===== Funções de Gamificação =====

export const getCoins = async (): Promise<number> => {
  try {
    const coin = await db.coins.get(1);
    return coin ? coin.total : 0;
  } catch (error) {
    console.error('Erro ao buscar moedas:', error);
    return 0;
  }
};

export const updateCoins = async (amount: number): Promise<number> => {
  try {
    const currentCoins = await getCoins();
    const newTotal = Math.max(0, currentCoins + amount);
    await db.coins.put({ id: 1, total: newTotal });
    return newTotal;
  } catch (error) {
    console.error('Erro ao atualizar moedas:', error);
    return 0;
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    return await db.tasks.toArray();
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
};

export const updateTask = async (taskId: string, completed: boolean): Promise<void> => {
  try {
    await db.tasks.update(taskId, { completed });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
  }
};

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    return await db.achievements.toArray();
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return [];
  }
};

export const unlockAchievement = async (achievementId: string): Promise<void> => {
  try {
    await db.achievements.update(achievementId, { unlocked: true });
  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
  }
};
