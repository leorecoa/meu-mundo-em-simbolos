import { useState, useEffect } from 'react';
import { seedDatabase } from '@/lib/seedDatabase';
import { seedGamification } from '@/lib/seedGamification';
import { getSettings } from '@/lib/storage';

export const useAppInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Iniciando operações de inicialização...');
        await seedDatabase();
        await seedGamification();
        const settings = await getSettings();
        if (settings?.language) {
          document.documentElement.lang = settings.language.split('-')[0];
        }
        console.log('Inicialização concluída.');
        setIsInitialized(true);
      } catch (err: any) {
        console.error('Falha na inicialização:', err);
        setError('Não foi possível iniciar o aplicativo.');
      }
    };

    initialize();
  }, []);

  return { isInitialized, error };
};
