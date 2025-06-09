import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { PhraseSymbol } from '@/lib/storage';

interface SymbolDropZoneProps {
  onDrop: (item: PhraseSymbol) => void;
  children: React.ReactNode;
  className?: string;
}

export const SymbolDropZone = ({ onDrop, children, className = '' }: SymbolDropZoneProps) => {
  const { currentTheme } = useTheme();
  const [isOver, setIsOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = dropZoneRef.current;
    if (!element) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!isOver) {
        setIsOver(true);
      }
      
      // Definir efeito de arrastar
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      // Verificar se realmente saiu da zona (não apenas entrou em um filho)
      if (e.target === element) {
        setIsOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      
      if (!e.dataTransfer) return;
      
      try {
        // Tentar obter dados do item arrastado
        const data = e.dataTransfer.getData('application/json');
        if (data) {
          const parsedData = JSON.parse(data);
          
          // Verificar se é um símbolo válido
          if (parsedData.type === 'symbol' || parsedData.id) {
            const symbol: PhraseSymbol = {
              id: parsedData.id,
              text: parsedData.text,
              iconUrl: parsedData.iconUrl
            };
            
            // Chamar callback com o símbolo
            onDrop(symbol);
          }
        }
      } catch (err) {
        console.error('Erro ao processar item arrastado:', err);
      }
    };

    // Adicionar eventos
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // Limpar eventos
    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [onDrop, isOver]);

  return (
    <div 
      ref={dropZoneRef}
      className={`
        ${className}
        ${isOver ? `${currentTheme.buttonBg} border-2 border-dashed border-blue-400` : ''}
        transition-colors duration-200
      `}
    >
      {children}
    </div>
  );
};