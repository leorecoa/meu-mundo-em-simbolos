import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Search, PlusCircle, Award, Frown, Loader2 } from 'lucide-react'; // Adicionado ícones
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/hooks/use-toast';

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: (symbolId: number) => void;
  onNavigateToAddSymbol: () => void;
}

const SymbolDisplay = ({ symbol }: { symbol: DbSymbol }) => { /* ...código... */ return null; };
const colorMap: { [key: string]: { bg: string, text: string, hover: string, imageOverlay: string } } = { /* ...código... */ };

// --- Componentes de Estado ---
const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="text-lg font-medium">Carregando símbolos...</p>
    </div>
);

const EmptyState = ({ onAddClick }: { onAddClick: () => void }) => (
    <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 bg-black/10 rounded-lg p-6">
        <Frown className="h-12 w-12 mb-4" />
        <h3 className="text-xl font-bold mb-2 text-white">Categoria Vazia</h3>
        <p className="mb-4">Não há símbolos aqui ainda. Que tal adicionar o primeiro?</p>
        <Button onClick={onAddClick}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Símbolo</Button>
    </div>
);


export const CategoryScreen = ({ category, onBack, onNavigateToPhrase, onNavigateToAddSymbol }: CategoryScreenProps) => {
  const { activeProfileId } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // useLiveQuery agora retorna undefined enquanto carrega
  const data = useLiveQuery(async () => {
    if (!activeProfileId) return null;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const symbolsQuery = db.symbols.where({ profileId: activeProfileId, categoryKey: category });
    const filteredSymbols = await symbolsQuery.filter(s => s.text.toLowerCase().includes(lowerSearchTerm)).toArray();
    const sortedSymbols = filteredSymbols.sort((a, b) => a.order - b.order);
    const cat = await db.categories.where({ profileId: activeProfileId, key: category }).first();
    return { symbols: sortedSymbols, categoryColor: cat?.color || 'default' };
  }, [category, searchTerm, activeProfileId]);
  
  useEffect(() => { /* ...código de gamificação... */ }, [category, toast]);
  
  const handleSymbolClick = async (symbol: DbSymbol) => { /* ...código... */ };

  const getSymbolColor = () => { return colorMap[data?.categoryColor || 'default'] || colorMap.default; };

  const renderGrid = () => {
    if (data === undefined) { // Estado de carregamento inicial
      return <LoadingState />;
    }
    if (data === null || data.symbols.length === 0) { // Categoria vazia ou nula
      return <EmptyState onAddClick={onNavigateToAddSymbol} />;
    }

    return (
        <Card className="shadow-xl bg-black/30">
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {data.symbols.map(symbol => {
                const colors = getSymbolColor();
                return (<Button key={symbol.id} onClick={() => handleSymbolClick(symbol)} variant="outline" className={`relative h-24 sm:h-28 font-bold shadow-lg p-0 ${colors.bg} ${colors.text} ${colors.hover}`}><SymbolDisplay symbol={symbol} />{symbol.image && <div className={`absolute inset-0 bg-gradient-to-t ${colors.imageOverlay}`}></div>}<span className="absolute bottom-1 right-2 text-xs">{symbol.image ? symbol.text : ''}</span></Button>)
              })}
            </div>
          </CardContent>
        </Card>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}><ChevronLeft />Voltar</Button>
        <h1 className="text-lg sm:text-xl font-bold text-white capitalize">{category}</h1>
        <Button variant="ghost" onClick={onNavigateToAddSymbol}><PlusCircle />Adicionar</Button>
      </header>
      <main>
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100/80 rounded-lg pl-10 pr-4 py-2" /></div>
        {renderGrid()}
      </main>
    </div>
  );
};
