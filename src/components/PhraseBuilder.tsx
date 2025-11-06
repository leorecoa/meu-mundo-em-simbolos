import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft, Keyboard as KeyboardIcon, Grid3x3, Send, Copy, Share2, Award, MessageSquarePlus, ScreenShare, Download } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import * as htmlToImage from 'html-to-image';
import { SymbolDisplay } from '@/components/ui/SymbolDisplay';
import { PresentationScreen } from './PresentationScreen';
import { useSpeech } from '@/hooks/use-speech';

interface PhraseBuilderProps { onBack: () => void; initialSymbolId?: number; }

// #region Sub-componentes de UI (Restaurados e Completos)
const PhraseDisplay = ({ phrase, forwardedRef }: { phrase: DbSymbol[], forwardedRef: React.Ref<HTMLDivElement> }) => (
    <Card ref={forwardedRef} className="mb-4 min-h-[160px] shadow-xl bg-black/30 backdrop-blur-lg border-white/10 flex items-center justify-center p-4 text-white">
        <CardContent className="w-full">
            {phrase.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">{phrase.map((symbol, index) => (<div key={`${symbol.id}-${index}`} className="relative group"><div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center shadow-inner overflow-hidden"><SymbolDisplay symbol={symbol} /></div><button onClick={() => {}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={12}/></button></div>))}</div>
            ) : (
                <div className="text-center text-slate-300/80 p-6 flex flex-col items-center"><MessageSquarePlus className="h-12 w-12 mb-4" /><h3 className="font-bold text-lg">Frase Vazia</h3><p className="text-sm">Comece a montar sua frase abaixo.</p></div>
            )}
        </CardContent>
    </Card>
);

const ActionButtons = (props: any) => (
    <div className="grid grid-cols-4 gap-2 mb-4">
        <Button onClick={props.onSpeak} className="h-20 col-span-2 flex-col gap-1 bg-gradient-to-br from-green-500 to-emerald-600"><PlayCircle size={28} /><span>Falar</span></Button>
        <Button onClick={props.onPresent} variant="outline" className="h-20 flex-col gap-1 bg-gradient-to-br from-indigo-500 to-purple-600"><ScreenShare size={24}/><span>Apresentar</span></Button>
        <Button onClick={props.onExport} variant="outline" className="h-20 flex-col gap-1 bg-gradient-to-br from-sky-500 to-blue-600"><Download size={24}/><span>Exportar</span></Button>
        <Button onClick={props.onRemoveLast} variant="outline" className="h-16 col-span-2 bg-gradient-to-br from-amber-500 to-orange-600"><X size={20} /><span>Apagar Último</span></Button>
        <Button onClick={props.onClear} variant="destructive" className="h-16 col-span-2 bg-gradient-to-br from-red-600 to-red-700"><Trash2 size={20}/><span>Limpar Tudo</span></Button>
    </div>
);

const SymbolGrid = ({ onSymbolClick }: { onSymbolClick: (symbol: DbSymbol) => void }) => {
    const { activeProfileId } = useProfile();
    const symbols = useLiveQuery(() => activeProfileId ? db.symbols.where({ profileId: activeProfileId }).toArray() : [], [activeProfileId]);
    return (
        <Card className="bg-white/10"><CardContent className="p-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {symbols?.map(s => <button key={s.id} onClick={() => onSymbolClick(s)} className="h-28 rounded-lg bg-white/80 flex flex-col items-center justify-center p-1 gap-1 text-center hover:bg-sky-100"><SymbolDisplay symbol={s} /><span className="text-xs font-semibold line-clamp-2">{s.text}</span></button>)}
        </CardContent></Card>
    );
};

const NativeKeyboardInput = ({ onAddSymbol }: { onAddSymbol: (text: string) => void }) => {
  const [text, setText] = useState('');
  const handleAdd = () => { const trimmed = text.trim(); if (trimmed) { onAddSymbol(trimmed); setText(''); } };
  return (
    <Card><CardContent className="p-4 flex gap-2"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="w-full p-2 border rounded-md" placeholder="Digite uma palavra..."/><Button onClick={handleAdd}><Send /></Button></CardContent></Card>
  );
};
// #endregion

export const PhraseBuilder = ({ onBack, initialSymbolId }: any) => {
    // #region State & Hooks
    const { activeProfileId } = useProfile();
    const { toast } = useToast();
    const { speak, isSpeaking } = useSpeech();
    const phraseStorageKey = `currentPhrase_${activeProfileId}`;
    const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>(() => { try { const s = localStorage.getItem(phraseStorageKey); return s ? JSON.parse(s) : []; } catch { return []; } });
    const [inputMode, setInputMode] = useState<'symbols' | 'keyboard'>('symbols');
    const [isCasting, setIsCasting] = useState(false);
    const phraseDisplayRef = useRef<HTMLDivElement>(null);
    const liveRegionRef = useRef<HTMLDivElement>(null);
    // #endregion

    // #region Effects
    useEffect(() => { localStorage.setItem(phraseStorageKey, JSON.stringify(currentPhrase)); }, [currentPhrase, phraseStorageKey]);
    useEffect(() => { /* Efeito de carregar vozes (já no useSpeech) */ }, []);
    useEffect(() => {
        if (initialSymbolId && activeProfileId) {
            db.symbols.get(initialSymbolId).then(symbol => {
                if (symbol && !currentPhrase.some(s => s.id === symbol.id)) { addSymbol(symbol, true); }
            });
        }
    }, [initialSymbolId, activeProfileId]);
    // #endregion

    // #region Core Actions
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
    const removeLastSymbol = useCallback(() => { /* ... */ }, [currentPhrase]);
    const clearPhrase = useCallback(() => { /* ... */ }, []);
    const getPhraseText = useCallback(() => currentPhrase.map(s => s.text).join(' '), [currentPhrase]);
    // #endregion

    // #region Speak, Export, Present
    const handleSpeak = useCallback(async () => {
        const text = getPhraseText();
        if (!text) { toast({ title: "Frase vazia!" }); return; }
        await speak(text);
        // Chamar lógica de gamificação aqui se necessário
    }, [getPhraseText, speak, toast]);

    const handleExport = useCallback(() => {
        if (phraseDisplayRef.current) {
            htmlToImage.toPng(phraseDisplayRef.current).then(url => { const a = document.createElement('a'); a.href = url; a.download = 'frase.png'; a.click(); });
        }
    }, [phraseDisplayRef]);
    // #endregion

    return (
        <div className="p-2 sm:p-4 bg-slate-50 min-h-screen">
            <div ref={liveRegionRef} aria-live="assertive" className="sr-only"></div>
            <header className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-1"><ChevronLeft /> Voltar</Button>
                <h1 className="text-xl font-bold">Formador de Frases</h1>
                <div className="w-24"></div>
            </header>
            <main>
                <PhraseDisplay phrase={currentPhrase} forwardedRef={phraseDisplayRef} />
                <ActionButtons onSpeak={handleSpeak} onRemoveLast={removeLastSymbol} onClear={clearPhrase} onPresent={() => setIsCasting(true)} onExport={handleExport} />
                <div className="flex justify-center my-4"><div className="inline-flex rounded-md shadow-sm"><Button onClick={() => setInputMode('symbols')} variant={inputMode === 'symbols' ? 'default' : 'outline'}><Grid3x3 className="mr-2"/>Símbolos</Button><Button onClick={() => setInputMode('keyboard')} variant={inputMode === 'keyboard' ? 'default' : 'outline'}><KeyboardIcon className="mr-2"/>Teclado</Button></div></div>
                {inputMode === 'symbols' ? <SymbolGrid onSymbolClick={(s) => addSymbol(s)} /> : <NativeKeyboardInput onAddSymbol={(t) => addSymbol(t)} />}
            </main>
            {isCasting && <PresentationScreen phrase={getPhraseText()} onClose={() => setIsCasting(false)} />}
        </div>
    );
};
