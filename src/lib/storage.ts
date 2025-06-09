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
}

export interface UserSettings {
  voiceType: 'feminina' | 'masculina' | 'infantil';
  voiceSpeed: number;
  iconSize: number;
  useAudioFeedback: boolean;
  theme: string;
  largeIcons: boolean;
}

// Chaves para armazenamento
const STORAGE_KEYS = {
  PHRASES: 'mms-phrases',
  CUSTOM_SYMBOLS: 'mms-custom-symbols',
  SETTINGS: 'mms-settings',
  USAGE_STATS: 'mms-usage-stats',
  PIN: 'mms-pin',
  FAVORITES: 'mms-favorites'
};

// Funções de armazenamento
export const savePhrase = (phrase: StoredPhrase): void => {
  try {
    const phrases = getPhrases();
    phrases.push(phrase);
    localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(phrases));
    
    // Atualizar estatísticas
    updateSymbolUsageStats(phrase.symbols);
  } catch (error) {
    console.error('Erro ao salvar frase:', error);
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
export const saveCustomSymbol = (symbol: CategoryItem): void => {
  try {
    const symbols = getCustomSymbols();
    symbols.push(symbol);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMBOLS, JSON.stringify(symbols));
  } catch (error) {
    console.error('Erro ao salvar símbolo personalizado:', error);
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

export const deleteCustomSymbol = (id: string): void => {
  try {
    const symbols = getCustomSymbols();
    const updatedSymbols = symbols.filter(symbol => symbol.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMBOLS, JSON.stringify(updatedSymbols));
  } catch (error) {
    console.error('Erro ao excluir símbolo personalizado:', error);
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
      totalTimeSpent: 0
    };
  } catch (error) {
    console.error('Erro ao recuperar estatísticas de uso:', error);
    return {
      symbolsUsed: {},
      phrasesCreated: 0,
      lastUsed: Date.now(),
      totalTimeSpent: 0
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

// Função para exportar todos os dados
export const exportAllData = (): string => {
  try {
    const data = {
      phrases: getPhrases(),
      customSymbols: getCustomSymbols(),
      settings: getSettings(),
      usageStats: getUsageStats()
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
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};