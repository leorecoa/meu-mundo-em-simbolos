import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getSettings, saveSettings, setPin, exportAllData, importAllData } from '@/lib/storage';
import type { UserSettings } from '@/db';
import { useQueryClient } from '@tanstack/react-query';

export const SettingsTab = () => {
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [loading, setLoading] = useState(true);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const storedSettings = await getSettings();
      setSettings(storedSettings);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    await saveSettings({ [key]: value });
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({ title: "Configuração salva" });
  };

  const handleChangePin = async () => {
    if (newPin.length < 4) {
      toast({ title: "PIN muito curto", description: "O PIN deve ter pelo menos 4 dígitos.", variant: 'destructive' });
      return;
    }
    if (newPin !== confirmPin) {
      toast({ title: "PINs não conferem", variant: 'destructive' });
      return;
    }
    await setPin(newPin);
    setNewPin('');
    setConfirmPin('');
    toast({ title: "PIN alterado com sucesso!" });
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportAllData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meu-mundo-em-simbolos-backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Backup exportado com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro ao exportar', variant: 'destructive' });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = await importAllData(jsonData);
        if (success) {
          toast({ title: 'Backup importado com sucesso!', description: 'O aplicativo será recarregado.' });
          // Recarrega a página para refletir os dados importados
          setTimeout(() => window.location.reload(), 2000);
        } else {
          throw new Error('Falha na importação');
        }
      } catch (error) {
        toast({ title: 'Erro ao importar o backup', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto my-12" />;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Acessibilidade</h2>
        {/* ... (código de acessibilidade) ... */}
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Segurança</h2>
        {/* ... (código do PIN) ... */}
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Backup e Restauração</h2>
        <div className="space-y-2">
          <Button className="w-full" variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar Dados
          </Button>
          <input type="file" id="importFile" accept=".json" onChange={handleImport} className="hidden" />
          <label htmlFor="importFile" className="w-full">
            <Button as="span" className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Importar Dados
            </Button>
          </label>
        </div>
      </Card>
    </div>
  );
};
