import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, Trash2, X, ScreenShare, Download, ChevronLeft, Send, MessageSquarePlus, Save, History } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import * as htmlToImage from 'html-to-image';
import { SymbolDisplay } from '@/components/ui/SymbolDisplay';
import { PresentationScreen } from './PresentationScreen';
import { PhraseHistory } from './PhraseHistory';
import { useSpeech } from '@/hooks/use-speech';
import { useTheme } from '@/hooks/use-theme';

interface PhraseBuilderProps { onBack: () => void; initialSymbolId?: number; }

const PhraseDisplay = ({ phrase, forwardedRef, onRemoveSymbol, theme }: { phrase: DbSymbol[], forwardedRef: React.Ref<HTMLDivElement>, onRemoveSymbol: (index: number) => void, theme: any }) => (
    <Card ref={forwardedRef} className={`mb-4 min-h-[160px] shadow-xl ${theme.cardBg} backdrop-blur-lg border-white/10 flex items-center justify-center p-4`}>
        <CardContent className="w-full">
            {phrase.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">{phrase.map((symbol, index) => (<div key={`${symbol.id}-${index}`} className="relative group"><div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center shadow-inner overflow-hidden"><SymbolDisplay symbol={symbol} /></div><button onClick={() => onRemoveSymbol(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button></div>))}</div>
            ) : (
                <div className={`text-center ${theme.textColor} p-6 flex flex-col items-center`}><MessageSquarePlus className="h-12 w-12 mb-4" /><h3 className="font-bold text-lg">Frase Vazia</h3><p className="text-sm">Comece a montar sua frase.</p></div>
            )}
        </CardContent>
    </Card>
);

const ActionButtons = (props: any) => (
    <div className="space-y-2 mb-4">
        <div className="grid grid-cols-4 gap-2">
            <Button onClick={props.onSpeak} className="h-20 col-span-2 flex-col gap-1 bg-green-500 text-white"><PlayCircle size={28} /><span>Falar</span></Button>
            <Button onClick={props.onSave} className="h-20 flex-col gap-1 bg-purple-500 text-white"><Save size={24}/><span>Salvar</span></Button>
            <Button onClick={props.onHistory} className="h-20 flex-col gap-1 bg-indigo-500 text-white"><History size={24}/><span>Histórico</span></Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
            <Button onClick={props.onPresent} variant="outline" className="h-16 flex-col gap-1 bg-sky-500 text-white"><ScreenShare size={20}/><span>Apresentar</span></Button>
            <Button onClick={props.onExport} variant="outline" className="h-16 flex-col gap-1 bg-cyan-500 text-white"><Download size={20}/><span>Exportar</span></Button>
            <Button onClick={props.onRemoveLast} variant="outline" className="h-16 bg-amber-500 text-white"><X size={18} /><span>Apagar</span></Button>
            <Button onClick={props.onClear} variant="destructive" className="h-16"><Trash2 size={18}/><span>Limpar</span></Button>
        </div>
    </div>
);

const SymbolGrid = ({ onSymbolClick }: { onSymbolClick: (symbol: DbSymbol) => void }) => {
    const { activeProfileId } = useProfile();
    const { currentTheme } = useTheme();
    const [visibleCount, setVisibleCount] = useState(24);
    const symbols = useLiveQuery(() => activeProfileId ? db.symbols.where({ profileId: activeProfileId }).toArray() : [], [activeProfileId]);
    const visibleSymbols = symbols?.slice(0, visibleCount) || [];
    const hasMore = (symbols?.length || 0) > visibleCount;
    
    return (
        <Card className={currentTheme.cardBg}>
            <CardContent className="p-2 space-y-2">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {visibleSymbols.map(s => (
                        <button key={s.id} onClick={() => onSymbolClick(s)} className={`h-28 rounded-lg ${currentTheme.buttonBg} flex flex-col items-center justify-center p-1 gap-1 text-center ${currentTheme.buttonHover}`}>
                            <SymbolDisplay symbol={s} />
                            <span className={`text-xs font-semibold line-clamp-2 ${currentTheme.textColor}`}>{s.text}</span>
                        </button>
                    ))}
                </div>
                {hasMore && (
                    <Button onClick={() => setVisibleCount(prev => prev + 24)} className="w-full" variant="outline">
                        Carregar Mais Símbolos
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

const NativeKeyboardInput = ({ onAddSymbol }: { onAddSymbol: (text: string) => void }) => {
  const [text, setText] = useState('');
  const handleAdd = () => { const trimmed = text.trim(); if (trimmed) { onAddSymbol(trimmed); setText(''); } };
  return (
    <Card><CardContent className="p-4 flex gap-2"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="w-full p-2 border rounded-md" placeholder="Digite uma palavra..."/><Button onClick={handleAdd}><Send /></Button></CardContent></Card>
  );
};

export const PhraseBuilder = ({ onBack, initialSymbolId }: any) => {
    const { activeProfileId } = useProfile();
    const { toast } = useToast();
    const { speak, isSpeaking } = useSpeech();
    const { currentTheme } = useTheme();
    const phraseStorageKey = `currentPhrase_${activeProfileId}`;
    const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>(() => { try { const s = localStorage.getItem(phraseStorageKey); return s ? JSON.parse(s) : []; } catch { return []; } });
    const [inputMode, setInputMode] = useState<'symbols' | 'keyboard'>('symbols');
    const [isCasting, setIsCasting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const phraseDisplayRef = useRef<HTMLDivElement>(null);
    const liveRegionRef = useRef<HTMLDivElement>(null);

    const addSymbol = useCallback(async (symbolOrText: DbSymbol | string, isInitial = false) => {
        let symbolToAdd: DbSymbol | undefined;
        if (typeof symbolOrText === 'string') {
            if (!activeProfileId) return;
            const text = symbolOrText.trim();
            symbolToAdd = await db.symbols.where({ profileId: activeProfileId, text }).first();
            if (!symbolToAdd) {
                const newSymbol: Omit<DbSymbol, 'id'> = { profileId: activeProfileId, text, categoryKey: 'geral', order: Date.now() };
                const newId = await db.symbols.add(newSymbol as DbSymbol);
                symbolToAdd = { ...newSymbol, id: newId };
                if (!isInitial) toast({ title: 'Palavra Salva!', description: `"${text}" foi adicionado à categoria "Geral".` });
            }
        } else { symbolToAdd = symbolOrText; }
        if (symbolToAdd) {
            setCurrentPhrase(prev => [...prev, symbolToAdd!]);
            if (!isInitial && liveRegionRef.current) liveRegionRef.current.textContent = `Símbolo ${symbolToAdd.text} adicionado.`;
        }
    }, [activeProfileId, toast]);

    useEffect(() => {
        if (initialSymbolId && activeProfileId) {
            db.symbols.get(initialSymbolId).then(symbol => {
                if (symbol && !currentPhrase.some(s => s.id === symbol.id)) { addSymbol(symbol, true); }
            });
        }
    }, [initialSymbolId, activeProfileId, addSymbol]);

    const removeSymbol = useCallback((index: number) => { setCurrentPhrase(prev => prev.filter((_, i) => i !== index)); }, []);
    const removeLastSymbol = useCallback(() => { setCurrentPhrase(prev => prev.slice(0, -1)); }, []);
    const clearPhrase = useCallback(() => { setCurrentPhrase([]); }, []);
    const getPhraseText = useCallback(() => currentPhrase.map(s => s.text).join(' '), [currentPhrase]);

    const handleSpeak = useCallback(async () => {
        const text = getPhraseText();
        if (!text) { toast({ title: "Frase vazia!" }); return; }
        await speak(text);
    }, [getPhraseText, speak, toast]);

    const handleExport = useCallback(() => {
        if (phraseDisplayRef.current) {
            htmlToImage.toPng(phraseDisplayRef.current).then(url => { const a = document.createElement('a'); a.href = url; a.download = 'frase.png'; a.click(); });
        }
    }, [phraseDisplayRef]);

    const handleSavePhrase = useCallback(async () => {
        if (!activeProfileId || currentPhrase.length === 0) {
            toast({ title: 'Frase vazia!' });
            return;
        }
        await db.phraseHistory.add({
            profileId: activeProfileId,
            phrase: getPhraseText(),
            symbolIds: JSON.stringify(currentPhrase.map(s => s.id)),
            timestamp: Date.now()
        });
        toast({ title: 'Frase salva no histórico!' });
    }, [activeProfileId, currentPhrase, getPhraseText, toast]);

    const handleLoadPhrase = useCallback((phrase: DbSymbol[]) => {
        setCurrentPhrase(phrase);
    }, []);

    if (showHistory) {
        return <PhraseHistory onBack={() => setShowHistory(false)} onLoadPhrase={handleLoadPhrase} />;
    }

    return (
        <div className={`p-2 sm:p-4 min-h-screen ${currentTheme.bgColor}`}>
            <div ref={liveRegionRef} aria-live="assertive" className="sr-only"></div>
            <header className={`flex items-center justify-between mb-4 ${currentTheme.textColor}`}>
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-1"><ChevronLeft /> Voltar</Button>
                <h1 className="text-xl font-bold">Formador de Frases</h1>
                <div className="w-24"></div>
            </header>
            <main>
                <PhraseDisplay phrase={currentPhrase} forwardedRef={phraseDisplayRef} onRemoveSymbol={removeSymbol} theme={currentTheme} />
                <ActionButtons onSpeak={handleSpeak} onSave={handleSavePhrase} onHistory={() => setShowHistory(true)} onRemoveLast={removeLastSymbol} onClear={clearPhrase} onPresent={() => setIsCasting(true)} onExport={handleExport} />
                <div className="flex justify-center my-4"><div className="inline-flex rounded-md shadow-sm"><Button onClick={() => setInputMode('symbols')} className={`px-3 py-2 ${inputMode === 'symbols' ? currentTheme.buttonBg : 'bg-white/50' }`}>Símbolos</Button><Button onClick={() => setInputMode('keyboard')} className={`px-3 py-2 ${inputMode === 'keyboard' ? currentTheme.buttonBg : 'bg-white/50' }`}>Teclado</Button></div></div>
                {inputMode === 'symbols' ? <SymbolGrid onSymbolClick={(s) => addSymbol(s)} /> : <NativeKeyboardInput onAddSymbol={(t) => addSymbol(t)} />}
            </main>
            {isCasting && <PresentationScreen phrase={getPhraseText()} onClose={() => setIsCasting(false)} />}
        </div>
    );
};
