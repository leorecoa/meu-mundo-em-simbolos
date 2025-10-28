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

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const storedSettings = await getSettings();
      setSettings(storedSettings);

      if ('speechSynthesis' in window) {
        const updateVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          // Filtra para vozes em português ou variantes
          setVoices(availableVoices.filter(v => v.lang.startsWith('pt')));
        };
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
      setLoading(false);
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

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto my-12" />;
  }

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
            >
              <option value="" disabled>Selecione uma voz</option>
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {`${voice.name} (${voice.lang})`}
                </option>
              ))}
            </select>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="large-icons">Ícones grandes</Label>
            <Switch id="large-icons" checked={!!settings.largeIcons} onCheckedChange={(v) => handleSettingChange('largeIcons', v)} />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader><CardTitle>Segurança</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input type="password" placeholder="Novo PIN (4 dígitos)" value={newPin} onChange={(e) => setNewPin(e.target.value)} maxLength={4} />
          <Input type="password" placeholder="Confirmar novo PIN" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength={4} />
          <Button className="w-full" onClick={handleChangePin}>Salvar Novo PIN</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader><CardTitle>Backup e Restauração</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exportar Dados</Button>
          <input type="file" id="importFile" accept=".json" onChange={handleImport} className="hidden" />
          <label htmlFor="importFile" className="w-full">
            <Button as="span" className="w-full" variant="outline"><Upload className="mr-2 h-4 w-4" />Importar Dados</Button>
          </label>
        </CardContent>
      </Card>
    </div>
  );
};
