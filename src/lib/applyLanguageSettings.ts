import { getAppSettings, saveAppSettings } from './appSettings';
import { db } from '@/lib/db';

// Aplicar configurações de idioma
export const applyLanguageSettings = async (language: string): Promise<void> => {
  // Salvar na configuração geral
  const activeProfileId = localStorage.getItem('activeProfileId');
  if (activeProfileId) {
    const settings = await db.userSettings.where({ profileId: parseInt(activeProfileId) }).first();
    if (settings?.id) {
      await db.userSettings.update(settings.id, { language });
    }
  }
  
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
