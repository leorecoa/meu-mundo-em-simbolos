import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { useEffect } from "react";
import { cleanupStorage } from "@/lib/cleanupStorage";
import { getSettings } from "@/lib/storage";
import { initializeApp, repairSettings } from "@/lib/initApp";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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
  // Executar limpeza de armazenamento e inicializar o aplicativo
  useEffect(() => {
    console.log('App inicializado');
    
    // Limpar armazenamento antigo
    cleanupStorage();
    
    try {
      // Inicializar o aplicativo
      initializeApp();
      
      // Obter configurações
      const settings = getSettings();
      if (settings.language) {
        console.log('Idioma definido:', settings.language);
        
        // Garantir que o idioma seja aplicado em todo o aplicativo
        import('@/lib/applyLanguageSettings').then(({ applyLanguageSettings }) => {
          applyLanguageSettings(settings.language);
        }).catch(error => {
          console.error('Erro ao importar applyLanguageSettings:', error);
          // Tentar reparar as configurações em caso de erro
          repairSettings();
        });
      }
    } catch (error) {
      console.error('Erro na inicialização do aplicativo:', error);
      // Tentar reparar as configurações em caso de erro
      repairSettings();
    }
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