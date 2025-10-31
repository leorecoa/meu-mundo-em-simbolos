import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAppInitializer } from '@/components/AppInitializer';
import { SplashScreen } from '@/components/SplashScreen';
import { ProfileProvider, useProfile } from './contexts/ProfileContext'; // Importando o context
import { ProfileScreen } from './pages/ProfileScreen';
import Index from './pages/Index';

const queryClient = new QueryClient();

const AppContent = () => {
  const { activeProfileId, setActiveProfileId } = useProfile();
  const { isInitialized, error } = useAppInitializer();

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-red-900 text-white">Error: {error}</div>;
  }

  // Mostra o splash screen enquanto o app está inicializando
  if (!isInitialized) {
    return <SplashScreen onComplete={() => {}} />;
  }

  // Se o app inicializou mas não há perfil ativo, mostra a tela de perfis
  if (!activeProfileId) {
    return <ProfileScreen onProfileSelect={setActiveProfileId} />;
  }

  // Se tudo está pronto e um perfil está ativo, mostra o conteúdo principal
  return <Index />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Envolvemos tudo com o ProfileProvider */}
        <ProfileProvider>
          <TooltipProvider>
            <Toaster /> 
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </ProfileProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
