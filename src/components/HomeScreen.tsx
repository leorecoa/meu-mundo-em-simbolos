import { Heart, Home, Utensils, Gamepad2, Users, Settings, Pause, Volume2, Play, Activity, LineChart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

interface HomeScreenProps {
  onNavigateToCategory: (category: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToMyAT?: () => void;
}

export const HomeScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToSettings, onNavigateToAnalytics, onNavigateToMyAT }: HomeScreenProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(50);
  const { toast } = useToast();
  const { currentTheme } = useTheme();

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "App retomado" : "App pausado",
      description: isPaused ? "Você pode continuar usando o app" : "Tela congelada para evitar toques acidentais",
      duration: 2000,
    });
  };

  const handleVolumeToggle = () => {
    const newVolume = volumeLevel === 0 ? 50 : 0;
    setVolumeLevel(newVolume);
    toast({
      title: newVolume === 0 ? "Som desligado" : "Som ligado",
      description: `Volume ajustado para ${newVolume}%`,
      duration: 2000,
    });
  };

  const handleGenericClick = (action: () => void) => {
    if (isPaused) {
      toast({
        title: "App pausado",
        description: "Clique no botão de pausa para continuar",
        variant: "destructive",
      });
      return;
    }
    action();
  };

  const mainCategories = [
    { id: 'quero', label: 'EU QUERO', icon: Heart, color: 'bg-green-100 hover:bg-green-200', textColor: 'text-green-800' },
    { id: 'sinto', label: 'EU SINTO', icon: Heart, color: 'bg-blue-100 hover:bg-blue-200', textColor: 'text-blue-800' },
    { id: 'preciso', label: 'EU PRECISO', icon: Users, color: 'bg-purple-100 hover:bg-purple-200', textColor: 'text-purple-800' },
  ];

  const subcategories = [
    { id: 'comida', label: 'COMIDA', icon: Utensils, color: 'bg-orange-100 hover:bg-orange-200', textColor: 'text-orange-800' },
    { id: 'brincar', label: 'BRINCAR', icon: Gamepad2, color: 'bg-pink-100 hover:bg-pink-200', textColor: 'text-pink-800' },
    { id: 'casa', label: 'CASA', icon: Home, color: 'bg-indigo-100 hover:bg-indigo-200', textColor: 'text-indigo-800' },
  ];

  return (
    <div className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen ${isPaused ? 'pointer-events-none opacity-75' : ''}`}>
      <div className={`flex justify-between items-center mb-6 ${currentTheme.cardBg} rounded-lg p-3 shadow-sm`}>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className={`${isPaused ? 'bg-red-100 hover:bg-red-200' : 'bg-blue-50 hover:bg-blue-100'} pointer-events-auto`} aria-label={isPaused ? "Retomar" : "Pausar"} onClick={handlePause}>
            {isPaused ? <Play className="h-5 w-5 text-red-800" /> : <Pause className="h-5 w-5 text-blue-800" />}
          </Button>
          <Button variant="outline" size="icon" className={`${volumeLevel === 0 ? 'bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'} pointer-events-auto`} aria-label="Ajustar som" onClick={handleVolumeToggle}>
            <Volume2 className={`h-5 w-5 ${volumeLevel === 0 ? 'text-gray-500' : 'text-blue-800'}`} />
          </Button>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" size="icon" className="bg-green-50 hover:bg-green-100 pointer-events-auto" onClick={() => handleGenericClick(onNavigateToAnalytics)} aria-label="Relatório de Uso">
            <LineChart className="h-5 w-5 text-green-800" />
          </Button>
          <Button variant="outline" size="icon" className="bg-blue-50 hover:bg-blue-100 pointer-events-auto" onClick={() => handleGenericClick(onNavigateToSettings)} aria-label="Configurações">
            <Settings className="h-5 w-5 text-blue-800" />
          </Button>
          {onNavigateToMyAT && (
            <Button variant="outline" size="icon" className="bg-indigo-50 hover:bg-indigo-100 pointer-events-auto" onClick={() => handleGenericClick(onNavigateToMyAT)} aria-label="Meu AT">
              <Activity className="h-5 w-5 text-indigo-800" />
            </Button>
          )}
        </div>
      </div>

      <Button className={`w-full py-6 text-xl font-bold rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor} shadow-md`} onClick={() => handleGenericClick(onNavigateToPhrase)}>
        MONTAR FRASE
      </Button>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Como me comunicar:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mainCategories.map((category) => (
            <Button key={category.id} className={`h-24 text-xl font-bold rounded-xl ${category.color} ${category.textColor} shadow-md flex flex-col items-center justify-center gap-2 p-4`} onClick={() => handleGenericClick(() => onNavigateToCategory(category.id))}>
              <category.icon className="h-8 w-8" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Categorias:</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {subcategories.map((category) => (
            <Card key={category.id} className={`min-w-[140px] h-32 ${category.color} shadow-md rounded-xl flex flex-col items-center justify-center gap-1 p-2 cursor-pointer`} onClick={() => handleGenericClick(() => onNavigateToCategory(category.id))}>
              <category.icon className={`h-10 w-10 ${category.textColor}`} />
              <div className={`text-lg font-bold ${category.textColor}`}>{category.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {onNavigateToMyAT && (
        <Button className="w-full py-4 text-lg font-bold rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 shadow-md flex items-center justify-center gap-2" onClick={() => handleGenericClick(onNavigateToMyAT)}>
          <Activity className="h-6 w-6" />
          MEU ASSISTENTE TERAPÊUTICO
        </Button>
      )}
      
      <div className={`${currentTheme.cardBg} rounded-lg p-4 shadow-sm`}>
        <div className={`text-sm ${currentTheme.textColor} mb-1`}>Você ainda não usou palavras hoje!</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-400 h-4 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
};
