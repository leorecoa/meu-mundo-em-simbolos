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
  // Proporções melhoradas para um símbolo de infinito mais realista
  const width = size;
  const height = size * 0.6;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Caminho principal com curvas suaves */}
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
      
      {/* Efeito de profundidade - sombra sutil */}
      <path
        d={`
          M ${width * 0.25 + 1} ${height / 2 + 1}
          C ${width * 0.1 + 1} ${height * 0.2 + 1}, ${width * 0.4 + 1} ${height * 0.2 + 1}, ${width * 0.5 + 1} ${height / 2 + 1}
          C ${width * 0.6 + 1} ${height * 0.8 + 1}, ${width * 0.9 + 1} ${height * 0.8 + 1}, ${width * 0.75 + 1} ${height / 2 + 1}
        `}
        stroke={color}
        strokeWidth={strokeWidth / 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.3"
        fill="none"
      />
      
      {/* Destaque para dar efeito 3D */}
      <path
        d={`
          M ${width * 0.25 - 0.5} ${height / 2 - 0.5}
          C ${width * 0.1 - 0.5} ${height * 0.2 - 0.5}, ${width * 0.4 - 0.5} ${height * 0.2 - 0.5}, ${width * 0.5 - 0.5} ${height / 2 - 0.5}
        `}
        stroke={color}
        strokeWidth={strokeWidth / 3}
        strokeLinecap="round"
        strokeOpacity="0.5"
        fill="none"
      />
    </svg>
  );
};