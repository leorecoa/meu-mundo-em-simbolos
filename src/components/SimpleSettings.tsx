import { ArrowLeft, Palette, Volume2, Type, Accessibility, Check, VolumeX, Volume1, Volume2 as VolumeIcon, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { applyLanguage, getCurrentLanguage, commonLanguages } from '@/lib/simpleLanguage';

interface SimpleSettingsProps {
  onBack: () => void;
}

export const SimpleSettings = ({ onBack }: SimpleSettingsProps) => {
  const { toast } = useToast();
  const [activeVolume, setActiveVolume] = useState<'alto' | 'médio' | 'baixo'>('médio');
  const [activeFontSize, setActiveFontSize] = useState<'grande' | 'médio' | 'pequeno'>('médio');
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    doubleConfirmation: false,
    vibration: false
  });
  const [selectedLanguage, setSelectedLanguage] = useState<string>(getCurrentLanguage());
  const [activeTheme, setActiveTheme] = useState('Padrão');
  
  // Carregar configurações ao montar o componente
  useEffect(() => {
    // Carregar idioma atual
    setSelectedLanguage(getCurrentLanguage());
    
    // Carregar tema atual
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setActiveTheme(savedTheme);
    }
    
    // Carregar configurações de volume
    try {
      const savedVolume = localStorage.getItem('app-volume');
      if (savedVolume === 'alto' || savedVolume === 'médio' || savedVolume === 'baixo') {
        setActiveVolume(savedVolume);
      }
    } catch (error) {
      console.error('Erro ao carregar volume:', error);
    }
    
    // Carregar configurações de tamanho de fonte
    try {
      const savedFontSize = localStorage.getItem('app-font-size');
      if (savedFontSize === 'grande' || savedFontSize === 'médio' || savedFontSize === 'pequeno') {
        setActiveFontSize(savedFontSize);
      }
    } catch (error) {
      console.error('Erro ao carregar tamanho de fonte:', error);
    }
  }, []);

  // Temas disponíveis
  const themes = [
    { name: 'Padrão', preview: 'bg-blue-100' },
    { name: 'Azul suave', preview: 'bg-blue-200' },
    { name: 'Verde suave', preview: 'bg-green-200' },
    { name: 'Alto contraste', preview: 'bg-gray-800' }
  ];

  // Idiomas disponíveis
  const languages = commonLanguages;

  // Funções de manipulação
  const handleVolumeChange = (volume: 'alto' | 'médio' | 'baixo') => {
    setActiveVolume(volume);
    
    // Salvar configuração no localStorage
    try {
      localStorage.setItem('app-volume', volume);
    } catch (error) {
      console.error('Erro ao salvar volume:', error);
    }
    
    toast({
      title: "Volume alterado",
      description: `O volume foi definido como ${volume}.`,
      duration: 2000,
    });
  };

  const handleFontSizeChange = (fontSize: 'grande' | 'médio' | 'pequeno') => {
    setActiveFontSize(fontSize);
    
    // Salvar configuração no localStorage
    try {
      localStorage.setItem('app-font-size', fontSize);
      
      // Aplicar tamanho da fonte ao documento
      const fontSizeValues = {
        'grande': '1.2rem',
        'médio': '1rem',
        'pequeno': '0.875rem'
      };
      document.documentElement.style.setProperty('--base-font-size', fontSizeValues[fontSize]);
    } catch (error) {
      console.error('Erro ao salvar tamanho da fonte:', error);
    }
    
    toast({
      title: "Tamanho da fonte alterado",
      description: `O tamanho da fonte foi definido como ${fontSize}.`,
      duration: 2000,
    });
  };

  const handleAccessibilityChange = (setting: 'highContrast' | 'doubleConfirmation' | 'vibration', value: boolean) => {
    const newSettings = {
      ...accessibilitySettings,
      [setting]: value
    };
    
    setAccessibilitySettings(newSettings);
    
    // Salvar configuração no localStorage
    try {
      localStorage.setItem('app-accessibility', JSON.stringify(newSettings));
      
      // Aplicar configurações de acessibilidade
      if (setting === 'highContrast') {
        if (value) {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de acessibilidade:', error);
    }
    
    toast({
      title: "Configuração alterada",
      description: `${setting === 'highContrast' ? 'Modo de alto contraste' : 
                    setting === 'doubleConfirmation' ? 'Confirmação dupla' : 
                    'Vibração ao tocar'} ${value ? 'ativado' : 'desativado'}.`,
      duration: 2000,
    });
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    
    // Aplicar configurações de idioma
    applyLanguage(language);
    
    toast({
      title: "Idioma alterado",
      description: `O idioma da voz foi alterado para ${languages.find(l => l.code === language)?.name || language}.`,
      duration: 2000,
    });
  };

  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme);
    
    // Salvar configuração no localStorage
    try {
      localStorage.setItem('app-theme', theme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
    
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${theme}.`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className="bg-blue-100 hover:bg-blue-200 mr-3"
        >
          <ArrowLeft className="h-5 w-5 text-blue-800" />
        </Button>
        <h1 className="text-2xl font-bold text-blue-800">Configurações</h1>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Temas de cores */}
        <Card className="bg-white p-6">
          <div className="flex items-center mb-4">
            <Palette className="h-6 w-6 text-blue-800 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">Tema de cores</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.name}
                variant={activeTheme === theme.name ? "default" : "outline"}
                className={`h-16 flex flex-col items-center justify-center ${
                  activeTheme === theme.name 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
                onClick={() => handleThemeChange(theme.name)}
              >
                <div className={`w-6 h-6 rounded-full ${theme.preview} mb-1`}></div>
                <span className="text-sm">{theme.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Volume */}
        <Card className="bg-white p-6">
          <div className="flex items-center mb-4">
            <Volume2 className="h-6 w-6 text-blue-800 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">Volume</h2>
          </div>
          <div className="space-y-3">
            <Button 
              variant={activeVolume === 'alto' ? "default" : "outline"} 
              className={`w-full ${activeVolume === 'alto' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              onClick={() => handleVolumeChange('alto')}
            >
              <VolumeIcon className="w-4 h-4 mr-2" />
              Volume alto
              {activeVolume === 'alto' && <Check className="w-4 h-4 ml-2" />}
            </Button>
            <Button 
              variant={activeVolume === 'médio' ? "default" : "outline"} 
              className={`w-full ${activeVolume === 'médio' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              onClick={() => handleVolumeChange('médio')}
            >
              <Volume1 className="w-4 h-4 mr-2" />
              Volume médio
              {activeVolume === 'médio' && <Check className="w-4 h-4 ml-2" />}
            </Button>
            <Button 
              variant={activeVolume === 'baixo' ? "default" : "outline"} 
              className={`w-full ${activeVolume === 'baixo' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              onClick={() => handleVolumeChange('baixo')}
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Volume baixo
              {activeVolume === 'baixo' && <Check className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </Card>

        {/* Tamanho da fonte */}
        <Card className="bg-white p-6">
          <div className="flex items-center mb-4">
            <Type className="h-6 w-6 text-blue-800 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">Tamanho da fonte</h2>
          </div>
          <div className="space-y-3">
            <Button 
              variant={activeFontSize === 'grande' ? "default" : "outline"} 
              className={`w-full ${activeFontSize === 'grande' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              onClick={() => handleFontSizeChange('grande')}
            >
              <span className="text-lg">Fonte grande</span>
              {activeFontSize === 'grande' && <Check className="w-4 h-4 ml-2" />}
            </Button>
            <Button 
              variant={activeFontSize === 'médio' ? "default" : "outline"} 
              className={`w-full ${activeFontSize === 'médio' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              onClick={() => handleFontSizeChange('médio')}
            >
              <span className="text-base">Fonte média</span>
              {activeFontSize === 'médio' && <Check className="w-4 h-4 ml-2" />}
            </Button>
            <Button 
              variant={activeFontSize === 'pequeno' ? "default" : "outline"} 
              className={`w-full ${activeFontSize === 'pequeno' ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              onClick={() => handleFontSizeChange('pequeno')}
            >
              <span className="text-sm">Fonte pequena</span>
              {activeFontSize === 'pequeno' && <Check className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </Card>

        {/* Idioma */}
        <Card className="bg-white p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-blue-800 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">Idioma da voz</h2>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full mb-3"
              onClick={() => {
                toast({
                  title: "Teste de voz",
                  description: `Testando voz em ${languages.find(l => l.code === selectedLanguage)?.name || selectedLanguage}`,
                  duration: 2000,
                });
              }}
            >
              Testar voz selecionada
            </Button>
            
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
              {languages.map((language) => (
                <Button
                  key={language.code}
                  variant={selectedLanguage === language.code ? "default" : "outline"}
                  className={`w-full text-left justify-start ${selectedLanguage === language.code ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language.name}
                  {selectedLanguage === language.code && <Check className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Acessibilidade */}
        <Card className="bg-white p-6">
          <div className="flex items-center mb-4">
            <Accessibility className="h-6 w-6 text-blue-800 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">Acessibilidade</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
              <div>
                <p className="font-medium text-blue-800">Modo de alto contraste</p>
                <p className="text-sm text-slate-500">Aumenta o contraste para melhor visibilidade</p>
              </div>
              <Switch 
                checked={accessibilitySettings.highContrast}
                onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
              <div>
                <p className="font-medium text-blue-800">Confirmação dupla para ações</p>
                <p className="text-sm text-slate-500">Solicita confirmação antes de ações importantes</p>
              </div>
              <Switch 
                checked={accessibilitySettings.doubleConfirmation}
                onCheckedChange={(checked) => handleAccessibilityChange('doubleConfirmation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
              <div>
                <p className="font-medium text-blue-800">Vibração ao tocar</p>
                <p className="text-sm text-slate-500">Vibra ao interagir com elementos</p>
              </div>
              <Switch 
                checked={accessibilitySettings.vibration}
                onCheckedChange={(checked) => handleAccessibilityChange('vibration', checked)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};