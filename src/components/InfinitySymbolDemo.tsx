import React, { useState } from 'react';
import { InfinitySymbol } from './InfinitySymbol';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';

export const InfinitySymbolDemo = () => {
  const [size, setSize] = useState(48);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#000000');

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Símbolo do Infinito</h2>
      
      <div className="flex flex-col items-center mb-8 p-6 bg-gray-50 rounded-lg">
        <InfinitySymbol 
          size={size} 
          strokeWidth={strokeWidth} 
          color={color} 
          className="mb-4"
        />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="size">Tamanho: {size}px</Label>
          <Slider
            id="size"
            min={24}
            max={200}
            step={1}
            value={[size]}
            onValueChange={(value) => setSize(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stroke">Espessura da linha: {strokeWidth}</Label>
          <Slider
            id="stroke"
            min={0.5}
            max={5}
            step={0.1}
            value={[strokeWidth]}
            onValueChange={(value) => setStrokeWidth(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <div className="flex gap-2">
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};