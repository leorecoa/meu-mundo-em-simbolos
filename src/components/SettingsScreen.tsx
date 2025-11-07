import { useState, useEffect, useCallback } from 'react';
import { db, UserSettings } from '@/lib/db';
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
    const { voices } = useSpeech();
    const [settings, setSettings] = useState<Partial<UserSettings>>({});

    useEffect(() => {
        if (activeProfileId) {
            db.userSettings.where({ profileId: activeProfileId }).first().then(s => {
                if(s) setSettings(s);
            });
        }
    }, [activeProfileId]);

    const handleSave = async () => {
        if (settings.id) {
            await db.userSettings.update(settings.id, settings);
            toast({ title: 'Sucesso', description: 'Configurações salvas.' });
        }
    };

    const updateSetting = (key: keyof UserSettings, value: any) => {
        setSettings(prev => ({...prev, [key]: value}));
    }

    return (
        <div>
            <header className="flex items-center mb-4"><Button variant="ghost" onClick={onBack}><ChevronLeft/> Voltar</Button></header>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Ajustes de Voz</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label>Voz</label>
                            <Select onValueChange={(v) => updateSetting('voiceType', v)} value={settings.voiceType || ''}>
                                <SelectTrigger><SelectValue placeholder="Padrão do Sistema" /></SelectTrigger>
                                <SelectContent>{voices.map(v => <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label>Velocidade ({((settings.voiceSpeed || 10) / 10).toFixed(1)}x)</label>
                            <input type="range" min="1" max="20" value={settings.voiceSpeed || 10} onChange={e => updateSetting('voiceSpeed', Number(e.target.value))} className="w-full" />
                        </div>
                    </CardContent>
                </Card>
                {/* Adicionar Card de Tema aqui se necessário */}
                <Button onClick={handleSave} className="w-full">Salvar Alterações</Button>
            </div>
        </div>
    );
};
