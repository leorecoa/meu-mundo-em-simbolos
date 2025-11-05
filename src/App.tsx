import { useState, useEffect, Suspense } from 'react';
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
import { useAppInitializer } from '@/components/AppInitializer'; // CORRIGIDO

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
    return <div className="h-screen w-full flex items-center justify-center bg-red-800 text-white">{error}</div>;
  }

  if (!isInitialized) {
    return <SplashScreen onComplete={() => {}} />;
  }

  if (!activeProfileId) {
    return <ProfileScreen onProfileSelect={setActiveProfileId} />;
  }

  return (
    <ThemeProvider>
      <Suspense fallback={<SplashScreen onComplete={() => {}} />}>
        <Index />
        {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
      </Suspense>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
