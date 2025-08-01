import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomeScreen } from '@/components/HomeScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { SimpleSettings } from '@/components/SimpleSettings';
import { SplashScreen } from '@/components/SplashScreen';
import { TransitionWrapper } from '@/components/TransitionWrapper';
import { MyATScreen } from '@/components/MyATScreen';

type Screen = 'home' | 'category' | 'phrase' | 'settings' | 'myat';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showSplash, setShowSplash] = useState(true);

  const navigateToCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <TransitionWrapper>
            <HomeScreen 
              onNavigateToCategory={navigateToCategory}
              onNavigateToPhrase={() => setCurrentScreen('phrase')}
              onNavigateToSettings={() => setCurrentScreen('settings')}
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
            <PhraseBuilder 
              onBack={() => setCurrentScreen('home')}
            />
          </TransitionWrapper>
        );
      case 'settings':
        console.log('Renderizando tela de configurações');
        return (
          <TransitionWrapper key="settings-screen">
            <SimpleSettings 
              onBack={() => setCurrentScreen('home')}
            />
          </TransitionWrapper>
        );
        
      case 'myat':
        return (
          <TransitionWrapper key="myat-screen">
            <MyATScreen 
              onBack={() => setCurrentScreen('home')}
            />
          </TransitionWrapper>
        );

      default:
        return (
          <TransitionWrapper>
            <HomeScreen 
              onNavigateToCategory={navigateToCategory} 
              onNavigateToPhrase={() => setCurrentScreen('phrase')} 
              onNavigateToSettings={() => setCurrentScreen('settings')} 
              onNavigateToMyAT={() => setCurrentScreen('myat')}
            />
          </TransitionWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} key="splash" />
        ) : (
          <div key="content" className="w-full h-full">
            {renderCurrentScreen()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;