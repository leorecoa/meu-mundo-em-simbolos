import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';

// Hook para inicializar a aplicação
export const useAppInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      // Garante que o splash screen seja exibido por um tempo mínimo
      const minDisplayTime = new Promise(resolve => setTimeout(resolve, 2500));
      
      // Abre a conexão com o banco de dados
      const dbOpenPromise = db.open();

      // Aguarda ambas as promessas serem resolvidas
      await Promise.all([dbOpenPromise, minDisplayTime]);

      setIsInitialized(true);
    } catch (err: any) {
      console.error("Falha ao inicializar o banco de dados:", err);
      setError("Não foi possível carregar os dados do aplicativo.");
      setIsInitialized(true); // Permite que a UI de erro seja mostrada
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { isInitialized, error };
};
