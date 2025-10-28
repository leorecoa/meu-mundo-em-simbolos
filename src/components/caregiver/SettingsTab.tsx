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
    const loadData = async () => {
      setLoading(true);
      const storedSettings = await getSettings();
      setSettings(storedSettings);
      
      // Carrega as vozes do sistema
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices.filter(v => v.lang.includes('pt')));
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices.filter(v => v.lang.includes('pt')));
          };
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    await saveSettings({ [key]: value });
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({ title: "Configuração salva" });
  };

  const handleChangePin = async () => {
    if (newPin.length < 4 || newPin !== confirmPin) {
      toast({ title: "Erro no PIN", description: "Verifique se o PIN tem 4 dígitos e se os campos coincidem.", variant: 'destructive' });
      return;
    }
    await setPin(newPin);
    setNewPin(''); setConfirmPin('');
    toast({ title: "PIN alterado com sucesso!" });
  };

  // ... (handleExport, handleImport) ...

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto my-12" />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Voz e Acessibilidade</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-select">Voz do Aplicativo</Label>
            <select 
              id="voice-select"
              className="p-2 border rounded-md"
              value={settings.voiceType || ''} // O valor será o nome da voz
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
            <Switch id="large-icons" checked={settings.largeIcons} onCheckedChange={(v) => handleSettingChange('largeIcons', v)} />
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
      
      {/* ... (Backup e Restauração) ... */}
    </div>
  );
};
