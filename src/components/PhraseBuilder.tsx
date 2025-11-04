import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft, Keyboard as KeyboardIcon, Grid3x3, Send, Copy, Share2, Award, MessageSquarePlus, ScreenShare, Download } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import * as htmlToImage from 'html-to-image';
import { SymbolDisplay } from '@/components/ui/SymbolDisplay';
import { PresentationScreen } from './PresentationScreen';

interface PhraseBuilderProps { onBack: () => void; initialSymbolId?: number; }

// #region Sub-componentes de UI
const PhraseDisplay = ({ phrase, forwardedRef }: { phrase: DbSymbol[], forwardedRef: React.Ref<HTMLDivElement> }) => (
    <Card ref={forwardedRef} className="mb-4 min-h-[160px] shadow-xl bg-black/30 backdrop-blur-lg border-white/10 flex items-center justify-center p-4 text-white">
        <CardContent className="w-full">
            {phrase.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">{phrase.map((symbol, index) => (<div key={`${symbol.id}-${index}`} className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95"><div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center shadow-inner overflow-hidden"><SymbolDisplay symbol={symbol} /></div></div>))}</div>
            ) : (
                <div className="text-center text-slate-300/80 p-6 flex flex-col items-center justify-center"><MessageSquarePlus className="h-12 w-12 mb-4" /><h3 className="font-bold text-lg mb-1">Frase Vazia</h3><p className="text-sm max-w-xs">Clique nos símbolos abaixo ou use o teclado para começar.</p></div>
            )}
        </CardContent>
    </Card>
);
const ActionButtons = (props: any) => (
    <div className="grid grid-cols-4 gap-2 mb-4">
        <Button onClick={props.onSpeak} className="h-20 col-span-2 flex-col gap-1 bg-gradient-to-br from-green-500 to-green-600"><PlayCircle size={28} /><span>Falar</span></Button>
        <Button onClick={props.onPresent} variant="outline" className="h-20 flex-col gap-1 bg-gradient-to-br from-indigo-500 to-purple-500"><ScreenShare size={24}/><span>Apresentar</span></Button>
        <Button onClick={props.onExport} variant="outline" className="h-20 flex-col gap-1 bg-gradient-to-br from-sky-500 to-blue-600"><Download size={24}/><span>Exportar</span></Button>
        <Button onClick={props.onRemoveLast} variant="outline" className="h-16 col-span-2 bg-gradient-to-br from-amber-500 to-orange-600"><X size={20} /><span>Apagar Último</span></Button>
        <Button onClick={props.onClear} variant="destructive" className="h-16 col-span-2 bg-gradient-to-br from-red-600 to-red-700"><Trash2 size={20}/><span>Limpar Tudo</span></Button>
    </div>
);
// ... (outros sub-componentes de UI como SymbolGrid, etc.)
// #endregion

export const PhraseBuilder = ({ onBack, initialSymbolId }: PhraseBuilderProps) => {
    // #region State
    const { activeProfileId } = useProfile();
    const phraseStorageKey = `currentPhrase_${activeProfileId}`;
    const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>(() => { try { const saved = localStorage.getItem(phraseStorageKey); return saved ? JSON.parse(saved) : []; } catch { return []; } });
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
    const [isCasting, setIsCasting] = useState(false);
    const { toast } = useToast();
    const phraseDisplayRef = useRef<HTMLDivElement>(null);
    const liveRegionRef = useRef<HTMLDivElement>(null);
    // #endregion

    // #region Effects
    useEffect(() => { localStorage.setItem(phraseStorageKey, JSON.stringify(currentPhrase)); }, [currentPhrase, phraseStorageKey]);
    useEffect(() => { /* Efeito para carregar vozes */ }, []);
    useEffect(() => {
        if (initialSymbolId && activeProfileId) {
            db.symbols.get(initialSymbolId).then(symbol => {
                if (symbol && !currentPhrase.some(s => s.id === symbol.id)) {
                    addSymbol(symbol);
                }
            });
        }
    }, [initialSymbolId, activeProfileId]);
    // #endregion

    // #region Core Phrase Actions
    const addSymbol = useCallback((symbol: DbSymbol) => {
        setCurrentPhrase(prev => [...prev, symbol]);
        if (liveRegionRef.current) liveRegionRef.current.textContent = `Símbolo ${symbol.text} adicionado.`;
    }, []);
    const removeLastSymbol = useCallback(() => {
        if (currentPhrase.length > 0 && liveRegionRef.current) liveRegionRef.current.textContent = `Símbolo ${currentPhrase[currentPhrase.length - 1].text} removido.`;
        setCurrentPhrase(prev => prev.slice(0, -1));
    }, [currentPhrase]);
    const clearPhrase = useCallback(() => {
        if (liveRegionRef.current) liveRegionRef.current.textContent = `Frase limpa.`;
        setCurrentPhrase([]);
    }, []);
    const getPhraseText = useCallback(() => currentPhrase.map(s => s.text).join(' '), [currentPhrase]);
    // #endregion

    // #region Gamification
    const triggerPhraseGamification = useCallback(async () => {
        // ... (toda a lógica de gamificação que já tínhamos vai aqui)
    }, [toast, getPhraseText]);
    // #endregion

    // #region Speak, Export, Present
    const speakPhrase = useCallback(() => {
        const phraseText = getPhraseText();
        if (!phraseText) { toast({ title: "Frase vazia!" }); return; }
        const utterance = new SpeechSynthesisUtterance(phraseText);
        // ... (lógica de configurar voz)
        window.speechSynthesis.speak(utterance);
        triggerPhraseGamification();
    }, [getPhraseText, voices, selectedVoiceName, toast, triggerPhraseGamification]);

    const exportPhrase = useCallback(() => {
        if (!phraseDisplayRef.current) return;
        htmlToImage.toPng(phraseDisplayRef.current).then(dataUrl => {
            const link = document.createElement('a');
            link.download = 'frase.png';
            link.href = dataUrl;
            link.click();
        }).catch(err => toast({ title: "Erro ao exportar imagem" }));
    }, [phraseDisplayRef, toast]);
    // #endregion

    return (
        <div className="p-4">
            <div ref={liveRegionRef} aria-live="assertive" className="sr-only"></div>
            <header> {/* ... */} </header>
            <main>
                <PhraseDisplay phrase={currentPhrase} forwardedRef={phraseDisplayRef} />
                <ActionButtons 
                    onSpeak={speakPhrase} 
                    onRemoveLast={removeLastSymbol} 
                    onClear={clearPhrase} 
                    onPresent={() => setIsCasting(true)} 
                    onExport={exportPhrase} 
                />
                {/* ... (resto da UI) ... */}
            </main>
            {isCasting && <PresentationScreen phrase={getPhraseText()} onClose={() => setIsCasting(false)} />}
        </div>
    );
};
