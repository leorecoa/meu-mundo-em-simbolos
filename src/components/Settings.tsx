
import { ChevronLeft, Sun, Volume, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const [selectedTheme, setSelectedTheme] = useState('Padrão');
  const { toast } = useToast();

  const themes = [
    { name: 'Padrão', bgColor: 'bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-800' },
    { name: 'Azul suave', bgColor: 'bg-blue-100', borderColor: 'border-blue-400', textColor: 'text-blue-700' },
    { name: 'Verde suave', bgColor: 'bg-green-100', borderColor: 'border-green-400', textColor: 'text-green-700' },
    { name: 'Alto contraste', bgColor: 'bg-gray-900', borderColor: 'border-gray-800', textColor: 'text-white' },
  ];

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
    toast({
      title: "Tema alterado",
      description: `Tema ${themeName} foi aplicado`,
      duration: 2000,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-blue-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 mr-10">CONFIGURAÇÕES</h1>
      </div>

      <Card className="p-5 space-y-6 bg-white">
        {/* Nota para desenvolvedores */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-5">
          <p className="text-sm text-yellow-700">
            <strong>Nota:</strong> Esta tela permite personalizar a experiência do usuário.
            As configurações de acessibilidade são essenciais para adequação às necessidades individuais.
          </p>
        </div>

        {/* Configurações de Interface */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Aparência
          </h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="large-icons" className="text-base font-medium">Ícones grandes</Label>
                <p className="text-sm text-gray-500">Aumentar o tamanho dos ícones em 200%</p>
              </div>
              <Switch id="large-icons" />
            </div>
            
            <div>
              <Label htmlFor="icon-size" className="text-base font-medium">Tamanho dos ícones</Label>
              <div className="flex gap-2 items-center mt-2">
                <ZoomIn className="h-4 w-4" />
                <Slider id="icon-size" defaultValue={[50]} max={100} step={10} className="flex-1" />
                <ZoomIn className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Voz */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Volume className="h-5 w-5" />
            Voz
          </h2>
          
          <div className="space-y-5">
            <div>
              <Label className="text-base font-medium mb-2 block">Tipo de voz</Label>
              <RadioGroup defaultValue="feminina" className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feminina" id="feminina" />
                  <Label htmlFor="feminina" className="font-normal">Feminina</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculina" id="masculina" />
                  <Label htmlFor="masculina" className="font-normal">Masculina</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="infantil" id="infantil" />
                  <Label htmlFor="infantil" className="font-normal">Infantil</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="voice-speed" className="text-base font-medium">Velocidade da voz</Label>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-sm">Lenta</span>
                <Slider id="voice-speed" defaultValue={[50]} max={100} step={10} className="flex-1" />
                <span className="text-sm">Rápida</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="audio-feedback" className="text-base font-medium">Feedback sonoro</Label>
                <p className="text-sm text-gray-500">Som ao selecionar ícones</p>
              </div>
              <Switch id="audio-feedback" />
            </div>
          </div>
        </div>

        {/* Configurações de Tema */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Tema de cores</h2>
          <div className="flex flex-wrap gap-3">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`px-4 py-2 rounded-lg cursor-pointer border-2 transition-all hover:shadow-md
                  ${selectedTheme === theme.name 
                    ? `${theme.borderColor} ${theme.bgColor} ${theme.textColor} font-semibold` 
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
