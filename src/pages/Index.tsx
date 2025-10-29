import { AnimatePresence } from 'framer-motion';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { MyATScreen } from '@/components/MyATScreen';
import { TransitionWrapper } from '@/components/TransitionWrapper';
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';

const AppScreens = () => {
  const { currentScreen, selectedCategory, goBack, navigateTo } = useNavigation();

  switch (currentScreen) {
    case 'category':
      return <TransitionWrapper><CategoryScreen category={selectedCategory} onBack={goBack} onNavigateToPhrase={() => navigateTo('phrase')} /></TransitionWrapper>;
    case 'phrase':
      return <TransitionWrapper><PhraseBuilder onBack={goBack} /></TransitionWrapper>;
    case 'myat':
      return <TransitionWrapper><MyATScreen onBack={goBack} /></TransitionWrapper>;
    case 'home':
    default:
      return <TransitionWrapper><MainCategoriesScreen /></TransitionWrapper>;
  }
};

const Index = () => {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <AnimatePresence mode="wait">
          <AppScreens />
        </AnimatePresence>
      </div>
    </NavigationProvider>
  );
};

export default Index;
