
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Theme {
  name: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  cardBg: string;
  buttonBg: string;
  buttonHover: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
}

// Tema padrão para fallback
const defaultTheme: Theme = {
  name: 'Padrão',
  bgColor: 'bg-blue-50',
  borderColor: 'border-blue-500',
  textColor: 'text-blue-800',
  cardBg: 'bg-white',
  buttonBg: 'bg-blue-100',
  buttonHover: 'hover:bg-blue-200'
};

const themes: Record<string, Theme> = {
  'Padrão': {
    name: 'Padrão',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    cardBg: 'bg-white',
    buttonBg: 'bg-blue-100',
    buttonHover: 'hover:bg-blue-200'
  },
  'Azul suave': {
    name: 'Azul suave',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-700',
    cardBg: 'bg-blue-50',
    buttonBg: 'bg-blue-200',
    buttonHover: 'hover:bg-blue-300'
  },
  'Verde suave': {
    name: 'Verde suave',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    textColor: 'text-green-700',
    cardBg: 'bg-green-50',
    buttonBg: 'bg-green-200',
    buttonHover: 'hover:bg-green-300'
  },
  'Alto contraste': {
    name: 'Alto contraste',
    bgColor: 'bg-gray-900',
    borderColor: 'border-gray-800',
    textColor: 'text-white',
    cardBg: 'bg-gray-800',
    buttonBg: 'bg-gray-700',
    buttonHover: 'hover:bg-gray-600'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Carregar tema salvo do localStorage ou usar o padrão
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme && themes[savedTheme]) {
        return themes[savedTheme];
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
    return defaultTheme;
  });

  // Garantir que o tema seja carregado corretamente na inicialização
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme && themes[savedTheme] && currentTheme.name !== savedTheme) {
        setCurrentTheme(themes[savedTheme]);
      }
    } catch (error) {
      console.error('Erro ao carregar tema na inicialização:', error);
    }
  }, []);

  const setTheme = (themeName: string) => {
    console.log('Alterando tema para:', themeName);
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
      // Salvar tema no localStorage
      try {
        localStorage.setItem('app-theme', themeName);
      } catch (error) {
        console.error('Erro ao salvar tema:', error);
      }
    } else {
      console.error('Tema não encontrado:', themeName);
      // Usar tema padrão se o tema solicitado não existir
      setCurrentTheme(defaultTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
