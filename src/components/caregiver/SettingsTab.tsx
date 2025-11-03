import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

export const SettingsTab = () => {
  const { activeProfileId } = useProfile();
  const [settings, setSettings] = useState<any>({});
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        if (activeProfileId) {
          const storedSettings = await db.userSettings.where({ profileId: activeProfileId }).first();
          setSettings(storedSettings || {});
        }

        if ('speechSynthesis' in window) {
          const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
              setVoices(availableVoices);
            }
          };
          updateVoices();
          window.speechSynthesis.onvoiceschanged = updateVoices;
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [activeProfileId]);

  const handleSettingChange = async (key: string, value: any) => {
    if (activeProfileId && settings.id) {
      await db.userSettings.update(settings.id, { [key]: value });
      setSettings({ ...settings, [key]: value });
      toast({ title: 'Configuração atualizada' });
    }
  };

  const handlePinChange = async () => {
    if (newPin !== confirmPin) {
      toast({ title: 'Erro', description: 'Os PINs não coincidem', variant: 'destructive' });
      return;
    }
    if (newPin.length !== 4) {
      toast({ title: 'Erro', description: 'O PIN deve ter 4 dígitos', variant: 'destructive' });
      return;
    }
    await db.security.put({ id: 1, pin: newPin });
    toast({ title: 'PIN alterado com sucesso' });
    setNewPin('');
    setConfirmPin('');
  };

  const handleExportData = async () => {
    try {
      const allData = {
        categories: await db.categories.toArray(),
        symbols: await db.symbols.toArray(),
        userSettings: await db.userSettings.toArray(),
        coins: await db.coins.toArray(),
        dailyGoals: await db.dailyGoals.toArray(),
        achievements: await db.achievements.toArray(),
        rewards: await db.rewards.toArray(),
        security: await db.security.toArray(),
      };
      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `mms-backup-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast({ title: 'Dados exportados com sucesso' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao exportar dados', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Audio Feedback</Label>
            <Switch
              checked={settings.useAudioFeedback || false}
              onCheckedChange={(checked) => handleSettingChange('useAudioFeedback', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar PIN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Novo PIN</Label>
            <Input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
            />
          </div>
          <div>
            <Label>Confirmar PIN</Label>
            <Input
              type="password"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
          </div>
          <Button onClick={handlePinChange}>Alterar PIN</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup & Restauração</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportData} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Exportar Dados
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
