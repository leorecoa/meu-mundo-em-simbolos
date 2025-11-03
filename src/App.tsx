import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SplashScreen } from '@/components/SplashScreen';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { ProfileScreen } from './pages/ProfileScreen';
import Index from './pages/Index';

import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import { ThemeProvider } from './hooks/useTheme';
import { useAppInitializer } from '@/components/AppInitializer';

const queryClient = new QueryClient();

function AppContent() {
  const { activeProfileId, setActiveProfileId } = useProfile();
  const { isInitialized, error } = useAppInitializer();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userSettings = useLiveQuery(() => 
    activeProfileId ? db.userSettings.where({ profileId: activeProfileId }).first() : undefined, 
    [activeProfileId]
  );

  useEffect(() => {
    if (userSettings && userSettings.onboardingCompleted === false) {
      setShowOnboarding(true);
    }
  }, [userSettings]);

  const handleOnboardingComplete = async () => {
    if (userSettings?.id) {
      await db.userSettings.update(userSettings.id, { onboardingCompleted: true });
    }
    setShowOnboarding(false);
  };

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-red-900 text-white">Erro de Inicialização: {error}</div>;
  }

  if (!isInitialized) {
    return <SplashScreen />;
  }

  if (!activeProfileId) {
    return <ProfileScreen onProfileSelect={setActiveProfileId} />;
  }

  return (
    // O ThemeProvider deve estar aqui para ter acesso ao perfil e configurações futuras
    <ThemeProvider>
      <Index />
      {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
    </ThemeProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* A ordem correta dos provedores globais */}
        <BrowserRouter>
          <ProfileProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </ProfileProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
