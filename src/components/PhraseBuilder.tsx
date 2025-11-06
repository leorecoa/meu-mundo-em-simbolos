import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
// ... (outros imports)
import { useTheme } from '@/hooks/use-theme'; // Importar useTheme
import { PresentationScreen } from './PresentationScreen';

// ... (Sub-componentes de UI)

export const PhraseBuilder = ({ onBack, initialSymbolId }: any) => {
    // #region State & Hooks
    const { activeProfileId } = useProfile();
    const { toast } = useToast();
    const { speak, isSpeaking } = useSpeech();
    const { currentTheme } = useTheme(); // <<<< Reintroduzido
    const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>([]);
    const [inputMode, setInputMode] = useState<'symbols' | 'keyboard'>('symbols');
    const [isCasting, setIsCasting] = useState(false);
    const phraseDisplayRef = useRef<HTMLDivElement>(null);
    const liveRegionRef = useRef<HTMLDivElement>(null);
    // #endregion

    // ... (Lógica de Effects e Actions)

    return (
        // Aplicar a classe de fundo do tema
        <div className={`p-2 sm:p-4 min-h-screen ${currentTheme.bgColor}`}>
            <div ref={liveRegionRef} aria-live="assertive" className="sr-only"></div>
            <header className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={onBack} className={`flex items-center gap-1 ${currentTheme.textColor}`}> {/* Cor do texto do tema */}
                    <ChevronLeft /> Voltar
                </Button>
                <h1 className={`text-xl font-bold ${currentTheme.textColor}`}>Formador de Frases</h1>
                <div className="w-24"></div>
            </header>
            <main>
                <PhraseDisplay phrase={currentPhrase} forwardedRef={phraseDisplayRef} />
                <ActionButtons 
                    onSpeak={handleSpeak} 
                    onRemoveLast={removeLastSymbol} 
                    onClear={clearPhrase} 
                    onPresent={() => setIsCasting(true)} 
                    onExport={handleExport} 
                />
                <div className="flex justify-center my-4">
                    <div className="inline-flex rounded-md shadow-sm">
                        <Button onClick={() => setInputMode('symbols')} className={`px-3 py-2 ${inputMode === 'symbols' ? currentTheme.buttonBg : 'bg-white/50' }`}>Símbolos</Button>
                        <Button onClick={() => setInputMode('keyboard')} className={`px-3 py-2 ${inputMode === 'keyboard' ? currentTheme.buttonBg : 'bg-white/50' }`}>Teclado</Button>
                    </div>
                </div>
                {inputMode === 'symbols' ? <SymbolGrid onSymbolClick={(s) => addSymbol(s)} /> : <NativeKeyboardInput onAddSymbol={(t) => addSymbol(t)} />}
            </main>
            {isCasting && <PresentationScreen phrase={getPhraseText()} onClose={() => setIsCasting(false)} />}
        </div>
    );
};
