import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { useEffect } from "react";
import { getCurrentLanguage } from "@/lib/simpleLanguage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { seedDatabase } from "@/lib/seedDatabase";
import { seedGamification } from "@/lib/seedGamification";
import { getSettings, saveSettings } from "@/lib/storage";

// Criar cliente de consulta
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (substitui cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      console.log('App inicializado');
      
      // Popula o banco de dados com os dados iniciais
      await seedDatabase();
      await seedGamification();

      try {
        // Define o idioma e o tema a partir do banco de dados
        const settings = await getSettings();
        document.documentElement.lang = settings.language.split('-')[0];
        
        // Se não houver tema definido, salva o padrão
        if (!settings.theme) {
          await saveSettings({ theme: 'Padrão' });
        }

      } catch (error) {
        console.error('Erro na inicialização do aplicativo:', error);
      }
    };

    initializeApp();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
