import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext'; // Importar

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { toast } = useToast();
  const { activeProfileId } = useProfile(); // Usar o perfil ativo
  const [settings, setSettings] = useState({ voiceSpeed: 1, theme: 'light' });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!activeProfileId) return;
      // Correção: Buscar pelo profileId, não pelo id fixo
      const savedSettings = await db.userSettings.where({ profileId: activeProfileId }).first();
      if (savedSettings) {
        setSettings({ voiceSpeed: savedSettings.voiceSpeed, theme: savedSettings.theme });
        setSelectedVoice(savedSettings.voiceType);
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
  }, [activeProfileId]);

  const handleSaveSettings = async () => {
    if (!activeProfileId) return;
    const userSettings = await db.userSettings.where({ profileId: activeProfileId }).first();
    if (userSettings) {
      await db.userSettings.update(userSettings.id!, { 
        voiceSpeed: settings.voiceSpeed,
        theme: settings.theme,
        voiceType: selectedVoice
      });
      toast({ title: 'Sucesso', description: 'Configurações salvas.' });
    }
  };

  const handleSavePin = async () => {
    const security = await db.security.get(1);
    if (security?.pin !== currentPin) {
      toast({ title: 'PIN Atual Incorreto', variant: 'destructive' });
      return;
    }
    if (newPin.length !== 4 || !/^[0-9]*$/.test(newPin)) {
      toast({ title: 'Novo PIN Inválido', variant: 'destructive' });
      return;
    }
    await db.security.update(1, { pin: newPin });
    toast({ title: 'Sucesso!', description: 'Seu PIN foi alterado.'});
    setCurrentPin('');
    setNewPin('');
  };

  return (
    <div>
        {/* ... JSX do componente ... */}
    </div>
  );
};
