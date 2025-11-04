// Arquivo de inicialização do aplicativo
import { db } from './db';
import { getAppSettings, saveAppSettings } from './appSettings';

/**
 * Inicializa as configurações do aplicativo
 * Esta função deve ser chamada na inicialização do aplicativo
 */
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Inicializando aplicativo...');
    
    // Verificar se as configurações do aplicativo existem
    const appSettings = getAppSettings();
    
    // Verificar se o tema está definido no localStorage
    if (!localStorage.getItem('app-theme')) {
      localStorage.setItem('app-theme', 'Padrão');
    }
    
    // Obter idioma das configurações do usuário no DB
    const activeProfileId = localStorage.getItem('activeProfileId');
    if (activeProfileId) {
      const settings = await db.userSettings.where({ profileId: parseInt(activeProfileId) }).first();
      if (settings?.language) {
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
    
    // Definir tema padrão
    localStorage.setItem('app-theme', 'Padrão');
    
    // Definir idioma do documento
    document.documentElement.lang = 'pt';
    
    console.log('Configurações reparadas com sucesso!');
  } catch (error) {
    console.error('Erro ao reparar configurações:', error);
  }
};
