import { useLiveQuery } from 'dexie-react-hooks';
import { db, PhraseHistory as PhraseHistoryType, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

interface PhraseHistoryProps {
  onBack: () => void;
  onLoadPhrase: (phrase: DbSymbol[]) => void;
}

export const PhraseHistory = ({ onBack, onLoadPhrase }: PhraseHistoryProps) => {
  const { activeProfileId } = useProfile();
  const { toast } = useToast();
  const { currentTheme } = useTheme();

  const history = useLiveQuery(
    () =>
      activeProfileId
        ? db.phraseHistory
            .where({ profileId: activeProfileId })
            .reverse()
            .sortBy('timestamp')
        : [],
    [activeProfileId]
  );

  const handleDelete = async (id: number) => {
    await db.phraseHistory.delete(id);
    toast({ title: 'Frase removida do histórico' });
  };

  const handleLoad = async (item: PhraseHistoryType) => {
    try {
      const symbolIds = JSON.parse(item.symbolIds);
      const symbols = await Promise.all(
        symbolIds.map((id: number) => db.symbols.get(id))
      );
      const validSymbols = symbols.filter((s): s is DbSymbol => s !== undefined);
      onLoadPhrase(validSymbols);
      toast({ title: 'Frase carregada!' });
      onBack();
    } catch (error) {
      toast({ title: 'Erro ao carregar frase', variant: 'destructive' });
    }
  };

  return (
    <div className={`p-4 min-h-screen ${currentTheme.bgColor}`}>
      <header className={`flex items-center justify-between mb-6 ${currentTheme.textColor}`}>
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ChevronLeft /> Voltar
        </Button>
        <h1 className="text-xl font-bold">Histórico de Frases</h1>
        <div className="w-24"></div>
      </header>

      <div className="space-y-4">
        {history && history.length > 0 ? (
          history.map((item) => (
            <Card key={item.id} className={currentTheme.cardBg}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className={`font-semibold ${currentTheme.textColor}`}>{item.phrase}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleLoad(item)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                  >
                    <Upload size={16} className="mr-2" /> Carregar
                  </Button>
                  <Button
                    onClick={() => item.id && handleDelete(item.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className={currentTheme.cardBg}>
            <CardContent className="py-8 text-center">
              <p className={currentTheme.textColor}>Nenhuma frase salva ainda.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
