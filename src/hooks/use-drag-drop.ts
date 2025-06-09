import { useState, useRef, useCallback } from 'react';

interface DragItem {
  id: string;
  type: string;
  index?: number;
  [key: string]: any;
}

interface DropResult {
  dropEffect: string;
  [key: string]: any;
}

export function useDragDrop<T extends DragItem>() {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const dragSourceRef = useRef<HTMLElement | null>(null);
  const dragPreviewRef = useRef<HTMLElement | null>(null);

  // Iniciar o arrastar
  const handleDragStart = useCallback((item: T, sourceRef: HTMLElement, previewRef?: HTMLElement) => {
    setIsDragging(true);
    setDraggedItem(item);
    dragSourceRef.current = sourceRef;
    dragPreviewRef.current = previewRef || sourceRef;

    // Configurar dados de transferência
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('application/json', JSON.stringify(item));
    
    // Criar evento personalizado
    const dragStartEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer: dataTransfer as any,
    });
    
    // Disparar evento
    sourceRef.dispatchEvent(dragStartEvent);
    
    return true;
  }, []);

  // Finalizar o arrastar
  const handleDragEnd = useCallback((result?: DropResult) => {
    setIsDragging(false);
    setDraggedItem(null);
    dragSourceRef.current = null;
    dragPreviewRef.current = null;
    
    return result || { dropEffect: 'none' };
  }, []);

  // Verificar se pode soltar
  const canDrop = useCallback((targetType: string | string[]) => {
    if (!draggedItem) return false;
    
    if (Array.isArray(targetType)) {
      return targetType.includes(draggedItem.type);
    }
    
    return draggedItem.type === targetType;
  }, [draggedItem]);

  // Manipular soltar
  const handleDrop = useCallback((item: T, targetRef: HTMLElement, onDrop: (item: T) => void) => {
    if (!draggedItem) return false;
    
    onDrop(item);
    handleDragEnd({ dropEffect: 'move' });
    
    return true;
  }, [draggedItem, handleDragEnd]);

  // Reordenar itens em uma lista
  const reorderItems = useCallback(<I>(items: I[], startIndex: number, endIndex: number): I[] => {
    const result = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }, []);

  // Mover item entre listas
  const moveItem = useCallback(<I>(sourceItems: I[], destinationItems: I[], sourceIndex: number, destinationIndex: number) => {
    const sourceClone = Array.from(sourceItems);
    const destClone = Array.from(destinationItems);
    const [removed] = sourceClone.splice(sourceIndex, 1);
    
    destClone.splice(destinationIndex, 0, removed);
    
    return { sourceItems: sourceClone, destinationItems: destClone };
  }, []);

  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    canDrop,
    handleDrop,
    reorderItems,
    moveItem
  };
}