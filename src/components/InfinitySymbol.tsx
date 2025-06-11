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
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M25 25C25 36.046 16.046 45 5 45C-0.52285 45 -5 40.5228 -5 35C-5 29.4772 -0.52285 25 5 25C10.5228 25 15 29.4772 15 35C15 40.5228 10.5228 45 5 45C16.046 45 25 36.046 25 25ZM75 25C75 13.954 83.954 5 95 5C100.523 5 105 9.47715 105 15C105 20.5228 100.523 25 95 25C89.4772 25 85 20.5228 85 15C85 9.47715 89.4772 5 95 5C83.954 5 75 13.954 75 25ZM5 25C16.046 5 83.954 5 95 25C83.954 45 16.046 45 5 25Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};