import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSettings, saveSettings } from '@/lib/storage';
import type { UserSettings } from '@/db';

export const SettingsTab = () => {
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings({ [key]: value });
    toast({ title: "Configuração salva", description: `A opção '${key}' foi atualizada.` });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2 text-gray-600" />
          Configurações de Acessibilidade
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="large-icons" className="flex-1">Ícones grandes</Label>
            <Switch 
              id="large-icons" 
              checked={settings.largeIcons || false}
              onCheckedChange={(value) => handleSettingChange('largeIcons', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="audio-feedback" className="flex-1">Feedback de áudio</Label>
            <Switch 
              id="audio-feedback" 
              checked={settings.useAudioFeedback || false}
              onCheckedChange={(value) => handleSettingChange('useAudioFeedback', value)}
            />
          </div>
          
          {/* A funcionalidade de alto contraste pode ser implementada no futuro */}
          <div className="flex items-center justify-between opacity-50">
            <Label htmlFor="high-contrast" className="flex-1">Alto contraste</Label>
            <Switch id="high-contrast" disabled />
          </div>
        </div>
      </Card>

      <Card className="p-4 opacity-50">
        <h2 className="text-lg font-semibold mb-4">Backup e Restauração</h2>
        <p className="text-sm text-gray-500">Funcionalidade em desenvolvimento.</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-md font-semibold mb-3">Sobre o aplicativo</h3>
        <p className="text-sm text-gray-500">Meu Mundo em Símbolos v1.0.0</p>
        <p className="text-sm text-gray-500 mt-1">© 2023-2024 Todos os direitos reservados</p>
      </Card>
    </div>
  );
};
