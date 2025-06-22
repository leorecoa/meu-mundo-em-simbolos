import { useState, useEffect } from 'react';
import { Settings } from './Settings';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { initializeApp, repairSettings } from '@/lib/initApp';

interface SettingsWrapperProps {
  onBack: () => void;
}

/**
 * Componente wrapper para a tela de configurações
 * Este componente garante que o tema e as configurações sejam carregados corretamente
 */
export const SettingsWrapper = ({ onBack }: SettingsWrapperProps) => {
  const [isReady, setIsReady] = useState(false);
  const { currentTheme, setTheme } = useTheme();
  
  useEffect(() => {
    console.log('SettingsWrapper mounted');
    
    // Tentar inicializar o aplicativo
    try {
      initializeApp();
      
      // Verificar se o tema está carregado corretamente
      if (!currentTheme || !currentTheme.name) {
        console.log('Tema não carregado, definindo tema padrão');
        setTheme('Padrão');
      }
      
      // Marcar componente como pronto após um pequeno delay
      const timer = setTimeout(() => {
        setIsReady(true);
        console.log('SettingsWrapper pronto');
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    } catch (error) {
      console.error('Erro ao inicializar SettingsWrapper:', error);
      
      // Tentar reparar as configurações
      try {
        repairSettings();
        setTheme('Padrão');
        
        // Marcar componente como pronto após um pequeno delay
        const timer = setTimeout(() => {
          setIsReady(true);
        }, 300);
        
        return () => {
          clearTimeout(timer);
        };
      } catch (repairError) {
        console.error('Erro ao reparar configurações:', repairError);
      }
    }
  }, [currentTheme, setTheme]);
  
  // Renderizar tela de carregamento enquanto o componente não estiver pronto
  if (!isReady || !currentTheme || !currentTheme.name) {
    return (
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onBack}
            className="bg-blue-100 hover:bg-blue-200 mr-3"
          >
            <ArrowLeft className="h-5 w-5 text-blue-800" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-800">Configurações</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-blue-800">Carregando configurações...</p>
        </div>
      </div>
    );
  }
  
  // Renderizar o componente Settings quando estiver pronto
  return <Settings onBack={onBack} />;
};