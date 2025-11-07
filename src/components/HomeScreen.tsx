import { Heart, Users, Smile, Gamepad2, Settings, LineChart, Home, Activity, Trophy, Utensils, GraduationCap, Dog } from 'lucide-react';
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

const categoryDetails: { [key: string]: { icon: React.ElementType, description: string, gradient: string, shadow: string } } = {
  quero: { icon: Heart, description: 'O que você quer fazer.', gradient: 'from-sky-400 via-cyan-500 to-blue-600', shadow: 'shadow-xl shadow-sky-200/50' },
  sinto: { icon: Smile, description: 'Como você se sente.', gradient: 'from-emerald-400 via-teal-500 to-green-600', shadow: 'shadow-xl shadow-emerald-200/50' },
  preciso: { icon: Users, description: 'O que você precisa.', gradient: 'from-rose-400 via-pink-500 to-red-500', shadow: 'shadow-xl shadow-rose-200/50' },
  comida: { icon: Utensils, description: 'Comidas e bebidas.', gradient: 'from-amber-400 via-orange-500 to-yellow-600', shadow: 'shadow-xl shadow-amber-200/50' },
  brincar: { icon: Gamepad2, description: 'Brincadeiras e diversão.', gradient: 'from-orange-400 via-amber-500 to-yellow-500', shadow: 'shadow-xl shadow-orange-200/50' },
  casa: { icon: Home, description: 'Lugares da casa.', gradient: 'from-slate-400 via-gray-500 to-zinc-600', shadow: 'shadow-xl shadow-slate-200/50' },
  escola: { icon: GraduationCap, description: 'Materiais e rotina escolar.', gradient: 'from-blue-400 via-indigo-500 to-blue-600', shadow: 'shadow-xl shadow-blue-200/50' },
  familia: { icon: Heart, description: 'Membros da família.', gradient: 'from-pink-400 via-rose-500 to-red-600', shadow: 'shadow-xl shadow-pink-200/50' },
  animais: { icon: Dog, description: 'Animais e pets.', gradient: 'from-green-400 via-lime-500 to-emerald-600', shadow: 'shadow-xl shadow-green-200/50' },
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
              className={`h-32 bg-gradient-to-br ${value.gradient} text-white ${value.shadow} rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all hover:scale-105 hover:shadow-2xl`}
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
