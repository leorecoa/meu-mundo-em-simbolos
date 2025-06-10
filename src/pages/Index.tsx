import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomeScreen } from '@/components/HomeScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { Settings } from '@/components/Settings';
import { CaregiverMode } from '@/components/CaregiverMode';
import { SplashScreen } from '@/components/SplashScreen';
import { TransitionWrapper } from '@/components/TransitionWrapper';
import { BackgroundSymbols } from '@/components/BackgroundSymbols';

type Screen = 'home' | 'category' | 'phrase' | 'settings' | 'caregiver';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showSplash, setShowSplash] = useState(true);
  const [splashShown, setSplashShown] = useState(false);

  // Verificar se a splash já foi mostrada nesta sessão
  if (showSplash && !splashShown) {
    setSplashShown(true);
  }

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
              onNavigateToCaregiver={() => setCurrentScreen('caregiver')}
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
          <TransitionWrapper>
            <PhraseBuilder 
              onBack={() => setCurrentScreen('home')}
            />
          </TransitionWrapper>
        );
      case 'settings':
        return (
          <TransitionWrapper>
            <Settings 
              onBack={() => setCurrentScreen('home')}
            />
          </TransitionWrapper>
        );
      case 'caregiver':
        return (
          <TransitionWrapper>
            <CaregiverMode 
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
              onNavigateToCaregiver={() => setCurrentScreen('caregiver')} 
            />
          </TransitionWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {!showSplash && <BackgroundSymbols />}
      <AnimatePresence mode="wait">
        {showSplash && splashShown ? (
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