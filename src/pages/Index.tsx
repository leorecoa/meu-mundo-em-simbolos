import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { MyATScreen } from '@/components/MyATScreen';
import { TransitionWrapper } from '@/components/TransitionWrapper';

type Screen = 'home' | 'category' | 'phrase' | 'myat';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const navigateToCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <TransitionWrapper>
            <MainCategoriesScreen 
              onNavigateToCategory={navigateToCategory}
              onNavigateToPhrase={() => setCurrentScreen('phrase')}
              onNavigateToMyAT={() => setCurrentScreen('myat')}
            />
          </TransitionWrapper>
        );
      case 'category':
        return (
          <TransitionWrapper>
            <CategoryScreen 
              category={selectedCategory}
              onBack={() => setCurrentScreen('home')}
              onNavigateToPhrase={() => setCurrentScreen('phrase')}
            />
          </TransitionWrapper>
        );
      case 'phrase':
        return (
          <TransitionWrapper key="phrase-builder">
            <PhraseBuilder onBack={() => setCurrentScreen('home')} />
          </TransitionWrapper>
        );
      case 'myat':
        return (
          <TransitionWrapper key="myat-screen">
            <MyATScreen onBack={() => setCurrentScreen('home')} />
          </TransitionWrapper>
        );
      default:
        return <div />; 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {renderCurrentScreen()}
      </AnimatePresence>
    </div>
  );
};

export default Index;
