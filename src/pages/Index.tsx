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

  switch (currentScreen) {
    case 'home':
      return (
        <MainCategoriesScreen 
          onNavigateToCategory={navigateToCategory}
          onNavigateToPhrase={() => setCurrentScreen('phrase')}
          onNavigateToMyAT={() => setCurrentScreen('myat')}
        />
      );
    case 'category':
      return (
        <CategoryScreen 
          category={selectedCategory}
          onBack={() => setCurrentScreen('home')}
          onNavigateToPhrase={() => setCurrentScreen('phrase')}
        />
      );
    case 'phrase':
      return <PhraseBuilder onBack={() => setCurrentScreen('home')} />;
    case 'myat':
      return <MyATScreen onBack={() => setCurrentScreen('home')} />;
    default:
      return <div>Tela não encontrada</div>;
  }
};

export default Index;
