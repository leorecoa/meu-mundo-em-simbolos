import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // Importar Input
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ voiceSpeed: 1, theme: 'light' });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const savedSettings = await db.userSettings.get(1);
      if (savedSettings) {
        setSettings({ voiceSpeed: savedSettings.voiceSpeed, theme: savedSettings.theme });
        setSelectedVoice(savedSettings.voiceType);
      }
      const security = await db.security.get(1);
      if (security) {
        // Não armazenamos o PIN atual no estado por segurança, mas confirmamos que ele existe
      }
    };
    loadData();

    const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
        setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleSaveSettings = async () => {
    try {
      await db.userSettings.update(1, { 
        voiceSpeed: settings.voiceSpeed,
        theme: settings.theme,
        voiceType: selectedVoice
      });
      toast({ title: 'Sucesso', description: 'Configurações de aparência e voz salvas.' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar as configurações.', variant: 'destructive' });
    }
  };

  const handleSavePin = async () => {
    const security = await db.security.get(1);
    if (security?.pin !== currentPin) {
      toast({ title: 'PIN Atual Incorreto', variant: 'destructive' });
      return;
    }
    if (newPin.length !== 4 || !/^[0-9]*$/.test(newPin)) {
      toast({ title: 'Novo PIN Inválido', description: 'O PIN deve conter 4 números.', variant: 'destructive' });
      return;
    }
    await db.security.update(1, { pin: newPin });
    toast({ title: 'Sucesso!', description: 'Seu PIN foi alterado.'});
    setCurrentPin('');
    setNewPin('');
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1"><ChevronLeft />Voltar</Button>
        <h1 className="text-xl font-bold">Configurações do App</h1>
        <div className="w-24"></div>
      </header>
      <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Ajustes Gerais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Voz Preferida</label>
                    <Select onValueChange={setSelectedVoice} value={selectedVoice}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{voices.map(v => <SelectItem key={v.name} value={v.name}>{`${v.name} (${v.lang})`}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Tema do Aplicativo</label>
                    <Select onValueChange={(v) => setSettings(s => ({...s, theme: v}))} value={settings.theme}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem></SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSaveSettings} className="w-full">Salvar Ajustes</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Alterar PIN de Segurança</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Input type="password" placeholder="PIN Atual" maxLength={4} value={currentPin} onChange={e => setCurrentPin(e.target.value)} />
                <Input type="password" placeholder="Novo PIN (4 dígitos)" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value)} />
                <Button onClick={handleSavePin} variant="destructive" className="w-full">Alterar PIN</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};
