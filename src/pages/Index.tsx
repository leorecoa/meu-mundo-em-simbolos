
import { useState } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { Settings } from '@/components/Settings';
import { CaregiverMode } from '@/components/CaregiverMode';

type Screen = 'home' | 'category' | 'phrase' | 'settings' | 'caregiver';

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
          <HomeScreen 
            onNavigateToCategory={navigateToCategory}
            onNavigateToPhrase={() => setCurrentScreen('phrase')}
            onNavigateToSettings={() => setCurrentScreen('settings')}
            onNavigateToCaregiver={() => setCurrentScreen('caregiver')}
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
        return (
          <PhraseBuilder 
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'settings':
        return (
          <Settings 
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'caregiver':
        return (
          <CaregiverMode 
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return <HomeScreen onNavigateToCategory={navigateToCategory} onNavigateToPhrase={() => setCurrentScreen('phrase')} onNavigateToSettings={() => setCurrentScreen('settings')} onNavigateToCaregiver={() => setCurrentScreen('caregiver')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
