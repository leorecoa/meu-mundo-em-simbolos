// Implementação das configurações do sistema FiveCoin
import { getSettings, saveSettings, getPurchasedRewards } from './storage';

// Tipos para as configurações do FiveCoin
export interface FiveCoinSettings {
  volume: 'alto' | 'médio' | 'baixo';
  fontSize: 'grande' | 'médio' | 'pequeno';
  accessibility: {
    highContrast: boolean;
    doubleConfirmation: boolean;
    vibration: boolean;
  };
}

// Obter configurações do FiveCoin
export const getFiveCoinSettings = (): FiveCoinSettings => {
  try {
    const storedSettings = localStorage.getItem('fivecoin-settings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    
    // Configurações padrão
    return {
      volume: 'médio',
      fontSize: 'médio',
      accessibility: {
        highContrast: false,
        doubleConfirmation: false,
        vibration: false
      }
    };
  } catch (error) {
    console.error('Erro ao recuperar configurações do FiveCoin:', error);
    return {
      volume: 'médio',
      fontSize: 'médio',
      accessibility: {
        highContrast: false,
        doubleConfirmation: false,
        vibration: false
      }
    };
  }
};

// Salvar configurações do FiveCoin
export const saveFiveCoinSettings = (settings: FiveCoinSettings): void => {
  try {
    localStorage.setItem('fivecoin-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Erro ao salvar configurações do FiveCoin:', error);
  }
};

// Verificar se uma recompensa está desbloqueada
export const isRewardUnlocked = (rewardId: string): boolean => {
  const purchasedRewards = getPurchasedRewards();
  return purchasedRewards.includes(rewardId);
};

// Aplicar configurações de volume
export const applyVolumeSettings = (volume: 'alto' | 'médio' | 'baixo'): void => {
  const settings = getSettings();
  
  // Mapear configurações de volume para valores numéricos
  const volumeValues = {
    'alto': 1.0,
    'médio': 0.7,
    'baixo': 0.4
  };
  
  // Aplicar configuração de volume ao sistema
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    audio.volume = volumeValues[volume];
  });
  
  // Salvar na configuração geral
  const userSettings = getSettings();
  saveSettings({
    ...userSettings,
    voiceSpeed: volume === 'alto' ? 70 : volume === 'médio' ? 50 : 30
  });
  
  // Salvar nas configurações do FiveCoin
  const fiveCoinSettings = getFiveCoinSettings();
  saveFiveCoinSettings({
    ...fiveCoinSettings,
    volume
  });
};

// Aplicar configurações de tamanho da fonte
export const applyFontSizeSettings = (fontSize: 'grande' | 'médio' | 'pequeno'): void => {
  const settings = getSettings();
  
  // Mapear configurações de tamanho da fonte para valores CSS
  const fontSizeValues = {
    'grande': '1.2rem',
    'médio': '1rem',
    'pequeno': '0.875rem'
  };
  
  // Aplicar configuração de tamanho da fonte ao sistema
  document.documentElement.style.setProperty('--base-font-size', fontSizeValues[fontSize]);
  
  // Salvar nas configurações do FiveCoin
  const fiveCoinSettings = getFiveCoinSettings();
  saveFiveCoinSettings({
    ...fiveCoinSettings,
    fontSize
  });
};

// Aplicar configurações de acessibilidade
export const applyAccessibilitySettings = (
  setting: 'highContrast' | 'doubleConfirmation' | 'vibration',
  value: boolean
): void => {
  const fiveCoinSettings = getFiveCoinSettings();
  
  // Atualizar configuração específica
  fiveCoinSettings.accessibility[setting] = value;
  
  // Aplicar configurações de acessibilidade
  if (setting === 'highContrast' && value) {
    document.documentElement.classList.add('high-contrast');
  } else if (setting === 'highContrast' && !value) {
    document.documentElement.classList.remove('high-contrast');
  }
  
  // Salvar nas configurações do FiveCoin
  saveFiveCoinSettings(fiveCoinSettings);
};

// Verificar se uma tarefa está completa
export const isTaskComplete = (taskId: string): boolean => {
  try {
    const tasks = JSON.parse(localStorage.getItem('mms-tasks') || '[]');
    const task = tasks.find((t: any) => t.id === taskId);
    return task ? task.completed : false;
  } catch (error) {
    console.error('Erro ao verificar conclusão da tarefa:', error);
    return false;
  }
};

// Verificar se uma meta diária está completa
export const isDailyGoalComplete = (goalId: string): boolean => {
  try {
    const storedGoals = localStorage.getItem('mms-daily-goals');
    if (!storedGoals) return false;
    
    const parsedData = JSON.parse(storedGoals);
    const goals = parsedData.goals;
    const goal = goals.find((g: any) => g.id === goalId);
    return goal ? goal.completed : false;
  } catch (error) {
    console.error('Erro ao verificar conclusão da meta diária:', error);
    return false;
  }
};

// Verificar se um desafio está completo
export const isDailyChallengeComplete = (challengeId: string): boolean => {
  try {
    const storedChallenges = localStorage.getItem('mms-daily-challenges');
    if (!storedChallenges) return false;
    
    const parsedData = JSON.parse(storedChallenges);
    const challenges = parsedData.challenges;
    const challenge = challenges.find((c: any) => c.id === challengeId);
    return challenge ? challenge.completed : false;
  } catch (error) {
    console.error('Erro ao verificar conclusão do desafio:', error);
    return false;
  }
};

// Função para vibrar o dispositivo (se suportado)
export const vibrateDevice = (pattern: number | number[]): void => {
  const fiveCoinSettings = getFiveCoinSettings();
  
  if (fiveCoinSettings.accessibility.vibration && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Função para confirmar ação (com confirmação dupla se ativada)
export const confirmAction = (
  action: () => void,
  message: string = 'Tem certeza que deseja realizar esta ação?'
): void => {
  const fiveCoinSettings = getFiveCoinSettings();
  
  if (fiveCoinSettings.accessibility.doubleConfirmation) {
    if (window.confirm(message)) {
      action();
    }
  } else {
    action();
  }
};