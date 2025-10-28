import { useState, useEffect } from 'react';
import { seedDatabase } from '@/lib/seedDatabase';
import { seedGamification } from '@/lib/seedGamification';
import { getSettings } from '@/lib/storage'; // Importa getSettings
import { SplashScreen } from './SplashScreen';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Iniciando operações de inicialização...');

        // 1. Popula o banco de dados (se necessário)
        await seedDatabase();
        await seedGamification();

        // 2. Busca as configurações para definir o idioma
        const settings = await getSettings();
        if (settings && settings.language) {
          document.documentElement.lang = settings.language.split('-')[0];
        }

        console.log('Inicialização concluída. Aplicativo pronto.');
        setIsInitialized(true);

      } catch (err: any) {
        console.error('Falha catastrófica durante a inicialização:', err);
        setError('Não foi possível iniciar o aplicativo. Por favor, tente recarregar.');
      }
    };

    initialize();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-4">
        <h1 className="text-xl font-bold mb-4">Erro na Inicialização</h1>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return <>{children}</>;
};
