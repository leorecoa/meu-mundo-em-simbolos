import { Heart, Users, Smile, Gamepad2, Settings, LineChart, Home, Activity, Trophy, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

interface HomeScreenProps {
  onNavigateToCategory: (category: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToAnalytics: () => void; 
  onNavigateToMyAT: () => void;
  onNavigateToSettings: () => void; 
  onNavigateToRewards: () => void;
}

const categoryDetails: { [key: string]: { icon: React.ElementType, description: string, gradient: string } } = {
  pessoas: { icon: Users, description: 'Pessoas importantes em sua vida.', gradient: 'from-lime-500 to-green-500' },
  acoes: { icon: Smile, description: 'O que você quer fazer ou sente.', gradient: 'from-rose-500 to-red-500' },
  sentimentos: { icon: Heart, description: 'Expresse seus sentimentos.', gradient: 'from-amber-500 to-orange-500' },
  lugares: { icon: Home, description: 'Lugares que você frequenta.', gradient: 'from-sky-500 to-blue-500' },
  comida: { icon: Utensils, description: 'O que você quer comer ou beber.', gradient: 'from-yellow-500 to-amber-500' },
  geral: { icon: Gamepad2, description: 'Palavras e frases do dia a dia.', gradient: 'from-slate-500 to-gray-500' },
};

export const HomeScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToAnalytics, onNavigateToMyAT, onNavigateToSettings, onNavigateToRewards }: HomeScreenProps) => {
  const { currentTheme } = useTheme();

  return (
    <div id="home-screen-container" className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen`}>
      <div className={`flex justify-between items-center mb-6`}>
        <Button id="recompensas-btn" variant="outline" size="icon" className="bg-yellow-50 hover:bg-yellow-100" onClick={onNavigateToRewards} aria-label="Minhas Recompensas">
            <Trophy className="h-5 w-5 text-yellow-700" />
        </Button>
        <div id="painel-cuidador-btn" className="flex gap-3">
          <Button variant="outline" size="icon" className="bg-green-50 hover:bg-green-100" onClick={onNavigateToAnalytics} aria-label="Relatório de Uso">
            <LineChart className="h-5 w-5 text-green-800" />
          </Button>
          <Button variant="outline" size="icon" className="bg-blue-50 hover:bg-blue-100" onClick={onNavigateToSettings} aria-label="Configurações">
            <Settings className="h-5 w-5 text-blue-800" />
          </Button>
          <Button variant="outline" size="icon" className="bg-indigo-50 hover:bg-indigo-100" onClick={onNavigateToMyAT} aria-label="Meu AT">
            <Activity className="h-5 w-5 text-indigo-800" />
          </Button>
        </div>
      </div>

      <Button id="montar-frase-btn" 
        className={`w-full py-6 text-xl font-bold rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor} shadow-md`}
        onClick={onNavigateToPhrase}
      >
        MONTAR FRASE
      </Button>

      <div id="categorias-grid">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Categorias Principais:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categoryDetails).map(([key, value]) => (
            <Card 
              key={key} 
              className={`h-32 bg-gradient-to-br ${value.gradient} text-white shadow-lg rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition-transform hover:scale-105`}
              onClick={() => onNavigateToCategory(key)}
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
