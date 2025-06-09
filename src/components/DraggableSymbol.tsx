import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { PhraseSymbol } from '@/lib/storage';

interface DraggableSymbolProps {
  symbol: PhraseSymbol;
  index: number;
  onRemove: (index: number) => void;
  onDragEnd: (result: { source: number; destination: number | null }) => void;
}

export const DraggableSymbol = ({ symbol, index, onRemove, onDragEnd }: DraggableSymbolProps) => {
  const { currentTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const symbolRef = useRef<HTMLDivElement>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Configurar eventos de arrastar
  useEffect(() => {
    const element = symbolRef.current;
    if (!element) return;

    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      
      setIsDragging(true);
      
      // Armazenar posição inicial
      dragStartPosRef.current = {
        x: e.clientX,
        y: e.clientY
      };
      
      // Configurar dados de transferência
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/json', JSON.stringify({
        type: 'symbol',
        index,
        id: symbol.id,
        text: symbol.text
      }));
      
      // Criar imagem de arrastar personalizada
      if (element) {
        const rect = element.getBoundingClientRect();
        dragOffsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        // Usar o próprio elemento como preview (opcional)
        try {
          const dragImage = element.cloneNode(true) as HTMLElement;
          dragImage.style.opacity = '0.7';
          dragImage.style.position = 'absolute';
          dragImage.style.top = '-1000px';
          document.body.appendChild(dragImage);
          e.dataTransfer.setDragImage(dragImage, dragOffsetRef.current.x, dragOffsetRef.current.y);
          
          // Remover o elemento após o uso
          setTimeout(() => {
            document.body.removeChild(dragImage);
          }, 0);
        } catch (err) {
          console.error('Erro ao criar imagem de arrastar:', err);
        }
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      setIsDragging(false);
      
      // Calcular posição final
      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;
      
      // Determinar se foi um movimento significativo
      const isSignificantMove = Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50;
      
      // Encontrar elemento de destino
      let destinationIndex = null;
      
      if (isSignificantMove) {
        // Lógica para encontrar o elemento de destino
        // Isso seria implementado com base na posição final
      }
      
      // Chamar callback com resultado
      onDragEnd({
        source: index,
        destination: destinationIndex
      });
    };

    // Adicionar eventos
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);

    // Limpar eventos
    return () => {
      element.removeAttribute('draggable');
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
    };
  }, [index, symbol, onDragEnd]);

  return (
    <div 
      ref={symbolRef}
      className={`relative ${currentTheme.buttonBg} rounded-lg p-3 flex flex-col items-center
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-opacity cursor-grab active:cursor-grabbing`}
    >
      <Button 
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-50"
        onClick={() => onRemove(index)}
      >
        <X className="h-3 w-3 text-gray-500" />
      </Button>
      <div className="h-16 w-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-3xl">
        {symbol.iconUrl ? (
          <img src={symbol.iconUrl} alt={symbol.text} className="h-12 w-12" />
        ) : (
          symbol.text.charAt(0)
        )}
      </div>
      <span className={`text-sm font-bold ${currentTheme.textColor}`}>{symbol.text}</span>
    </div>
  );
};