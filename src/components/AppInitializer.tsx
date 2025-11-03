import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';

export const useAppInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      const minDisplayTime = new Promise(resolve => setTimeout(resolve, 2500));
      await db.open();

      // Popula os dados iniciais de gamificação (só executa se o DB estiver vazio)
      await db.populateInitialData();

      await minDisplayTime;
      setIsInitialized(true);
    } catch (err: any) {
      console.error("Falha ao inicializar o banco de dados:", err);
      setError("Não foi possível carregar os dados do aplicativo.");
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { isInitialized, error };
};
