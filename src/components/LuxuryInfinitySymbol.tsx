
import React from 'react';
import { motion } from 'framer-motion';

interface LuxuryInfinitySymbolProps {
  size?: number;
  className?: string;
}

export const LuxuryInfinitySymbol: React.FC<LuxuryInfinitySymbolProps> = ({
  size = 160,
  className = '',
}) => {
  const svgSize = size;
  const viewBoxSize = 400;
  
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: svgSize, height: svgSize * 0.6 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <svg 
        width={svgSize} 
        height={svgSize * 0.6} 
        viewBox="0 0 400 240" 
        fill="none"
        className="drop-shadow-2xl"
      >
        <defs>
          {/* Gradientes para o efeito 3D luxuoso */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="30%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          
          <linearGradient id="lightBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          
          {/* Sombras e efeitos */}
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offset"/>
            <feFlood floodColor="#000000" floodOpacity="0.3"/>
            <feComposite in2="offset" operator="in"/>
          </filter>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradiente radial para brilho */}
          <radialGradient id="shine" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* Símbolo do infinito - parte escura (esquerda) */}
        <motion.path
          d="M80 120 C80 80, 120 40, 160 40 C200 40, 240 80, 240 120 C240 160, 200 200, 160 200 C120 200, 80 160, 80 120 Z"
          fill="url(#blueGradient)"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
        
        {/* Símbolo do infinito - parte clara (direita) */}
        <motion.path
          d="M240 120 C240 80, 280 40, 320 40 C360 40, 400 80, 400 120 C400 160, 360 200, 320 200 C280 200, 240 160, 240 120 Z"
          fill="url(#lightBlueGradient)"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.7 }}
        />
        
        {/* Conexão central com gradiente */}
        <motion.ellipse
          cx="240"
          cy="120"
          rx="20"
          ry="40"
          fill="url(#blueGradient)"
          opacity="0.8"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.8 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        />
        
        {/* Efeitos de brilho */}
        <motion.ellipse
          cx="160"
          cy="80"
          rx="30"
          ry="20"
          fill="url(#shine)"
          opacity="0.6"
          animate={{ 
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.ellipse
          cx="320"
          cy="80"
          rx="30"
          ry="20"
          fill="url(#shine)"
          opacity="0.6"
          animate={{ 
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </svg>
    </motion.div>
  );
};
