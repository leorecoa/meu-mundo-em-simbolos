import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useSpeech } from '@/hooks/use-speech';

interface SettingsScreenProps { onBack: () => void; }

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
    const { toast } = useToast();
    const { activeProfileId } = useProfile();
    const { voices } = useSpeech(); // Usar o hook de voz para a lista

    const [voiceName, setVoiceName] = useState('');
    const [voiceSpeed, setVoiceSpeed] = useState(10); // Escala de 1 a 20
    const [voicePitch, setVoicePitch] = useState(10); // Escala de 1 a 20
    const [theme, setTheme] = useState('light');
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');

    // Carregar dados
    useEffect(() => {
        const loadData = async () => {
            if (!activeProfileId) return;
            const settings = await db.userSettings.where({ profileId: activeProfileId }).first();
            if (settings) {
                setVoiceName(settings.voiceType || '');
                setVoiceSpeed(settings.voiceSpeed || 10);
                setTheme(settings.theme || 'light');
            }
        };
        loadData();
    }, [activeProfileId]);

    const handleSave = async () => {
        if (!activeProfileId) return;
        const userSettings = await db.userSettings.where({ profileId: activeProfileId }).first();
        if (userSettings) {
            await db.userSettings.update(userSettings.id!, { 
                voiceType: voiceName,
                voiceSpeed: voiceSpeed,
                theme: theme,
            });
            toast({ title: 'Sucesso', description: 'Configurações salvas.' });
        }
    };
    
    // ... (handleSavePin)

    return (
        <div>
            <header className="flex items-center mb-4"><Button variant="ghost" onClick={onBack}><ChevronLeft/> Voltar</Button></header>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Ajustes de Voz</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label>Voz Preferida</label>
                            <Select onValueChange={setVoiceName} value={voiceName}>
                                <SelectTrigger><SelectValue placeholder="Padrão do Sistema" /></SelectTrigger>
                                <SelectContent>{voices.filter(v => v.lang.startsWith('pt')).map(v => <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label>Velocidade ({voiceSpeed / 10}x)</label>
                            <input type="range" min="1" max="20" value={voiceSpeed} onChange={e => setVoiceSpeed(Number(e.target.value))} className="w-full" />
                        </div>
                         <div>
                            <label>Tom (Padrão: 1.0)</label>
                            <input type="range" min="1" max="20" value={voicePitch} onChange={e => setVoicePitch(Number(e.target.value))} className="w-full" />
                        </div>
                    </CardContent>
                </Card>
                {/* ... (outras cards de Tema e PIN) ... */}
                <Button onClick={handleSave} className="w-full">Salvar Todas as Alterações</Button>
            </div>
        </div>
    );
};
