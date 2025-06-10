import React from 'react';

interface InfinitySymbolProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const InfinitySymbol: React.FC<InfinitySymbolProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}) => {
  // Proporções para um símbolo de infinito simples (8 deitado)
  const width = size;
  const height = size * 0.5;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Símbolo do infinito simples (8 deitado) */}
      <path
        d={`
          M ${width * 0.25} ${height / 2}
          C ${width * 0.1} ${height * 0.2}, ${width * 0.4} ${height * 0.2}, ${width * 0.5} ${height / 2}
          C ${width * 0.6} ${height * 0.8}, ${width * 0.9} ${height * 0.8}, ${width * 0.75} ${height / 2}
          C ${width * 0.9} ${height * 0.2}, ${width * 0.6} ${height * 0.2}, ${width * 0.5} ${height / 2}
          C ${width * 0.4} ${height * 0.8}, ${width * 0.1} ${height * 0.8}, ${width * 0.25} ${height / 2}
        `}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};