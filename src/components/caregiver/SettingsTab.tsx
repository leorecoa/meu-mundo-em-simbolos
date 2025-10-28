import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getSettings, saveSettings, setPin, exportAllData, importAllData } from '@/lib/storage';
import type { UserSettings } from '@/db';

export const SettingsTab = () => {
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { toast } = useToast();

  // Lógica robusta e segura para carregar dados e vozes
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const storedSettings = await getSettings();
        setSettings(storedSettings);

        // Abordagem "paciente" para carregar as vozes
        if ('speechSynthesis' in window) {
          const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
              setVoices(availableVoices.filter(v => v.lang.startsWith('pt')));
            }
          };

          updateVoices(); // Tenta pegar as vozes imediatamente
          // E registra um "ouvinte" para caso elas demorem a carregar
          window.speechSynthesis.onvoiceschanged = updateVoices;
        } else {
          console.warn('API de Síntese de Voz não suportada neste navegador.');
        }
      } catch (error) {
        console.error("Falha ao carregar dados iniciais:", error);
        toast({ title: "Erro Crítico", description: "Não foi possível carregar as configurações.", variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    await saveSettings({ [key]: value });
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({ title: "Configuração salva" });
  };
  
  const handleChangePin = async () => {
    // ... (lógica do PIN) ...
  };

  const handleExport = async () => {
    // ... (lógica de exportação) ...
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... (lógica de importação) ...
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Voz e Acessibilidade</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-select" className="text-base">Voz do App</Label>
            <select 
              id="voice-select"
              className="p-2 border rounded-md bg-white shadow-sm"
              value={settings.voiceType || ''}
              onChange={(e) => handleSettingChange('voiceType', e.target.value)}
              disabled={voices.length === 0} // Desabilita se nenhuma voz for encontrada
            >
              {voices.length > 0 ? (
                <>
                  <option value="" disabled>Selecione uma voz</option>
                  {voices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {`${voice.name} (${voice.lang})`}
                    </option>
                  ))}
                </>
              ) : (
                <option>Nenhuma voz encontrada</option>
              )}
            </select>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="large-icons">Ícones grandes</Label>
            <Switch id="large-icons" checked={!!settings.largeIcons} onCheckedChange={(v) => handleSettingChange('largeIcons', v)} />
          </div>
           <p className="text-xs text-gray-500 pt-2">A lista de vozes depende das instaladas no seu dispositivo. Para mais opções, busque por como "instalar vozes de texto para fala" no seu sistema.</p>
        </CardContent>
      </Card>

       {/* ... (Outras seções: Segurança, Backup) ... */}
    </div>
  );
};
