import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';

export const useAppInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      const minDisplayTime = new Promise(resolve => setTimeout(resolve, 2500));
      await db.open();

      // Migrar perfis existentes sem dados
      const profiles = await db.profiles.toArray();
      for (const profile of profiles) {
        if (profile.id) {
          const categoryCount = await db.categories.where({ profileId: profile.id }).count();
          if (categoryCount === 0) {
            console.log(`Migrando perfil ${profile.name}...`);
            const { seedDatabase } = await import('@/lib/seedDatabase');
            await seedDatabase(profile.id);
          }
        }
      }

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
