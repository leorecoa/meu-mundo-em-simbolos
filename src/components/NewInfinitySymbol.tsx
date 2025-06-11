import React from 'react';

interface InfinitySymbolProps {
  size?: number;
  className?: string;
}

export const NewInfinitySymbol: React.FC<InfinitySymbolProps> = ({
  size = 150,
  className = '',
}) => {
  // Calcular altura proporcional
  const height = size * 0.53; // Proporção aproximada de 150:80
  
  // Escala para ajustar o viewBox original para o tamanho desejado
  const scale = size / 150;
  
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 150 80" 
      fill="none"
      className={className}
    >
      <path
        d="M30 40C30 25 50 10 75 10C100 10 120 25 120 40C120 55 100 70 75 70C50 70 30 55 30 40Z"
        stroke="#4A90E2" // Azul (representando o autismo)
        strokeWidth="8"
        fill="transparent"
      />
      <path
        d="M120 40C120 55 100 70 75 70C50 70 30 55 30 40C30 25 50 10 75 10C100 10 120 25 120 40Z"
        stroke="#50C878" // Verde (esperança/inclusão)
        strokeWidth="8"
        fill="transparent"
      />
    </svg>
  );
};