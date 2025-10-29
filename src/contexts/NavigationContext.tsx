import React, { createContext, useState, useContext, ReactNode } from 'react';

type Screen = 'home' | 'category' | 'phrase' | 'myat';

interface NavigationContextType {
  currentScreen: Screen;
  selectedCategory: string;
  navigateTo: (screen: Screen, category?: string) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const navigateTo = (screen: Screen, category: string = '') => {
    setCurrentScreen(screen);
    if (screen === 'category') {
      setSelectedCategory(category);
    }
  };

  const goBack = () => {
    // Lógica simples de "voltar" para a home, pode ser expandida no futuro
    setCurrentScreen('home');
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, selectedCategory, navigateTo, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
