// Configurações do aplicativo
import { getSettings, saveSettings } from './storage';

// Tipos para as configurações do aplicativo
export interface AppSettings {
  volume: 'alto' | 'médio' | 'baixo';
  fontSize: 'grande' | 'médio' | 'pequeno';
  accessibility: {
    highContrast: boolean;
    doubleConfirmation: boolean;
    vibration: boolean;
  };
}

// Obter configurações do aplicativo
export const getAppSettings = (): AppSettings => {
  try {
    const storedSettings = localStorage.getItem('app-settings');
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
    console.error('Erro ao recuperar configurações do aplicativo:', error);
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

// Salvar configurações do aplicativo
export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Erro ao salvar configurações do aplicativo:', error);
  }
};

// Aplicar configurações de volume
export const applyVolumeSettings = (volume: 'alto' | 'médio' | 'baixo'): void => {
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
  
  // Salvar nas configurações do aplicativo
  const appSettings = getAppSettings();
  saveAppSettings({
    ...appSettings,
    volume
  });
};

// Aplicar configurações de tamanho da fonte
export const applyFontSizeSettings = (fontSize: 'grande' | 'médio' | 'pequeno'): void => {
  // Mapear configurações de tamanho da fonte para valores CSS
  const fontSizeValues = {
    'grande': '1.2rem',
    'médio': '1rem',
    'pequeno': '0.875rem'
  };
  
  // Aplicar configuração de tamanho da fonte ao sistema
  document.documentElement.style.setProperty('--base-font-size', fontSizeValues[fontSize]);
  
  // Salvar nas configurações do aplicativo
  const appSettings = getAppSettings();
  saveAppSettings({
    ...appSettings,
    fontSize
  });
};

// Aplicar configurações de acessibilidade
export const applyAccessibilitySettings = (
  setting: 'highContrast' | 'doubleConfirmation' | 'vibration',
  value: boolean
): void => {
  const appSettings = getAppSettings();
  
  // Atualizar configuração específica
  appSettings.accessibility[setting] = value;
  
  // Aplicar configurações de acessibilidade
  if (setting === 'highContrast' && value) {
    document.documentElement.classList.add('high-contrast');
  } else if (setting === 'highContrast' && !value) {
    document.documentElement.classList.remove('high-contrast');
  }
  
  // Salvar nas configurações do aplicativo
  saveAppSettings(appSettings);
};

// Função para vibrar o dispositivo (se suportado)
export const vibrateDevice = (pattern: number | number[]): void => {
  const appSettings = getAppSettings();
  
  if (appSettings.accessibility.vibration && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Função para confirmar ação (com confirmação dupla se ativada)
export const confirmAction = (
  action: () => void,
  message: string = 'Tem certeza que deseja realizar esta ação?'
): void => {
  const appSettings = getAppSettings();
  
  if (appSettings.accessibility.doubleConfirmation) {
    if (window.confirm(message)) {
      action();
    }
  } else {
    action();
  }
};