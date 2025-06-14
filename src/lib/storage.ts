// Implementação de armazenamento local para o aplicativo
import { CategoryItem } from '@/data/categoryData';

// Tipos para armazenamento
export interface StoredPhrase {
  id: string;
  text: string;
  symbols: PhraseSymbol[];
  timestamp: number;
  isFavorite: boolean;
  category?: string;
  tags?: string[];
}

export interface PhraseSymbol {
  id: string;
  text: string;
  iconUrl?: string;
}

export interface UsageStats {
  symbolsUsed: Record<string, number>;
  phrasesCreated: number;
  lastUsed: number;
  totalTimeSpent: number;
  dailyGoalsCompleted: number;
  consecutiveDays: number;
  lastLoginDate: string;
}

export interface UserSettings {
  voiceType: 'feminina' | 'masculina' | 'infantil';
  voiceSpeed: number;
  iconSize: number;
  useAudioFeedback: boolean;
  theme: string;
  largeIcons: boolean;
}

export interface TaskProgress {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  dateCompleted?: string;
  reward: number;
  category?: string;
  difficulty?: 'fácil' | 'médio' | 'difícil';
  streak?: number; // Para tarefas que exigem repetição
}

export interface DailyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  completed: boolean;
  reward: number;
  streak?: number; // Dias consecutivos completando esta meta
  bonusReward?: number; // Recompensa extra por manter streak
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  dateUnlocked?: string;
  reward: number;
  progress?: {
    current: number;
    target: number;
  };
  icon?: string;
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  reward: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  dateIssued: string;
  dateCompleted?: string;
}

// Chaves para armazenamento
const STORAGE_KEYS = {
  PHRASES: 'mms-phrases',
  CUSTOM_SYMBOLS: 'mms-custom-symbols',
  SETTINGS: 'mms-settings',
  USAGE_STATS: 'mms-usage-stats',
  PIN: 'mms-pin',
  FAVORITES: 'mms-favorites',
  TASKS: 'mms-tasks',
  DAILY_GOALS: 'mms-daily-goals',
  COINS: 'mms-coins',
  REWARDS_PURCHASED: 'mms-rewards-purchased',
  ACHIEVEMENTS: 'mms-achievements',
  DAILY_CHALLENGES: 'mms-daily-challenges',
  STREAKS: 'mms-streaks',
  PHRASE_CATEGORIES: 'mms-phrase-categories',
  USER_LEVEL: 'mms-user-level'
};

// Funções de armazenamento
export const savePhrase = async (phrase: StoredPhrase): Promise<void> => {
  try {
    const phrases = getPhrases();
    phrases.push(phrase);
    localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(phrases));
    
    // Atualizar estatísticas
    updateSymbolUsageStats(phrase.symbols);
  } catch (error) {
    console.error('Erro ao salvar frase:', error);
    throw error;
  }
};

export const getPhrases = (): StoredPhrase[] => {
  try {
    const phrases = localStorage.getItem(STORAGE_KEYS.PHRASES);
    return phrases ? JSON.parse(phrases) : [];
  } catch (error) {
    console.error('Erro ao recuperar frases:', error);
    return [];
  }
};

export const deletePhrase = (id: string): void => {
  try {
    const phrases = getPhrases();
    const updatedPhrases = phrases.filter(phrase => phrase.id !== id);
    localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(updatedPhrases));
  } catch (error) {
    console.error('Erro ao excluir frase:', error);
  }
};

export const toggleFavoritePhrase = (id: string): boolean => {
  try {
    const phrases = getPhrases();
    const phraseIndex = phrases.findIndex(phrase => phrase.id === id);
    
    if (phraseIndex !== -1) {
      phrases[phraseIndex].isFavorite = !phrases[phraseIndex].isFavorite;
      localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(phrases));
      return phrases[phraseIndex].isFavorite;
    }
    return false;
  } catch (error) {
    console.error('Erro ao marcar frase como favorita:', error);
    return false;
  }
};

// Funções para símbolos personalizados
export const saveCustomSymbol = async (symbol: CategoryItem): Promise<void> => {
  try {
    const symbols = getCustomSymbols();
    symbols.push(symbol);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMBOLS, JSON.stringify(symbols));
  } catch (error) {
    console.error('Erro ao salvar símbolo personalizado:', error);
    throw error;
  }
};

export const getCustomSymbols = (): CategoryItem[] => {
  try {
    const symbols = localStorage.getItem(STORAGE_KEYS.CUSTOM_SYMBOLS);
    return symbols ? JSON.parse(symbols) : [];
  } catch (error) {
    console.error('Erro ao recuperar símbolos personalizados:', error);
    return [];
  }
};

export const deleteCustomSymbol = async (id: string): Promise<void> => {
  try {
    const symbols = getCustomSymbols();
    const updatedSymbols = symbols.filter(symbol => symbol.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMBOLS, JSON.stringify(updatedSymbols));
  } catch (error) {
    console.error('Erro ao excluir símbolo personalizado:', error);
    throw error;
  }
};

// Funções para configurações do usuário
export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  }
};

export const getSettings = (): UserSettings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      voiceType: 'feminina',
      voiceSpeed: 50,
      iconSize: 50,
      useAudioFeedback: true,
      theme: 'Padrão',
      largeIcons: false
    };
  } catch (error) {
    console.error('Erro ao recuperar configurações:', error);
    return {
      voiceType: 'feminina',
      voiceSpeed: 50,
      iconSize: 50,
      useAudioFeedback: true,
      theme: 'Padrão',
      largeIcons: false
    };
  }
};

// Funções para estatísticas de uso
export const getUsageStats = (): UsageStats => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.USAGE_STATS);
    return stats ? JSON.parse(stats) : {
      symbolsUsed: {},
      phrasesCreated: 0,
      lastUsed: Date.now(),
      totalTimeSpent: 0,
      dailyGoalsCompleted: 0,
      consecutiveDays: 0,
      lastLoginDate: new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Erro ao recuperar estatísticas de uso:', error);
    return {
      symbolsUsed: {},
      phrasesCreated: 0,
      lastUsed: Date.now(),
      totalTimeSpent: 0,
      dailyGoalsCompleted: 0,
      consecutiveDays: 0,
      lastLoginDate: new Date().toISOString().split('T')[0]
    };
  }
};

export const updateSymbolUsageStats = (symbols: PhraseSymbol[]): void => {
  try {
    const stats = getUsageStats();
    
    symbols.forEach(symbol => {
      if (stats.symbolsUsed[symbol.id]) {
        stats.symbolsUsed[symbol.id]++;
      } else {
        stats.symbolsUsed[symbol.id] = 1;
      }
    });
    
    stats.phrasesCreated++;
    stats.lastUsed = Date.now();
    
    localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
    
    // Verificar metas diárias
    checkDailyGoals('symbols_used', symbols.length);
  } catch (error) {
    console.error('Erro ao atualizar estatísticas de uso:', error);
  }
};

export const updateTimeSpent = (timeInSeconds: number): void => {
  try {
    const stats = getUsageStats();
    stats.totalTimeSpent += timeInSeconds;
    stats.lastUsed = Date.now();
    localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
    
    // Verificar metas diárias
    checkDailyGoals('time_spent', timeInSeconds);
  } catch (error) {
    console.error('Erro ao atualizar tempo de uso:', error);
  }
};

// Funções para PIN de acesso
export const setPin = (pin: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PIN, pin);
  } catch (error) {
    console.error('Erro ao definir PIN:', error);
  }
};

export const getPin = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PIN) || '1234'; // PIN padrão
  } catch (error) {
    console.error('Erro ao recuperar PIN:', error);
    return '1234'; // PIN padrão em caso de erro
  }
};

// Funções para o sistema de moedas
export const getCoins = (): number => {
  try {
    const coins = localStorage.getItem(STORAGE_KEYS.COINS);
    return coins ? parseInt(coins, 10) : 0;
  } catch (error) {
    console.error('Erro ao recuperar moedas:', error);
    return 0;
  }
};

export const updateCoins = (amount: number): number => {
  try {
    const currentCoins = getCoins();
    const newAmount = Math.max(0, currentCoins + amount); // Evita moedas negativas
    localStorage.setItem(STORAGE_KEYS.COINS, newAmount.toString());
    
    // Verificar se o usuário subiu de nível
    const oldLevel = Math.floor(currentCoins / 100) + 1;
    const newLevel = Math.floor(newAmount / 100) + 1;
    
    if (newLevel > oldLevel) {
      // Usuário subiu de nível - poderia disparar algum evento ou notificação
      console.log(`Usuário subiu para o nível ${newLevel}!`);
      
      // Bônus por subir de nível
      const levelUpBonus = newLevel * 10; // 10 moedas por nível
      const finalAmount = newAmount + levelUpBonus;
      localStorage.setItem(STORAGE_KEYS.COINS, finalAmount.toString());
      return finalAmount;
    }
    
    return newAmount;
  } catch (error) {
    console.error('Erro ao atualizar moedas:', error);
    return getCoins();
  }
};

// Funções para tarefas e metas diárias
export const getTasks = (): TaskProgress[] => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (tasks) {
      return JSON.parse(tasks);
    }
    
    // Tarefas padrão se não existirem
    const defaultTasks = [
      {
        id: 'task_1',
        name: 'Primeira frase',
        description: 'Crie sua primeira frase usando símbolos',
        completed: false,
        reward: 10,
        difficulty: 'fácil',
        category: 'iniciante'
      },
      {
        id: 'task_2',
        name: 'Explorador de categorias',
        description: 'Explore todas as categorias de símbolos',
        completed: false,
        reward: 15,
        difficulty: 'médio',
        category: 'exploração'
      },
      {
        id: 'task_3',
        name: 'Comunicador frequente',
        description: 'Use o app por 5 dias consecutivos',
        completed: false,
        reward: 25,
        difficulty: 'médio',
        category: 'engajamento',
        streak: 0
      },
      {
        id: 'task_4',
        name: 'Frases favoritas',
        description: 'Salve 3 frases como favoritas',
        completed: false,
        reward: 20,
        difficulty: 'fácil',
        category: 'organização'
      },
      {
        id: 'task_5',
        name: 'Personalização',
        description: 'Crie seu primeiro símbolo personalizado',
        completed: false,
        reward: 30,
        difficulty: 'médio',
        category: 'criatividade'
      },
      {
        id: 'task_6',
        name: 'Comunicação avançada',
        description: 'Crie uma frase com pelo menos 5 símbolos',
        completed: false,
        reward: 25,
        difficulty: 'difícil',
        category: 'comunicação'
      },
      {
        id: 'task_7',
        name: 'Compartilhamento',
        description: 'Compartilhe uma frase com alguém',
        completed: false,
        reward: 15,
        difficulty: 'fácil',
        category: 'social'
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks));
    return defaultTasks;
  } catch (error) {
    console.error('Erro ao recuperar tarefas:', error);
    return [];
  }
};

export const updateTaskProgress = (taskId: string, completed: boolean): void => {
  try {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      if (completed && !tasks[taskIndex].completed) {
        // Tarefa concluída pela primeira vez
        tasks[taskIndex].completed = true;
        tasks[taskIndex].dateCompleted = new Date().toISOString();
        
        // Adicionar recompensa
        updateCoins(tasks[taskIndex].reward);
      } else {
        tasks[taskIndex].completed = completed;
      }
      
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
  } catch (error) {
    console.error('Erro ao atualizar progresso da tarefa:', error);
  }
};

export const getDailyGoals = (): DailyGoal[] => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const storedGoals = localStorage.getItem(STORAGE_KEYS.DAILY_GOALS);
    let goals: DailyGoal[] = [];
    
    if (storedGoals) {
      const parsedGoals = JSON.parse(storedGoals);
      // Verificar se as metas são de hoje
      if (parsedGoals.date === today) {
        return parsedGoals.goals;
      }
    }
    
    // Recuperar streaks anteriores
    const previousStreaks: Record<string, number> = {};
    if (storedGoals) {
      const parsedGoals = JSON.parse(storedGoals);
      parsedGoals.goals.forEach((goal: DailyGoal) => {
        if (goal.completed && goal.streak) {
          previousStreaks[goal.id] = goal.streak;
        }
      });
    }
    
    // Criar novas metas diárias
    goals = [
      {
        id: 'daily_symbols',
        name: 'Usar 20 símbolos',
        target: 20,
        current: 0,
        completed: false,
        reward: 5,
        streak: previousStreaks['daily_symbols'] ? previousStreaks['daily_symbols'] + 1 : 0,
        bonusReward: previousStreaks['daily_symbols'] ? Math.min(5 * Math.floor(previousStreaks['daily_symbols'] / 3), 15) : 0
      },
      {
        id: 'daily_phrases',
        name: 'Criar 5 frases',
        target: 5,
        current: 0,
        completed: false,
        reward: 10,
        streak: previousStreaks['daily_phrases'] ? previousStreaks['daily_phrases'] + 1 : 0,
        bonusReward: previousStreaks['daily_phrases'] ? Math.min(5 * Math.floor(previousStreaks['daily_phrases'] / 3), 20) : 0
      },
      {
        id: 'daily_time',
        name: 'Usar o app por 10 minutos',
        target: 600, // em segundos
        current: 0,
        completed: false,
        reward: 15,
        streak: previousStreaks['daily_time'] ? previousStreaks['daily_time'] + 1 : 0,
        bonusReward: previousStreaks['daily_time'] ? Math.min(5 * Math.floor(previousStreaks['daily_time'] / 3), 25) : 0
      },
      {
        id: 'daily_favorites',
        name: 'Salvar 2 frases favoritas',
        target: 2,
        current: 0,
        completed: false,
        reward: 8,
        streak: previousStreaks['daily_favorites'] ? previousStreaks['daily_favorites'] + 1 : 0,
        bonusReward: previousStreaks['daily_favorites'] ? Math.min(4 * Math.floor(previousStreaks['daily_favorites'] / 3), 12) : 0
      },
      {
        id: 'daily_categories',
        name: 'Usar 3 categorias diferentes',
        target: 3,
        current: 0,
        completed: false,
        reward: 12,
        streak: previousStreaks['daily_categories'] ? previousStreaks['daily_categories'] + 1 : 0,
        bonusReward: previousStreaks['daily_categories'] ? Math.min(4 * Math.floor(previousStreaks['daily_categories'] / 3), 16) : 0
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify({
      date: today,
      goals
    }));
    
    // Verificar dias consecutivos
    checkConsecutiveDays();
    
    return goals;
  } catch (error) {
    console.error('Erro ao recuperar metas diárias:', error);
    return [];
  }
};

export const checkDailyGoals = (type: string, value: number): void => {
  try {
    const storedGoals = localStorage.getItem(STORAGE_KEYS.DAILY_GOALS);
    if (!storedGoals) {
      getDailyGoals(); // Inicializar metas se não existirem
      return;
    }
    
    const parsedData = JSON.parse(storedGoals);
    const goals = parsedData.goals;
    let updated = false;
    
    goals.forEach((goal: DailyGoal) => {
      if (goal.completed) return;
      
      if (
        (type === 'symbols_used' && goal.id === 'daily_symbols') ||
        (type === 'phrases_created' && goal.id === 'daily_phrases') ||
        (type === 'time_spent' && goal.id === 'daily_time') ||
        (type === 'favorites_added' && goal.id === 'daily_favorites') ||
        (type === 'categories_used' && goal.id === 'daily_categories')
      ) {
        goal.current += value;
        
        if (goal.current >= goal.target && !goal.completed) {
          goal.completed = true;
          
          // Recompensa base + bônus por streak
          let totalReward = goal.reward;
          if (goal.streak && goal.streak > 0 && goal.bonusReward) {
            totalReward += goal.bonusReward;
          }
          
          updateCoins(totalReward);
          
          // Atualizar estatísticas
          const stats = getUsageStats();
          stats.dailyGoalsCompleted++;
          localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
          
          // Verificar conquistas relacionadas a metas diárias
          if (goals.every(g => g.completed)) {
            // Todas as metas diárias foram completadas
            const achievements = getAchievements();
            const streakAchievement = achievements.find(a => a.id === 'achievement_daily_streak_10');
            
            if (streakAchievement && streakAchievement.progress) {
              streakAchievement.progress.current++;
              if (streakAchievement.progress.current >= streakAchievement.progress.target && !streakAchievement.unlocked) {
                unlockAchievement('achievement_daily_streak_10');
              } else {
                // Apenas atualizar o progresso
                updateAchievementProgress('achievement_daily_streak_10', streakAchievement.progress.current);
              }
            }
          }
          
          updated = true;
        }
      }
    });
    
    if (updated) {
      parsedData.goals = goals;
      localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify(parsedData));
    }
  } catch (error) {
    console.error('Erro ao verificar metas diárias:', error);
  }
};

export const checkConsecutiveDays = (): void => {
  try {
    const stats = getUsageStats();
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = stats.lastLoginDate || '';
    
    if (lastLogin) {
      const lastDate = new Date(lastLogin);
      const currentDate = new Date(today);
      
      // Calcular diferença em dias
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Dia consecutivo
        stats.consecutiveDays++;
        
        // Bônus para dias consecutivos
        if (stats.consecutiveDays % 5 === 0) {
          // Bônus a cada 5 dias
          updateCoins(25);
        } else if (stats.consecutiveDays % 3 === 0) {
          // Bônus a cada 3 dias
          updateCoins(15);
        } else {
          // Bônus diário
          updateCoins(5);
        }
      } else if (diffDays > 1) {
        // Sequência quebrada
        stats.consecutiveDays = 1;
      }
    } else {
      stats.consecutiveDays = 1;
    }
    
    stats.lastLoginDate = today;
    localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Erro ao verificar dias consecutivos:', error);
  }
};

// Funções para recompensas compradas
export const getPurchasedRewards = (): string[] => {
  try {
    const rewards = localStorage.getItem(STORAGE_KEYS.REWARDS_PURCHASED);
    return rewards ? JSON.parse(rewards) : [];
  } catch (error) {
    console.error('Erro ao recuperar recompensas compradas:', error);
    return [];
  }
};

export const addPurchasedReward = (rewardId: string): void => {
  try {
    const rewards = getPurchasedRewards();
    if (!rewards.includes(rewardId)) {
      rewards.push(rewardId);
      localStorage.setItem(STORAGE_KEYS.REWARDS_PURCHASED, JSON.stringify(rewards));
    }
  } catch (error) {
    console.error('Erro ao adicionar recompensa comprada:', error);
  }
};

// Função para exportar todos os dados
export const exportAllData = (): string => {
  try {
    const data = {
      phrases: getPhrases(),
      customSymbols: getCustomSymbols(),
      settings: getSettings(),
      usageStats: getUsageStats(),
      tasks: getTasks(),
      dailyGoals: getDailyGoals(),
      coins: getCoins(),
      purchasedRewards: getPurchasedRewards()
    };
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return '';
  }
};

// Função para importar todos os dados
export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.phrases) {
      localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(data.phrases));
    }
    
    if (data.customSymbols) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMBOLS, JSON.stringify(data.customSymbols));
    }
    
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    
    if (data.usageStats) {
      localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(data.usageStats));
    }
    
    if (data.tasks) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
    }
    
    if (data.coins) {
      localStorage.setItem(STORAGE_KEYS.COINS, data.coins.toString());
    }
    
    if (data.purchasedRewards) {
      localStorage.setItem(STORAGE_KEYS.REWARDS_PURCHASED, JSON.stringify(data.purchasedRewards));
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};

// Funções para gerenciar conquistas
export const getAchievements = (): Achievement[] => {
  try {
    const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (achievements) {
      return JSON.parse(achievements);
    }
    
    // Conquistas padrão
    const defaultAchievements: Achievement[] = [
      {
        id: 'achievement_first_phrase',
        name: 'Primeira Comunicação',
        description: 'Criou sua primeira frase com símbolos',
        unlocked: false,
        reward: 15
      },
      {
        id: 'achievement_10_phrases',
        name: 'Comunicador Iniciante',
        description: 'Criou 10 frases diferentes',
        unlocked: false,
        reward: 25,
        progress: { current: 0, target: 10 }
      },
      {
        id: 'achievement_50_phrases',
        name: 'Comunicador Experiente',
        description: 'Criou 50 frases diferentes',
        unlocked: false,
        reward: 50,
        progress: { current: 0, target: 50 }
      },
      {
        id: 'achievement_all_categories',
        name: 'Explorador Completo',
        description: 'Usou símbolos de todas as categorias',
        unlocked: false,
        reward: 40
      },
      {
        id: 'achievement_7_days',
        name: 'Usuário Dedicado',
        description: 'Usou o app por 7 dias consecutivos',
        unlocked: false,
        reward: 70,
        progress: { current: 0, target: 7 }
      },
      {
        id: 'achievement_custom_symbol',
        name: 'Criatividade',
        description: 'Criou seu primeiro símbolo personalizado',
        unlocked: false,
        reward: 30
      },
      {
        id: 'achievement_share_5',
        name: 'Comunicador Social',
        description: 'Compartilhou 5 frases diferentes',
        unlocked: false,
        reward: 35,
        progress: { current: 0, target: 5 }
      },
      {
        id: 'achievement_daily_streak_10',
        name: 'Consistência',
        description: 'Completou todas as metas diárias por 10 dias',
        unlocked: false,
        reward: 100,
        progress: { current: 0, target: 10 }
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
    return defaultAchievements;
  } catch (error) {
    console.error('Erro ao recuperar conquistas:', error);
    return [];
  }
};

export const updateAchievementProgress = (achievementId: string, progress: number): void => {
  try {
    const achievements = getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && achievements[achievementIndex].progress) {
      achievements[achievementIndex].progress!.current = progress;
      
      // Verificar se a conquista foi desbloqueada
      if (progress >= achievements[achievementIndex].progress!.target && !achievements[achievementIndex].unlocked) {
        achievements[achievementIndex].unlocked = true;
        achievements[achievementIndex].dateUnlocked = new Date().toISOString();
        
        // Adicionar recompensa
        updateCoins(achievements[achievementIndex].reward);
      }
      
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }
  } catch (error) {
    console.error('Erro ao atualizar progresso da conquista:', error);
  }
};

export const unlockAchievement = (achievementId: string): boolean => {
  try {
    const achievements = getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].unlocked) {
      achievements[achievementIndex].unlocked = true;
      achievements[achievementIndex].dateUnlocked = new Date().toISOString();
      
      // Adicionar recompensa
      updateCoins(achievements[achievementIndex].reward);
      
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
    return false;
  }
};

// Funções para gerenciar desafios diários
export const getDailyChallenges = (): DailyChallenge[] => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const storedChallenges = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES);
    
    if (storedChallenges) {
      const parsedChallenges = JSON.parse(storedChallenges);
      // Verificar se os desafios são de hoje
      if (parsedChallenges.date === today) {
        return parsedChallenges.challenges;
      }
    }
    
    // Criar novos desafios diários
    const challenges: DailyChallenge[] = [
      {
        id: 'challenge_quick_phrases',
        name: 'Comunicação Rápida',
        description: 'Use 5 frases rápidas diferentes',
        completed: false,
        reward: 15,
        difficulty: 'fácil',
        dateIssued: today
      },
      {
        id: 'challenge_new_category',
        name: 'Nova Categoria',
        description: 'Use símbolos de uma categoria que você nunca usou antes',
        completed: false,
        reward: 20,
        difficulty: 'médio',
        dateIssued: today
      },
      {
        id: 'challenge_long_phrase',
        name: 'Frase Complexa',
        description: 'Crie uma frase com pelo menos 6 símbolos',
        completed: false,
        reward: 25,
        difficulty: 'difícil',
        dateIssued: today
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify({
      date: today,
      challenges
    }));
    
    return challenges;
  } catch (error) {
    console.error('Erro ao recuperar desafios diários:', error);
    return [];
  }
};

export const completeDailyChallenge = (challengeId: string): boolean => {
  try {
    const storedChallenges = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES);
    if (!storedChallenges) {
      return false;
    }
    
    const parsedData = JSON.parse(storedChallenges);
    const challenges = parsedData.challenges;
    const challengeIndex = challenges.findIndex((c: DailyChallenge) => c.id === challengeId);
    
    if (challengeIndex !== -1 && !challenges[challengeIndex].completed) {
      challenges[challengeIndex].completed = true;
      challenges[challengeIndex].dateCompleted = new Date().toISOString();
      
      // Adicionar recompensa
      updateCoins(challenges[challengeIndex].reward);
      
      parsedData.challenges = challenges;
      localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(parsedData));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao completar desafio diário:', error);
    return false;
  }
};

// Função para obter o nível do usuário baseado nas moedas
export const getUserLevel = (): { level: number, progress: number, nextLevelCoins: number } => {
  try {
    const coins = getCoins();
    const level = Math.floor(coins / 100) + 1;
    const progress = (coins % 100) / 100;
    const nextLevelCoins = 100 - (coins % 100);
    
    return { level, progress, nextLevelCoins };
  } catch (error) {
    console.error('Erro ao calcular nível do usuário:', error);
    return { level: 1, progress: 0, nextLevelCoins: 100 };
  }
};

// Função para verificar e atualizar todas as conquistas baseadas nas estatísticas atuais
export const checkAllAchievements = (): void => {
  try {
    const stats = getUsageStats();
    const phrases = getPhrases();
    const customSymbols = getCustomSymbols();
    const achievements = getAchievements();
    
    // Verificar conquista de primeira frase
    if (phrases.length > 0) {
      unlockAchievement('achievement_first_phrase');
    }
    
    // Verificar conquista de 10 frases
    if (phrases.length >= 10) {
      updateAchievementProgress('achievement_10_phrases', phrases.length);
    }
    
    // Verificar conquista de 50 frases
    if (phrases.length >= 50) {
      updateAchievementProgress('achievement_50_phrases', phrases.length);
    }
    
    // Verificar conquista de símbolo personalizado
    if (customSymbols.length > 0) {
      unlockAchievement('achievement_custom_symbol');
    }
    
    // Verificar conquista de dias consecutivos
    if (stats.consecutiveDays >= 7) {
      updateAchievementProgress('achievement_7_days', stats.consecutiveDays);
    }
    
    // Outras verificações de conquistas podem ser adicionadas aqui
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
  }
};
// Funções para gerenciar conquistas
export const getAchievements = (): Achievement[] => {
  try {
    const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (achievements) {
      return JSON.parse(achievements);
    }
    
    // Conquistas padrão
    const defaultAchievements: Achievement[] = [
      {
        id: 'achievement_first_phrase',
        name: 'Primeira Comunicação',
        description: 'Criou sua primeira frase com símbolos',
        unlocked: false,
        reward: 15
      },
      {
        id: 'achievement_10_phrases',
        name: 'Comunicador Iniciante',
        description: 'Criou 10 frases diferentes',
        unlocked: false,
        reward: 25,
        progress: { current: 0, target: 10 }
      },
      {
        id: 'achievement_50_phrases',
        name: 'Comunicador Experiente',
        description: 'Criou 50 frases diferentes',
        unlocked: false,
        reward: 50,
        progress: { current: 0, target: 50 }
      },
      {
        id: 'achievement_all_categories',
        name: 'Explorador Completo',
        description: 'Usou símbolos de todas as categorias',
        unlocked: false,
        reward: 40
      },
      {
        id: 'achievement_7_days',
        name: 'Usuário Dedicado',
        description: 'Usou o app por 7 dias consecutivos',
        unlocked: false,
        reward: 70,
        progress: { current: 0, target: 7 }
      },
      {
        id: 'achievement_custom_symbol',
        name: 'Criatividade',
        description: 'Criou seu primeiro símbolo personalizado',
        unlocked: false,
        reward: 30
      },
      {
        id: 'achievement_share_5',
        name: 'Comunicador Social',
        description: 'Compartilhou 5 frases diferentes',
        unlocked: false,
        reward: 35,
        progress: { current: 0, target: 5 }
      },
      {
        id: 'achievement_daily_streak_10',
        name: 'Consistência',
        description: 'Completou todas as metas diárias por 10 dias',
        unlocked: false,
        reward: 100,
        progress: { current: 0, target: 10 }
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
    return defaultAchievements;
  } catch (error) {
    console.error('Erro ao recuperar conquistas:', error);
    return [];
  }
};

export const updateAchievementProgress = (achievementId: string, progress: number): void => {
  try {
    const achievements = getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && achievements[achievementIndex].progress) {
      achievements[achievementIndex].progress!.current = progress;
      
      // Verificar se a conquista foi desbloqueada
      if (progress >= achievements[achievementIndex].progress!.target && !achievements[achievementIndex].unlocked) {
        achievements[achievementIndex].unlocked = true;
        achievements[achievementIndex].dateUnlocked = new Date().toISOString();
        
        // Adicionar recompensa
        updateCoins(achievements[achievementIndex].reward);
      }
      
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }
  } catch (error) {
    console.error('Erro ao atualizar progresso da conquista:', error);
  }
};

export const unlockAchievement = (achievementId: string): boolean => {
  try {
    const achievements = getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].unlocked) {
      achievements[achievementIndex].unlocked = true;
      achievements[achievementIndex].dateUnlocked = new Date().toISOString();
      
      // Adicionar recompensa
      updateCoins(achievements[achievementIndex].reward);
      
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
    return false;
  }
};

// Funções para gerenciar desafios diários
export const getDailyChallenges = (): DailyChallenge[] => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const storedChallenges = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES);
    
    if (storedChallenges) {
      const parsedChallenges = JSON.parse(storedChallenges);
      // Verificar se os desafios são de hoje
      if (parsedChallenges.date === today) {
        return parsedChallenges.challenges;
      }
    }
    
    // Criar novos desafios diários
    const challenges: DailyChallenge[] = [
      {
        id: 'challenge_quick_phrases',
        name: 'Comunicação Rápida',
        description: 'Use 5 frases rápidas diferentes',
        completed: false,
        reward: 15,
        difficulty: 'fácil',
        dateIssued: today
      },
      {
        id: 'challenge_new_category',
        name: 'Nova Categoria',
        description: 'Use símbolos de uma categoria que você nunca usou antes',
        completed: false,
        reward: 20,
        difficulty: 'médio',
        dateIssued: today
      },
      {
        id: 'challenge_long_phrase',
        name: 'Frase Complexa',
        description: 'Crie uma frase com pelo menos 6 símbolos',
        completed: false,
        reward: 25,
        difficulty: 'difícil',
        dateIssued: today
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify({
      date: today,
      challenges
    }));
    
    return challenges;
  } catch (error) {
    console.error('Erro ao recuperar desafios diários:', error);
    return [];
  }
};

export const completeDailyChallenge = (challengeId: string): boolean => {
  try {
    const storedChallenges = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES);
    if (!storedChallenges) {
      return false;
    }
    
    const parsedData = JSON.parse(storedChallenges);
    const challenges = parsedData.challenges;
    const challengeIndex = challenges.findIndex((c: DailyChallenge) => c.id === challengeId);
    
    if (challengeIndex !== -1 && !challenges[challengeIndex].completed) {
      challenges[challengeIndex].completed = true;
      challenges[challengeIndex].dateCompleted = new Date().toISOString();
      
      // Adicionar recompensa
      updateCoins(challenges[challengeIndex].reward);
      
      parsedData.challenges = challenges;
      localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(parsedData));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao completar desafio diário:', error);
    return false;
  }
};

// Função para obter o nível do usuário baseado nas moedas
export const getUserLevel = (): { level: number, progress: number, nextLevelCoins: number } => {
  try {
    const coins = getCoins();
    const level = Math.floor(coins / 100) + 1;
    const progress = (coins % 100) / 100;
    const nextLevelCoins = 100 - (coins % 100);
    
    return { level, progress, nextLevelCoins };
  } catch (error) {
    console.error('Erro ao calcular nível do usuário:', error);
    return { level: 1, progress: 0, nextLevelCoins: 100 };
  }
};

// Função para verificar e atualizar todas as conquistas baseadas nas estatísticas atuais
export const checkAllAchievements = (): void => {
  try {
    const stats = getUsageStats();
    const phrases = getPhrases();
    const customSymbols = getCustomSymbols();
    const achievements = getAchievements();
    
    // Verificar conquista de primeira frase
    if (phrases.length > 0) {
      unlockAchievement('achievement_first_phrase');
    }
    
    // Verificar conquista de 10 frases
    if (phrases.length >= 10) {
      updateAchievementProgress('achievement_10_phrases', phrases.length);
    }
    
    // Verificar conquista de 50 frases
    if (phrases.length >= 50) {
      updateAchievementProgress('achievement_50_phrases', phrases.length);
    }
    
    // Verificar conquista de símbolo personalizado
    if (customSymbols.length > 0) {
      unlockAchievement('achievement_custom_symbol');
    }
    
    // Verificar conquista de dias consecutivos
    if (stats.consecutiveDays >= 7) {
      updateAchievementProgress('achievement_7_days', stats.consecutiveDays);
    }
    
    // Outras verificações de conquistas podem ser adicionadas aqui
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
  }
};