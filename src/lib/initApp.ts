// Arquivo de inicialização do aplicativo
import { getSettings } from './storage';
import { getAppSettings, saveAppSettings } from './appSettings';

/**
 * Inicializa as configurações do aplicativo
 * Esta função deve ser chamada na inicialização do aplicativo
 */
export const initializeApp = (): void => {
  try {
    console.log('Inicializando aplicativo...');
    
    // Verificar se as configurações do aplicativo existem
    const appSettings = getAppSettings();
    
    // Verificar se o tema está definido no localStorage
    if (!localStorage.getItem('app-theme')) {
      localStorage.setItem('app-theme', 'Padrão');
    }
    
    // Verificar se o idioma está definido
    const settings = getSettings();
    if (settings.language) {
      // Definir o idioma do documento
      document.documentElement.lang = settings.language.split('-')[0];
      
      // Verificar se o idioma está definido nas configurações do aplicativo
      if (!appSettings.language) {
        saveAppSettings({
          ...appSettings,
          language: settings.language
        });
      }
    }
    
    console.log('Aplicativo inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar aplicativo:', error);
  }
};

/**
 * Verifica se as configurações estão íntegras
 * Esta função deve ser chamada quando houver problemas com as configurações
 */
export const repairSettings = (): void => {
  try {
    console.log('Reparando configurações...');
    
    // Configurações padrão do aplicativo
    const defaultAppSettings = {
      volume: 'médio',
      fontSize: 'médio',
      accessibility: {
        highContrast: false,
        doubleConfirmation: false,
        vibration: false
      },
      language: 'pt-BR'
    };
    
    // Salvar configurações padrão
    localStorage.setItem('app-settings', JSON.stringify(defaultAppSettings));
    
    // Configurações padrão do usuário
    const defaultUserSettings = {
      voiceType: 'feminina',
      voiceSpeed: 50,
      iconSize: 50,
      useAudioFeedback: true,
      theme: 'Padrão',
      largeIcons: false,
      language: 'pt-BR'
    };
    
    // Salvar configurações padrão do usuário
    localStorage.setItem('mms-settings', JSON.stringify(defaultUserSettings));
    
    // Definir tema padrão
    localStorage.setItem('app-theme', 'Padrão');
    
    // Definir idioma do documento
    document.documentElement.lang = 'pt';
    
    console.log('Configurações reparadas com sucesso!');
  } catch (error) {
    console.error('Erro ao reparar configurações:', error);
  }
};