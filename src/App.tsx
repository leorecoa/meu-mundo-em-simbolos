import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAppInitializer } from '@/components/AppInitializer';
import { SplashScreen } from '@/components/SplashScreen';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import { ThemeProvider } from './hooks/useTheme'; // 1. Importar o ThemeProvider
import { ProfileScreen } from './pages/ProfileScreen';
import Index from './pages/Index';

const queryClient = new QueryClient();

const AppContent = () => {
  const { activeProfileId, setActiveProfileId } = useProfile();
  const { isInitialized, error } = useAppInitializer();

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-red-900 text-white">Error: {error}</div>;
  }

  if (!isInitialized) {
    return <SplashScreen onComplete={() => {}} />;
  }

  if (!activeProfileId) {
    return <ProfileScreen onProfileSelect={setActiveProfileId} />;
  }

  return <Index />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* 2. Envolver a aplicação com o ThemeProvider */}
        <ThemeProvider>
          <ProfileProvider>
            <TooltipProvider>
              <Toaster /> 
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </ProfileProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
