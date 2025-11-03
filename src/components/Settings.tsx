
import { ArrowLeft, Palette, Volume2, Type, Accessibility, Check, VolumeX, Volume1, Volume2 as VolumeIcon, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { getAppSettings, applyVolumeSettings, applyFontSizeSettings, applyAccessibilitySettings } from '@/lib/appSettings';
import { useSpeech } from '@/hooks/use-speech';
import { db } from '@/lib/db';
import { commonLanguages } from '@/lib/commonLanguages';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';

interface SettingsProps {
  onBack: () => void;
}

// Componente para botões de volume
const VolumeButtons = ({ currentTheme }: { currentTheme: any }) => {
  const { toast } = useToast();
  const [activeVolume, setActiveVolume] = useState<'alto' | 'médio' | 'baixo'>('médio');
  
  useEffect(() => {
    try {
      const settings = getAppSettings();
      setActiveVolume(settings.volume);
    } catch (error) {
      console.error('Erro ao carregar configurações de volume:', error);
    }
  }, []);
  
  const handleVolumeChange = (volume: 'alto' | 'médio' | 'baixo') => {
    setActiveVolume(volume);
    try {
      applyVolumeSettings(volume);
      
      toast({
        title: "Volume alterado",
        description: `O volume foi definido como ${volume}.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao aplicar configurações de volume:', error);
    }
  };
  
  // Garantir que o tema tenha valores padrão
  const buttonBg = currentTheme?.buttonBg || 'bg-blue-100';
  const buttonHover = currentTheme?.buttonHover || 'hover:bg-blue-200';
  const textColor = currentTheme?.textColor || 'text-blue-800';
  
  return (
    <>
      <Button 
        variant={activeVolume === 'alto' ? "default" : "outline"} 
        className={`w-full ${activeVolume === 'alto' ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
        onClick={() => handleVolumeChange('alto')}
      >
        <VolumeIcon className="w-4 h-4 mr-2" />
        Volume alto
        {activeVolume === 'alto' && <Check className="w-4 h-4 ml-2" />}
      </Button>
      <Button 
        variant={activeVolume === 'médio' ? "default" : "outline"} 
        className={`w-full ${activeVolume === 'médio' ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
        onClick={() => handleVolumeChange('médio')}
      >
        <Volume1 className="w-4 h-4 mr-2" />
        Volume médio
        {activeVolume === 'médio' && <Check className="w-4 h-4 ml-2" />}
      </Button>
      <Button 
        variant={activeVolume === 'baixo' ? "default" : "outline"} 
        className={`w-full ${activeVolume === 'baixo' ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
        onClick={() => handleVolumeChange('baixo')}
      >
        <VolumeX className="w-4 h-4 mr-2" />
        Volume baixo
        {activeVolume === 'baixo' && <Check className="w-4 h-4 ml-2" />}
      </Button>
    </>
  );
};

// Componente para botões de tamanho da fonte
const FontSizeButtons = ({ currentTheme }: { currentTheme: any }) => {
  const { toast } = useToast();
  const [activeFontSize, setActiveFontSize] = useState<'grande' | 'médio' | 'pequeno'>('médio');
  
  useEffect(() => {
    try {
      const settings = getAppSettings();
      setActiveFontSize(settings.fontSize);
    } catch (error) {
      console.error('Erro ao carregar configurações de tamanho de fonte:', error);
    }
  }, []);
  
  const handleFontSizeChange = (fontSize: 'grande' | 'médio' | 'pequeno') => {
    setActiveFontSize(fontSize);
    try {
      applyFontSizeSettings(fontSize);
      
      toast({
        title: "Tamanho da fonte alterado",
        description: `O tamanho da fonte foi definido como ${fontSize}.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao aplicar configurações de tamanho de fonte:', error);
    }
  };
  
  // Garantir que o tema tenha valores padrão
  const buttonBg = currentTheme?.buttonBg || 'bg-blue-100';
  const buttonHover = currentTheme?.buttonHover || 'hover:bg-blue-200';
  const textColor = currentTheme?.textColor || 'text-blue-800';
  
  return (
    <>
      <Button 
        variant={activeFontSize === 'grande' ? "default" : "outline"} 
        className={`w-full ${activeFontSize === 'grande' ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
        onClick={() => handleFontSizeChange('grande')}
      >
        <span className="text-lg">Fonte grande</span>
        {activeFontSize === 'grande' && <Check className="w-4 h-4 ml-2" />}
      </Button>
      <Button 
        variant={activeFontSize === 'médio' ? "default" : "outline"} 
        className={`w-full ${activeFontSize === 'médio' ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
        onClick={() => handleFontSizeChange('médio')}
      >
        <span className="text-base">Fonte média</span>
        {activeFontSize === 'médio' && <Check className="w-4 h-4 ml-2" />}
      </Button>
      <Button 
        variant={activeFontSize === 'pequeno' ? "default" : "outline"} 
        className={`w-full ${activeFontSize === 'pequeno' ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
        onClick={() => handleFontSizeChange('pequeno')}
      >
        <span className="text-sm">Fonte pequena</span>
        {activeFontSize === 'pequeno' && <Check className="w-4 h-4 ml-2" />}
      </Button>
    </>
  );
};

// Componente para botões de acessibilidade
const AccessibilityButtons = ({ currentTheme }: { currentTheme: any }) => {
  const { toast } = useToast();
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    doubleConfirmation: false,
    vibration: false
  });
  
  useEffect(() => {
    try {
      const settings = getAppSettings();
      setAccessibilitySettings(settings.accessibility || {
        highContrast: false,
        doubleConfirmation: false,
        vibration: false
      });
    } catch (error) {
      console.error('Erro ao carregar configurações de acessibilidade:', error);
    }
  }, []);
  
  const handleAccessibilityChange = (setting: 'highContrast' | 'doubleConfirmation' | 'vibration', value: boolean) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    try {
      applyAccessibilitySettings(setting, value);
      
      toast({
        title: "Configuração alterada",
        description: `${setting === 'highContrast' ? 'Modo de alto contraste' : 
                      setting === 'doubleConfirmation' ? 'Confirmação dupla' : 
                      'Vibração ao tocar'} ${value ? 'ativado' : 'desativado'}.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao aplicar configurações de acessibilidade:', error);
    }
  };
  
  // Garantir que o tema tenha valores padrão
  const textColor = currentTheme?.textColor || 'text-blue-800';
  
  return (
    <>
      <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
        <div>
          <p className={`font-medium ${textColor}`}>Modo de alto contraste</p>
          <p className="text-sm text-slate-500">Aumenta o contraste para melhor visibilidade</p>
        </div>
        <Switch 
          checked={accessibilitySettings.highContrast}
          onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
        <div>
          <p className={`font-medium ${textColor}`}>Confirmação dupla para ações</p>
          <p className="text-sm text-slate-500">Solicita confirmação antes de ações importantes</p>
        </div>
        <Switch 
          checked={accessibilitySettings.doubleConfirmation}
          onCheckedChange={(checked) => handleAccessibilityChange('doubleConfirmation', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between p-3 bg-slate-100 rounded-md">
        <div>
          <p className={`font-medium ${textColor}`}>Vibração ao tocar</p>
          <p className="text-sm text-slate-500">Vibra ao interagir com elementos</p>
        </div>
        <Switch 
          checked={accessibilitySettings.vibration}
          onCheckedChange={(checked) => handleAccessibilityChange('vibration', checked)}
        />
      </div>
    </>
  );
};

// Componente para seleção de idioma
const LanguageSelector = ({ currentTheme }: { currentTheme: any }) => {
  const { toast } = useToast();
  const { getAvailableLanguages, speak } = useSpeech();
  const [languages, setLanguages] = useState<{code: string, name: string, localName?: string}[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('pt-BR');
  
  useEffect(() => {
    try {
      // Obter idiomas disponíveis do sistema
      const systemLanguages = getAvailableLanguages();
      
      // Combinar com idiomas comuns
      const allLanguages = [...commonLanguages];
      
      // Adicionar idiomas do sistema que não estão na lista comum
      systemLanguages.forEach(sysLang => {
        if (!allLanguages.some(lang => lang.code === sysLang.code)) {
          allLanguages.push({
            code: sysLang.code,
            name: sysLang.name || sysLang.code
          });
        }
      });
      
      // Ordenar idiomas: primeiro português, depois os outros em ordem alfabética
      allLanguages.sort((a, b) => {
        if (a.code.startsWith('pt')) return -1;
        if (b.code.startsWith('pt')) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setLanguages(allLanguages);
      
      // Obter idioma atual das configurações
      const activeProfileId = localStorage.getItem('activeProfileId');
      if (activeProfileId) {
        const settings = await db.userSettings.where({ profileId: parseInt(activeProfileId) }).first();
        setSelectedLanguage(settings?.language || 'pt-BR');
      }
    } catch (error) {
      console.error('Erro ao carregar idiomas:', error);
      // Garantir que pelo menos os idiomas comuns estejam disponíveis
      setLanguages([...commonLanguages]);
    }
  }, [getAvailableLanguages]);
  
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    
    try {
      // Aplicar configurações de idioma
      import('@/lib/applyLanguageSettings').then(({ applyLanguageSettings }) => {
        applyLanguageSettings(language);
        
        // Atualizar configurações globais
        const settings = getSettings();
        saveSettings({
          ...settings,
          language
        });
        
        // Forçar atualização do documento
        document.documentElement.lang = language.split('-')[0];
        
        toast({
          title: "Idioma alterado",
          description: `O idioma da voz foi alterado para ${languages.find(l => l.code === language)?.name || language}.`,
          duration: 2000,
        });
      }).catch(error => {
        console.error('Erro ao importar applyLanguageSettings:', error);
      });
    } catch (error) {
      console.error('Erro ao alterar idioma:', error);
    }
  };
  
  // Garantir que o tema tenha valores padrão
  const buttonBg = currentTheme?.buttonBg || 'bg-blue-100';
  const buttonHover = currentTheme?.buttonHover || 'hover:bg-blue-200';
  const textColor = currentTheme?.textColor || 'text-blue-800';
  
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full mb-3"
        onClick={() => {
          try {
            // Testar a voz selecionada
            const langName = languages.find(l => l.code === selectedLanguage)?.name || selectedLanguage;
            const testText = selectedLanguage.startsWith('pt') ? 'Olá, este é um teste de voz.' : 
                            selectedLanguage.startsWith('en') ? 'Hello, this is a voice test.' :
                            selectedLanguage.startsWith('es') ? 'Hola, esta es una prueba de voz.' :
                            selectedLanguage.startsWith('fr') ? 'Bonjour, ceci est un test vocal.' :
                            'Test 1, 2, 3.';
            
            speak(testText, { lang: selectedLanguage });
            
            toast({
              title: "Teste de voz",
              description: `Testando voz em ${langName}`,
              duration: 2000,
            });
          } catch (error) {
            console.error('Erro ao testar voz:', error);
            toast({
              title: "Erro ao testar voz",
              description: "Não foi possível reproduzir o teste de voz.",
              duration: 2000,
            });
          }
        }}
      >
        Testar voz selecionada
      </Button>
      
      {languages.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={selectedLanguage === language.code ? "default" : "outline"}
              className={`w-full text-left justify-start ${selectedLanguage === language.code ? 'bg-blue-500 text-white' : `${buttonBg} ${buttonHover} ${textColor}`}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language.name}
              {selectedLanguage === language.code && <Check className="w-4 h-4 ml-auto" />}
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 text-slate-500">
          Nenhum idioma disponível. Verifique se seu navegador suporta síntese de voz.
        </div>
      )}
    </div>
  );
};

export const Settings = ({ onBack }: SettingsProps) => {
  const { toast } = useToast();
  const { currentTheme, setTheme } = useTheme();
  
  // Estado local para garantir que o componente seja renderizado corretamente
  const [isReady, setIsReady] = useState(false);
  
  // Garantir que o componente seja inicializado corretamente
  useEffect(() => {
    console.log('Settings component mounted', currentTheme);
    
    // Verificar se o tema está carregado corretamente
    if (!currentTheme || !currentTheme.name) {
      console.log('Theme not loaded, setting default theme');
      setTheme('Padrão');
    }
    
    // Adicionar listener para mudanças de idioma
    const handleLanguageChange = (event: Event) => {
      // Forçar atualização do componente quando o idioma mudar
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.language) {
        // Atualizar o idioma no documento
        document.documentElement.lang = customEvent.detail.language.split('-')[0];
      }
    };
    
    document.addEventListener('languagechange', handleLanguageChange);
    
    // Marcar componente como pronto após um pequeno delay para garantir que tudo seja carregado
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log('Settings component ready');
    }, 100);
    
    return () => {
      document.removeEventListener('languagechange', handleLanguageChange);
      clearTimeout(timer);
    };
  }, [currentTheme, setTheme]);

  const themes = [
    { name: 'Padrão', preview: 'bg-blue-100' },
    { name: 'Azul suave', preview: 'bg-blue-200' },
    { name: 'Verde suave', preview: 'bg-green-200' },
    { name: 'Alto contraste', preview: 'bg-gray-800' }
  ];

  // Verificar se o tema está carregado corretamente ou se o componente ainda não está pronto
  if (!isReady || !currentTheme || !currentTheme.name) {
    // Tentar reparar as configurações
    import('@/lib/initApp').then(({ repairSettings }) => {
      repairSettings();
      // Forçar atualização do tema
      setTheme('Padrão');
      // Marcar componente como pronto
      setIsReady(true);
    }).catch(error => {
      console.error('Erro ao importar initApp:', error);
    });
    
    return (
      <div className="min-h-screen bg-blue-50 p-4">
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
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-blue-800">Carregando configurações...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${currentTheme.bgColor || 'bg-blue-50'} p-4`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className={`${currentTheme.buttonBg || 'bg-blue-100'} ${currentTheme.buttonHover || 'hover:bg-blue-200'} mr-3`}
        >
          <ArrowLeft className={`h-5 w-5 ${currentTheme.textColor || 'text-blue-800'}`} />
        </Button>
        <h1 className={`text-2xl font-bold ${currentTheme.textColor || 'text-blue-800'}`}>Configurações</h1>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">

        {/* Temas de cores */}
        <Card className={`${currentTheme.cardBg || 'bg-white'} p-6`}>
          <div className="flex items-center mb-4">
            <Palette className={`h-6 w-6 ${currentTheme.textColor || 'text-blue-800'} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor || 'text-blue-800'}`}>Tema de cores</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.name}
                variant={currentTheme.name === theme.name ? "default" : "outline"}
                className={`h-16 flex flex-col items-center justify-center ${
                  currentTheme.name === theme.name 
                    ? 'bg-blue-500 text-white' 
                    : `${currentTheme.buttonBg || 'bg-blue-100'} ${currentTheme.buttonHover || 'hover:bg-blue-200'} ${currentTheme.textColor || 'text-blue-800'}`
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
        <Card className={`${currentTheme.cardBg || 'bg-white'} p-6`}>
          <div className="flex items-center mb-4">
            <Volume2 className={`h-6 w-6 ${currentTheme.textColor || 'text-blue-800'} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor || 'text-blue-800'}`}>Volume</h2>
          </div>
          <div className="space-y-3">
            <VolumeButtons currentTheme={currentTheme} />
          </div>
        </Card>

        {/* Tamanho da fonte */}
        <Card className={`${currentTheme.cardBg || 'bg-white'} p-6`}>
          <div className="flex items-center mb-4">
            <Type className={`h-6 w-6 ${currentTheme.textColor || 'text-blue-800'} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor || 'text-blue-800'}`}>Tamanho da fonte</h2>
          </div>
          <div className="space-y-3">
            <FontSizeButtons currentTheme={currentTheme} />
          </div>
        </Card>

        {/* Idioma */}
        <Card className={`${currentTheme.cardBg || 'bg-white'} p-6`}>
          <div className="flex items-center mb-4">
            <Globe className={`h-6 w-6 ${currentTheme.textColor || 'text-blue-800'} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor || 'text-blue-800'}`}>Idioma da voz</h2>
          </div>
          <div className="space-y-3">
            <LanguageSelector currentTheme={currentTheme} />
          </div>
        </Card>

        {/* Acessibilidade */}
        <Card className={`${currentTheme.cardBg || 'bg-white'} p-6`}>
          <div className="flex items-center mb-4">
            <Accessibility className={`h-6 w-6 ${currentTheme.textColor || 'text-blue-800'} mr-3`} />
            <h2 className={`text-xl font-semibold ${currentTheme.textColor || 'text-blue-800'}`}>Acessibilidade</h2>
          </div>
          <div className="space-y-3">
            <AccessibilityButtons currentTheme={currentTheme} />
          </div>
        </Card>
      </div>
    </div>
  );
};
