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
  
  // Disparar um evento personalizado para notificar componentes sobre a mudança de idioma
  const languageChangeEvent = new CustomEvent('languagechange', { detail: { language } });
  document.dispatchEvent(languageChangeEvent);
  
  // Armazenar o idioma atual no localStorage para garantir persistência
  localStorage.setItem('current-language', language);
};