// Implementação de armazenamento local para o aplicativo
import { CategoryItem } from '@/data/categoryData';

// Tipos para armazenamento
export interface StoredPhrase {
  id: string;
  text: string;
  symbols: PhraseSymbol[];
  timestamp: number;
  isFavorite: boolean;
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
}

export interface DailyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  completed: boolean;
  reward: number;
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
  REWARDS_PURCHASED: 'mms-rewards-purchased'
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
    const newAmount = currentCoins + amount;
    localStorage.setItem(STORAGE_KEYS.COINS, newAmount.toString());
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
        reward: 10
      },
      {
        id: 'task_2',
        name: 'Explorador de categorias',
        description: 'Explore todas as categorias de símbolos',
        completed: false,
        reward: 15
      },
      {
        id: 'task_3',
        name: 'Comunicador frequente',
        description: 'Use o app por 5 dias consecutivos',
        completed: false,
        reward: 25
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
    
    // Criar novas metas diárias
    goals = [
      {
        id: 'daily_symbols',
        name: 'Usar 20 símbolos',
        target: 20,
        current: 0,
        completed: false,
        reward: 5
      },
      {
        id: 'daily_phrases',
        name: 'Criar 5 frases',
        target: 5,
        current: 0,
        completed: false,
        reward: 10
      },
      {
        id: 'daily_time',
        name: 'Usar o app por 10 minutos',
        target: 600, // em segundos
        current: 0,
        completed: false,
        reward: 15
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
        (type === 'time_spent' && goal.id === 'daily_time')
      ) {
        goal.current += value;
        
        if (goal.current >= goal.target && !goal.completed) {
          goal.completed = true;
          updateCoins(goal.reward);
          
          // Atualizar estatísticas
          const stats = getUsageStats();
          stats.dailyGoalsCompleted++;
          localStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
          
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