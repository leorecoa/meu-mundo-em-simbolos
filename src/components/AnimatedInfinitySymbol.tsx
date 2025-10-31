import React from 'react';

export const AnimatedInfinitySymbol = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 200 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          {/* Gradiente baseado na imagem fornecida (canto superior direito) */}
          <stop offset="0%" stopColor="#f97316" />   {/* Laranja */}
          <stop offset="25%" stopColor="#eab308" />  {/* Amarelo */}
          <stop offset="50%" stopColor="#22c55e" />  {/* Verde */}
          <stop offset="75%" stopColor="#3b82f6" />  {/* Azul */}
          <stop offset="100%" stopColor="#ef4444" /> {/* Vermelho */}
        </linearGradient>
      </defs>

      {/* Path que desenha o símbolo do infinito */}
      <path
        d="M 50,50 A 25,25 0 1,1 100,50 A 25,25 0 1,1 150,50 A 25,25 0 1,0 100,50 A 25,25 0 1,0 50,50 Z"
        stroke="url(#infinityGradient)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};
