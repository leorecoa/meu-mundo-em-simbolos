
import { ArrowLeft, Palette, Volume2, Type, Accessibility, Coins } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { FiveCoinSystem } from '@/components/FiveCoinSystem';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { currentTheme, setTheme } = useTheme();
  const [currentCoins, setCurrentCoins] = useState(() => {
    const saved = localStorage.getItem('fivecoins');
    return saved ? parseInt(saved) : 0;
  });

  const handleCoinsChange = (newAmount: number) => {
    setCurrentCoins(newAmount);
    localStorage.setItem('fivecoins', newAmount.toString());
  };

  const themes = [
    { name: 'Padrão', preview: 'bg-blue-100' },
    { name: 'Azul suave', preview: 'bg-blue-200' },
    { name: 'Verde suave', preview: 'bg-green-200' },
    { name: 'Alto contraste', preview: 'bg-gray-800' }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bgColor} p-4`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className={`${currentTheme.buttonBg} ${currentTheme.buttonHover} mr-3`}
        >
          <ArrowLeft className={`h-5 w-5 ${currentTheme.textColor}`} />
        </Button>
        <h1 className={`text-2xl font-bold ${currentTheme.textColor}`}>Configurações</h1>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* FiveCoin System */}
        <Card className={`${currentTheme.cardBg} p-6`}>
          <div className="flex items-center mb-4">
            <Coins className={`h-6 w-6 ${currentTheme.textColor} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor}`}>Sistema FiveCoin</h2>
          </div>
          <FiveCoinSystem 
            currentCoins={currentCoins}
            onCoinsChange={handleCoinsChange}
          />
        </Card>

        {/* Temas de cores */}
        <Card className={`${currentTheme.cardBg} p-6`}>
          <div className="flex items-center mb-4">
            <Palette className={`h-6 w-6 ${currentTheme.textColor} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor}`}>Tema de cores</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.name}
                variant={currentTheme.name === theme.name ? "default" : "outline"}
                className={`h-16 flex flex-col items-center justify-center ${
                  currentTheme.name === theme.name 
                    ? 'bg-blue-500 text-white' 
                    : `${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`
                }`}
                onClick={() => setTheme(theme.name)}
              >
                <div className={`w-6 h-6 rounded-full ${theme.preview} mb-1`}></div>
                <span className="text-sm">{theme.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Volume */}
        <Card className={`${currentTheme.cardBg} p-6`}>
          <div className="flex items-center mb-4">
            <Volume2 className={`h-6 w-6 ${currentTheme.textColor} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor}`}>Volume</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              Volume alto
            </Button>
            <Button variant="outline" className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              Volume médio
            </Button>
            <Button variant="outline" className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              Volume baixo
            </Button>
          </div>
        </Card>

        {/* Tamanho da fonte */}
        <Card className={`${currentTheme.cardBg} p-6`}>
          <div className="flex items-center mb-4">
            <Type className={`h-6 w-6 ${currentTheme.textColor} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor}`}>Tamanho da fonte</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              <span className="text-lg">Fonte grande</span>
            </Button>
            <Button variant="outline" className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              <span className="text-base">Fonte média</span>
            </Button>
            <Button variant="outline" className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              <span className="text-sm">Fonte pequena</span>
            </Button>
          </div>
        </Card>

        {/* Acessibilidade */}
        <Card className={`${currentTheme.cardBg} p-6`}>
          <div className="flex items-center mb-4">
            <Accessibility className={`h-6 w-6 ${currentTheme.textColor} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor}`}>Acessibilidade</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className={`w-full justify-start ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              Modo de alto contraste
            </Button>
            <Button variant="outline" className={`w-full justify-start ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              Confirmação dupla para ações
            </Button>
            <Button variant="outline" className={`w-full justify-start ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor}`}>
              Vibração ao tocar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
