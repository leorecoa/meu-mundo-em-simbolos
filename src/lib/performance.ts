// Utilitários de otimização de performance

/**
 * Pré-carrega recursos para melhorar o tempo de inicialização
 */
export const preloadResources = () => {
  // Pré-carregar vozes para síntese de fala
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
};

/**
 * Otimiza o carregamento de componentes pesados
 * @param callback Função a ser executada após um pequeno atraso
 */
export const optimizeRendering = (callback: () => void) => {
  // Usar requestIdleCallback se disponível, ou setTimeout como fallback
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => callback());
  } else {
    setTimeout(callback, 10);
  }
};