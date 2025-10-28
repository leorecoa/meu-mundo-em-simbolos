import { useState, useEffect } from 'react';
import { seedDatabase } from '@/lib/seedDatabase';
import { seedGamification } from '@/lib/seedGamification';
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
        console.log('Iniciando o seed do banco de dados...');
        await seedDatabase();
        await seedGamification();
        console.log('Seed concluído. Aplicativo pronto.');
        setIsInitialized(true);
      } catch (err: any) {
        console.error('Falha catastrófica durante a inicialização:', err);
        setError('Não foi possível iniciar o banco de dados. Tente limpar o cache do navegador ou reinstalar o app.');
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
    // Usamos o SplashScreen como nossa "sala de espera"
    return <SplashScreen onComplete={() => {}} />;
  }

  // Se tudo correu bem, renderiza o aplicativo
  return <>{children}</>;
};
