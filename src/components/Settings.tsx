import { ChevronLeft, Sun, Volume, ZoomIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { getSettings, saveSettings, UserSettings } from '@/lib/storage';
import { useMutation } from '@tanstack/react-query';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { toast } = useToast();
  const { currentTheme, setTheme } = useTheme();
  
  // Estado para configurações
  const [settings, setSettings] = useState<UserSettings>({
    voiceType: 'feminina',
    voiceSpeed: 50,
    iconSize: 50,
    useAudioFeedback: true,
    theme: 'Padrão',
    largeIcons: false
  });
  
  // Carregar configurações ao montar
  useEffect(() => {
    const storedSettings = getSettings();
    setSettings(storedSettings);
    setTheme(storedSettings.theme);
  }, [setTheme]);
  
  // Mutação para salvar configurações
  const settingsMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas",
        duration: 2000,
      });
    }
  });
  
  // Atualizar configuração específica
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    settingsMutation.mutate(newSettings);
    
    // Aplicar tema imediatamente se for alterado
    if (key === 'theme') {
      setTheme(value as string);
    }
    
    // Aplicar tamanho de ícones imediatamente
    if (key === 'largeIcons') {
      document.documentElement.classList.toggle('large-icons', value as boolean);
    }
  };

  const themes = [
    { name: 'Padrão', bgColor: 'bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-800' },
    { name: 'Azul suave', bgColor: 'bg-blue-100', borderColor: 'border-blue-400', textColor: 'text-blue-700' },
    { name: 'Verde suave', bgColor: 'bg-green-100', borderColor: 'border-green-400', textColor: 'text-green-700' },
    { name: 'Alto contraste', bgColor: 'bg-gray-900', borderColor: 'border-gray-800', textColor: 'text-white' },
  ];

  // Testar configurações de voz
  const testVoice = () => {
    if ('speechSynthesis' in window) {
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance("Olá, esta é uma mensagem de teste");
      utterance.lang = 'pt-BR';
      utterance.rate = settings.voiceSpeed / 50; // Converter de 0-100 para aproximadamente 0-2
      
      // Tentar encontrar uma voz em português
      const voices = window.speechSynthesis.getVoices();
      const ptVoices = voices.filter(voice => 
        voice.lang.includes('pt') || voice.lang.includes('PT')
      );
      
      if (ptVoices.length > 0) {
        // Tentar encontrar voz que corresponda ao tipo preferido
        let selectedVoice = ptVoices[0];
        
        if (settings.voiceType === 'feminina') {
          const femaleVoice = ptVoices.find(voice => 
            !voice.name.includes('Male') && 
            !voice.name.includes('Masculino')
          );
          if (femaleVoice) selectedVoice = femaleVoice;
        } else if (settings.voiceType === 'masculina') {
          const maleVoice = ptVoices.find(voice => 
            voice.name.includes('Male') || 
            voice.name.includes('Masculino')
          );
          if (maleVoice) selectedVoice = maleVoice;
        }
        
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      
      toast({
        title: "Testando voz",
        description: `Tipo: ${settings.voiceType}, Velocidade: ${settings.voiceSpeed}%`,
      });
    }
  };

  return (
    <div className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen`}>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className={`flex items-center gap-1 ${currentTheme.textColor}`}
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className={`text-xl font-bold text-center flex-1 mr-10 ${currentTheme.textColor}`}>CONFIGURAÇÕES</h1>
      </div>

      <Card className={`p-5 space-y-6 ${currentTheme.cardBg}`}>
        {/* Configurações de Interface */}
        <div>
          <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-4 flex items-center gap-2`}>
            <Sun className="h-5 w-5" />
            Aparência
          </h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="large-icons" className="text-base font-medium">Ícones grandes</Label>
                <p className="text-sm text-gray-500">Aumentar o tamanho dos ícones em 200%</p>
              </div>
              <Switch 
                id="large-icons" 
                checked={settings.largeIcons}
                onCheckedChange={(checked) => updateSetting('largeIcons', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="icon-size" className="text-base font-medium">Tamanho dos ícones</Label>
              <div className="flex gap-2 items-center mt-2">
                <ZoomIn className="h-4 w-4" />
                <Slider 
                  id="icon-size" 
                  value={[settings.iconSize]} 
                  max={100} 
                  step={10} 
                  className="flex-1"
                  onValueChange={(value) => updateSetting('iconSize', value[0])}
                />
                <ZoomIn className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Voz */}
        <div>
          <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-4 flex items-center gap-2`}>
            <Volume className="h-5 w-5" />
            Voz
          </h2>
          
          <div className="space-y-5">
            <div>
              <Label className="text-base font-medium mb-2 block">Tipo de voz</Label>
              <RadioGroup 
                value={settings.voiceType} 
                onValueChange={(value) => updateSetting('voiceType', value as 'feminina' | 'masculina' | 'infantil')}
                className="flex flex-col space-y-2"
              >
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={testVoice}
              >
                Testar voz
              </Button>
            </div>
            
            <div>
              <Label htmlFor="voice-speed" className="text-base font-medium">Velocidade da voz</Label>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-sm">Lenta</span>
                <Slider 
                  id="voice-speed" 
                  value={[settings.voiceSpeed]} 
                  max={100} 
                  step={10} 
                  className="flex-1"
                  onValueChange={(value) => updateSetting('voiceSpeed', value[0])}
                />
                <span className="text-sm">Rápida</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="audio-feedback" className="text-base font-medium">Feedback sonoro</Label>
                <p className="text-sm text-gray-500">Som ao selecionar ícones</p>
              </div>
              <Switch 
                id="audio-feedback" 
                checked={settings.useAudioFeedback}
                onCheckedChange={(checked) => updateSetting('useAudioFeedback', checked)}
              />
            </div>
          </div>
        </div>

        {/* Configurações de Tema */}
        <div>
          <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-4`}>Tema de cores</h2>
          <div className="flex flex-wrap gap-3">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => updateSetting('theme', theme.name)}
                className={`px-4 py-2 rounded-lg cursor-pointer border-2 transition-all hover:shadow-md
                  ${settings.theme === theme.name 
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