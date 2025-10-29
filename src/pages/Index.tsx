import { useState } from 'react';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { MyATScreen } from '@/components/MyATScreen';

type Screen = 'home' | 'category' | 'phrase' | 'myat';

const Index = () => {
  // Força o aplicativo a abrir diretamente no Formador de Frases.
  const [currentScreen, setCurrentScreen] = useState<Screen>('phrase'); 
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const navigateToCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  // A função de "voltar" agora levará para o formador de frases como tela principal temporária.
  const navigateHome = () => setCurrentScreen('phrase');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'category':
        return <CategoryScreen category={selectedCategory} onBack={navigateHome} onNavigateToPhrase={() => setCurrentScreen('phrase')} />;
      case 'myat':
        return <MyATScreen onBack={navigateHome} />;
      case 'phrase':
      default:
        return <PhraseBuilder onBack={() => alert("Já está na tela principal.")} />;
    }
  }

  return renderScreen();
};

export default Index;
