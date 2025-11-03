import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ voiceSpeed: 1, theme: 'light' }); // Valores padrão
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    // Carregar configurações do DB
    const loadSettings = async () => {
      const savedSettings = await db.userSettings.get(1);
      if (savedSettings) {
        setSettings({ voiceSpeed: savedSettings.voiceSpeed, theme: savedSettings.theme });
        setSelectedVoice(savedSettings.voiceType);
      }
    };
    loadSettings();

    // Carregar vozes da síntese de voz
    const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
        setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleSave = async () => {
    try {
      await db.userSettings.update(1, { 
        voiceSpeed: settings.voiceSpeed,
        theme: settings.theme,
        voiceType: selectedVoice
      });
      toast({ title: 'Sucesso', description: 'Configurações salvas.' });
      onBack();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar as configurações.', variant: 'destructive' });
    }
  };

  return (
    <div>
        <header className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-gray-800 font-semibold"><ChevronLeft className="h-5 w-5" />Voltar</Button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-700">Configurações do App</h1>
            <div className="w-16 sm:w-24"></div>
        </header>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg text-gray-800">
            <CardHeader><CardTitle>Ajustes Gerais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voz Preferida</label>
                    <Select onValueChange={setSelectedVoice} value={selectedVoice}>
                        <SelectTrigger><SelectValue placeholder="Selecione uma voz..." /></SelectTrigger>
                        <SelectContent>
                            {voices.map(v => <SelectItem key={v.name} value={v.name}>{`${v.name} (${v.lang})`}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tema do Aplicativo</label>
                    <Select onValueChange={(value) => setSettings(s => ({...s, theme: value}))} value={settings.theme}>
                        <SelectTrigger><SelectValue placeholder="Selecione um tema..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSave} className="w-full">Salvar Alterações</Button>
            </CardContent>
        </Card>
    </div>
  );
};
