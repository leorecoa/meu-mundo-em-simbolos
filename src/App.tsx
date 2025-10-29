import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppInitializer } from './components/AppInitializer';
import { SplashScreen } from './components/SplashScreen';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isInitialized, error } = useAppInitializer();

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error}</div>;
  }

  if (!isInitialized) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return <Index />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
