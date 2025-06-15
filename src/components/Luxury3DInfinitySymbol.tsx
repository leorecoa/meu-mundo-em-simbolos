
import React from 'react';
import { motion } from 'framer-motion';

interface Luxury3DInfinitySymbolProps {
  size?: number;
  className?: string;
}

export const Luxury3DInfinitySymbol: React.FC<Luxury3DInfinitySymbolProps> = ({
  size = 180,
  className = '',
}) => {
  const svgSize = size;
  
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: svgSize, height: svgSize * 0.6 }}
      initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <svg 
        width={svgSize} 
        height={svgSize * 0.6} 
        viewBox="0 0 500 300" 
        fill="none"
        className="drop-shadow-2xl"
      >
        <defs>
          {/* Gradientes 3D para o lado esquerdo (azul escuro) */}
          <radialGradient id="leftLoopGradient" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="30%" stopColor="#2E5A87" />
            <stop offset="70%" stopColor="#1B365D" />
            <stop offset="100%" stopColor="#0F1B2E" />
          </radialGradient>
          
          {/* Gradientes 3D para o lado direito (azul claro) */}
          <radialGradient id="rightLoopGradient" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="30%" stopColor="#5DADE2" />
            <stop offset="70%" stopColor="#3498DB" />
            <stop offset="100%" stopColor="#2E86AB" />
          </radialGradient>
          
          {/* Efeitos de brilho */}
          <radialGradient id="leftShine" cx="0.2" cy="0.2" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          
          <radialGradient id="rightShine" cx="0.2" cy="0.2" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          
          {/* Filtros para sombra e brilho */}
          <filter id="glow3d" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="innerShadow3d" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
            <feOffset dx="3" dy="3" result="offset"/>
            <feFlood floodColor="#000000" floodOpacity="0.4"/>
            <feComposite in2="offset" operator="in"/>
          </filter>
        </defs>
        
        {/* Loop esquerdo (azul escuro) - forma 3D */}
        <motion.path
          d="M80 150 
             C80 100, 110 60, 160 60 
             C210 60, 240 100, 240 150 
             C240 200, 210 240, 160 240 
             C110 240, 80 200, 80 150 Z"
          fill="url(#leftLoopGradient)"
          filter="url(#glow3d)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
        
        {/* Camada de profundidade do loop esquerdo */}
        <motion.path
          d="M90 150 
             C90 110, 115 80, 150 80 
             C185 80, 210 110, 210 150 
             C210 190, 185 220, 150 220 
             C115 220, 90 190, 90 150 Z"
          fill="url(#leftLoopGradient)"
          opacity="0.6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.8, delay: 0.5 }}
        />
        
        {/* Loop direito (azul claro) - forma 3D */}
        <motion.path
          d="M260 150 
             C260 100, 290 60, 340 60 
             C390 60, 420 100, 420 150 
             C420 200, 390 240, 340 240 
             C290 240, 260 200, 260 150 Z"
          fill="url(#rightLoopGradient)"
          filter="url(#glow3d)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.6 }}
        />
        
        {/* Camada de profundidade do loop direito */}
        <motion.path
          d="M290 150 
             C290 110, 315 80, 350 80 
             C385 80, 410 110, 410 150 
             C410 190, 385 220, 350 220 
             C315 220, 290 190, 290 150 Z"
          fill="url(#rightLoopGradient)"
          opacity="0.6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.8, delay: 0.8 }}
        />
        
        {/* Conexão central - interseção 3D */}
        <motion.ellipse
          cx="250"
          cy="150"
          rx="25"
          ry="50"
          fill="url(#leftLoopGradient)"
          opacity="0.9"
          filter="url(#innerShadow3d)"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.9 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }}
        />
        
        {/* Brilhos de destaque no loop esquerdo */}
        <motion.ellipse
          cx="140"
          cy="110"
          rx="35"
          ry="25"
          fill="url(#leftShine)"
          opacity="0.7"
          animate={{ 
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Brilhos de destaque no loop direito */}
        <motion.ellipse
          cx="360"
          cy="110"
          rx="35"
          ry="25"
          fill="url(#rightShine)"
          opacity="0.8"
          animate={{ 
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Reflexos adicionais para efeito 3D */}
        <motion.path
          d="M100 120 Q140 100, 180 120 Q140 140, 100 120"
          fill="rgba(255,255,255,0.3)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5, duration: 1 }}
        />
        
        <motion.path
          d="M320 120 Q360 100, 400 120 Q360 140, 320 120"
          fill="rgba(255,255,255,0.4)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.8, duration: 1 }}
        />
      </svg>
      
      {/* Animação de rotação suave */}
      <motion.div
        className="absolute inset-0"
        animate={{ 
          rotateY: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformStyle: "preserve-3d" }}
      />
    </motion.div>
  );
};
