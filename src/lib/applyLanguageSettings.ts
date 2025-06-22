import { getAppSettings, saveAppSettings } from './appSettings';
import { getSettings, saveSettings } from './storage';

// Aplicar configurações de idioma
export const applyLanguageSettings = (language: string): void => {
  // Salvar na configuração geral
  const userSettings = getSettings();
  saveSettings({
    ...userSettings,
    language
  });
  
  // Salvar nas configurações do aplicativo
  const appSettings = getAppSettings();
  saveAppSettings({
    ...appSettings,
    language
  });
  
  // Atualizar o atributo lang do documento HTML para melhorar a acessibilidade
  document.documentElement.lang = language.split('-')[0];
};