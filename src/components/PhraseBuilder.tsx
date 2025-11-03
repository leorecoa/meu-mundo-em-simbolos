import { useState, useEffect, useCallback } from 'react';
import { /* ...imports... */ } from 'lucide-react';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import { usePhraseActions } from '@/hooks/usePhraseActions';
import { useGamification } from '@/hooks/useGamification';
import { SymbolDisplay } from '@/components/ui/SymbolDisplay';

interface PhraseBuilderProps {
  onBack: () => void;
  initialSymbolId?: number;
}

// Sub-componentes de UI (PhraseDisplay, ActionButtons, etc.) permanecem aqui
// ...

export const PhraseBuilder = ({ onBack, initialSymbolId }: PhraseBuilderProps) => {
  const { activeProfileId } = useProfile();
  const { 
    currentPhrase, 
    addSymbol, 
    removeLastSymbol, 
    clearPhrase, 
    speakPhrase, 
    exportPhrase, 
    phraseDisplayRef,
    getPhraseText
  } = usePhraseActions();
  
  const { triggerPhraseGamification } = useGamification();

  useEffect(() => {
    // Lógica para adicionar símbolo inicial, se houver
    if (initialSymbolId && activeProfileId) {
      db.symbols.get(initialSymbolId).then(symbol => {
        if (symbol) addSymbol(symbol);
      });
    }
  }, [initialSymbolId, activeProfileId, addSymbol]);

  const handleSpeak = () => {
    speakPhrase();
    triggerPhraseGamification(currentPhrase.length);
  };

  return (
    <div className="p-4">
      <header>...</header>
      <main>
        <PhraseDisplay phrase={currentPhrase} forwardedRef={phraseDisplayRef} />
        <ActionButtons 
          onSpeak={handleSpeak} 
          onExport={exportPhrase}
          // ...outros botões
        />
        {/* ...outros componentes de UI... */}
      </main>
    </div>
  );
};
