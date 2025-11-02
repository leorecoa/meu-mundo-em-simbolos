import { Heart, Users, Utensils, Gamepad2, Settings, LineChart, Home, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

interface MainCategoriesScreenProps {
  onNavigateToCategory: (category: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToAnalytics: () => void; 
  onNavigateToMyAT: () => void;
}

const categoryDetails: { [key: string]: { icon: React.ElementType, description: string, gradient: string } } = {
  pessoas: { icon: Users, description: 'Pessoas importantes em sua vida.', gradient: 'from-lime-500 to-green-500' },
  acoes: { icon: Heart, description: 'O que você quer fazer ou sente.', gradient: 'from-rose-500 to-red-500' },
  sentimentos: { icon: Utensils, description: 'Expresse seus sentimentos.', gradient: 'from-amber-500 to-orange-500' },
  lugares: { icon: Home, description: 'Lugares que você frequenta.', gradient: 'from-sky-500 to-blue-500' },
  comida: { icon: Utensils, description: 'O que você quer comer ou beber.', gradient: 'from-yellow-500 to-amber-500' },
  geral: { icon: Gamepad2, description: 'Palavras e frases do dia a dia.', gradient: 'from-slate-500 to-gray-500' },
};


export const MainCategoriesScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToAnalytics, onNavigateToMyAT }: MainCategoriesScreenProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentTheme } = useTheme();

  const handleCategoryClick = (categoryId: string) => {
    onNavigateToCategory(categoryId);
  };

  const handlePhraseClick = () => {
    onNavigateToPhrase();
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes');
  };
  
  return (
    <div className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen`}>
      <div className={`flex justify-end items-center mb-6`}>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="bg-green-50 hover:bg-green-100" onClick={onNavigateToAnalytics} aria-label="Relatório de Uso">
            <LineChart className="h-5 w-5 text-green-800" />
          </Button>
          <Button variant="outline" size="icon" className="bg-blue-50 hover:bg-blue-100" onClick={handleSettingsClick} aria-label="Configurações">
            <Settings className="h-5 w-5 text-blue-800" />
          </Button>
          <Button variant="outline" size="icon" className="bg-indigo-50 hover:bg-indigo-100" onClick={onNavigateToMyAT} aria-label="Meu AT">
            <Activity className="h-5 w-5 text-indigo-800" />
          </Button>
        </div>
      </div>

      <Button 
        className={`w-full py-6 text-xl font-bold rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor} shadow-md`}
        onClick={handlePhraseClick}
      >
        MONTAR FRASE
      </Button>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Categorias Principais:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categoryDetails).map(([key, value]) => (
            <Card 
              key={key} 
              className={`h-32 bg-gradient-to-br ${value.gradient} text-white shadow-lg rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition-transform hover:scale-105`}
              onClick={() => handleCategoryClick(key)}
            >
              <value.icon className="h-10 w-10" />
              <div className="text-lg font-bold text-center">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};
