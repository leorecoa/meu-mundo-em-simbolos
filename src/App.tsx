import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { useAppInitializer } from './hooks/useAppInitializer';

const queryClient = new QueryClient();

// Componente que decide o que renderizar: Splash, Perfil, ou o App principal.
const AppContent = () => {
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
    if(userSettings?.id) {
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

  // Se tudo está pronto, renderiza o app principal com o tema correto.
  return (
    <ThemeProvider>
        <div className="app-container">
            <Index />
            {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
        </div>
    </ThemeProvider>
  );
};

// Componente Raiz que organiza todos os provedores na ordem correta.
const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ProfileProvider>
              <AppContent />
            </ProfileProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
