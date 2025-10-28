import { useState } from 'react';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { MyATScreen } from '@/components/MyATScreen';

type Screen = 'home' | 'category' | 'phrase' | 'myat';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const navigateToCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  const navigateHome = () => setCurrentScreen('home');

  switch (currentScreen) {
    case 'category':
      return <CategoryScreen category={selectedCategory} onBack={navigateHome} onNavigateToPhrase={() => setCurrentScreen('phrase')} />;
    case 'phrase':
      return <PhraseBuilder onBack={navigateHome} />;
    case 'myat':
      return <MyATScreen onBack={navigateHome} />;
    case 'home':
    default: // <<< A CORREÇÃO. SEMPRE TENTE RENDERIZAR A TELA PRINCIPAL.
      return (
        <MainCategoriesScreen 
          onNavigateToCategory={navigateToCategory}
          onNavigateToPhrase={() => setCurrentScreen('phrase')}
          onNavigateToMyAT={() => setCurrentScreen('myat')}
        />
      );
  }
};

export default Index;
