// Funções simples para gerenciar configurações de idioma

/**
 * Aplica configurações de idioma
 * @param language Código do idioma (ex: 'pt-BR')
 */
export const applyLanguage = (language: string): void => {
  try {
    // Salvar idioma no localStorage
    localStorage.setItem('app-language', language);
    
    // Atualizar o atributo lang do documento HTML
    document.documentElement.lang = language.split('-')[0];
    
    // Disparar evento para notificar componentes
    const event = new CustomEvent('language-changed', { detail: { language } });
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Erro ao aplicar idioma:', error);
  }
};

/**
 * Obtém o idioma atual
 * @returns Código do idioma atual ou 'pt-BR' como padrão
 */
export const getCurrentLanguage = (): string => {
  try {
    return localStorage.getItem('app-language') || 'pt-BR';
  } catch (error) {
    console.error('Erro ao obter idioma:', error);
    return 'pt-BR';
  }
};

/**
 * Lista de idiomas comuns
 */
export const commonLanguages = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'pt-PT', name: 'Português (Portugal)' },
  { code: 'en-US', name: 'Inglês (EUA)' },
  { code: 'en-GB', name: 'Inglês (Reino Unido)' },
  { code: 'es-ES', name: 'Espanhol (Espanha)' },
  { code: 'es-MX', name: 'Espanhol (México)' },
  { code: 'fr-FR', name: 'Francês' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'de-DE', name: 'Alemão' }
];