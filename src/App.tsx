import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAppInitializer } from '@/components/AppInitializer';
import { SplashScreen } from '@/components/SplashScreen';
import { ProfileProvider, useProfile } from './contexts/ProfileContext';
import { ProfileScreen } from './pages/ProfileScreen';
import Index from './pages/Index';
import { OnboardingGuide } from '@/components/OnboardingGuide'; // Importar

const queryClient = new QueryClient();

const AppContent = () => {
  const { activeProfileId, setActiveProfileId } = useProfile();
  const { isInitialized, error } = useAppInitializer();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userSettings = useLiveQuery(() => 
    db.userSettings.get(1)
  , [activeProfileId]);

  useEffect(() => {
    if (userSettings && !userSettings.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [userSettings]);

  const handleOnboardingComplete = async () => {
    await db.userSettings.update(1, { onboardingCompleted: true });
    setShowOnboarding(false);
  };

  if (error) { /* ... */ }
  if (!isInitialized) { /* ... */ }
  if (!activeProfileId) { /* ... */ }

  return (
    <>
      <Index />
      {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
