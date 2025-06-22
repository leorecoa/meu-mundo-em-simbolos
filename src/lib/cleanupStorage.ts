// Script para limpar dados relacionados ao modo cuidador e ao sistema FiveCoin

export const cleanupStorage = () => {
  try {
    // Lista de chaves relacionadas ao modo cuidador e FiveCoin para remover
    const keysToRemove = [
      'fivecoins',
      'fivecoin-settings',
      'mms-tasks',
      'mms-daily-goals',
      'mms-daily-challenges',
      'mms-purchased-rewards',
      'mms-caregiver-auth',
      'mms-caregiver-settings'
    ];
    
    // Remover cada chave do localStorage
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Removido: ${key}`);
      }
    });
    
    // Migrar configurações relevantes do FiveCoin para o novo sistema de configurações
    const fiveCoinSettings = localStorage.getItem('fivecoin-settings');
    if (fiveCoinSettings) {
      try {
        const parsedSettings = JSON.parse(fiveCoinSettings);
        const appSettings = {
          volume: parsedSettings.volume || 'médio',
          fontSize: parsedSettings.fontSize || 'médio',
          accessibility: {
            highContrast: parsedSettings.accessibility?.highContrast || false,
            doubleConfirmation: parsedSettings.accessibility?.doubleConfirmation || false,
            vibration: parsedSettings.accessibility?.vibration || false
          },
          language: 'pt-BR'
        };
        
        localStorage.setItem('app-settings', JSON.stringify(appSettings));
        console.log('Configurações migradas com sucesso');
      } catch (error) {
        console.error('Erro ao migrar configurações:', error);
      }
    }
    
    console.log('Limpeza de armazenamento concluída');
  } catch (error) {
    console.error('Erro durante a limpeza do armazenamento:', error);
  }
};