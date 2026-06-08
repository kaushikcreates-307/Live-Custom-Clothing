/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function BrandLogo({ className = "w-18 h-10", iconOnly = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none text-left">
      <div className={`relative flex items-center justify-center ${className} transition-transform duration-300 hover:scale-105`}>
        {/* Beautiful high-fidelity SVG reproducing the winged gold cursive 'Live' diamond logo */}
        <svg 
          viewBox="0 0 220 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Google Fonts Import for Dancing Script font inside the SVG */}
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;display=swap');
              .cursive-live {'{'}
                font-family: 'Dancing Script', 'Great Vibes', 'Brush Script MT', cursive;
                font-weight: 700;
              {'}'}
            </style>

            {/* Rich 3D metallic gold gradient with shadows and highlights */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFECA6" />
              <stop offset="35%" stopColor="#E5A919" />
              <stop offset="65%" stopColor="#C48E0E" />
              <stop offset="100%" stopColor="#875E00" />
            </linearGradient>

            {/* Radiant softer highlight for gold stars and fill */}
            <linearGradient id="goldHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4990A" />
              <stop offset="50%" stopColor="#FFF2C2" />
              <stop offset="100%" stopColor="#EFC64F" />
            </linearGradient>

            {/* Metallic rim stroke gradient to define sharp edge carvings */}
            <linearGradient id="rimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="50%" stopColor="#DAA015" />
              <stop offset="100%" stopColor="#553C00" />
            </linearGradient>

            {/* Subtle premium gold reflection shadow drop */}
            <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#4B3400" floodOpacity="0.45" />
            </filter>

            {/* A perfectly styled 5-point star centered at 0,0 */}
            <g id="goldStar">
              <polygon 
                points="0,-4 1.1,-1.2 4.1,-1.2 1.6,0.5 2.6,3.4 0,1.7 -2.6,3.4 -1.6,0.5 -4.1,-1.2 -1.1,-1.2" 
                fill="url(#goldGradient)"
                stroke="url(#rimGradient)"
                strokeWidth="0.32"
                filter="url(#goldShadow)"
              />
            </g>

            {/* Symmetrical Left Wing Feathers group */}
            <g id="leftWing" filter="url(#goldShadow)">
              {/* Feathers radiating outwards and upwards, mimicking natural eagle curvature */}
              <path d="M 78 50 C 55 25, 30 18, 5 22 C 25 32, 55 42, 75 52 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 77 54 C 55 33, 31 25, 10 30 C 28 38, 56 46, 74 56 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 75 58 C 56 41, 34 34, 15 38 C 32 44, 56 50, 72 60 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 74 62 C 57 48, 38 43, 20 46 C 36 50, 56 54, 71 64 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 71 66 C 57 54, 40 50, 25 54 C 40 56, 55 58, 69 68 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 69 70 C 57 60, 42 57, 30 62 C 43 62, 55 62, 67 72 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 67 74 C 56 66, 44 64, 35 70 C 45 68, 55 66, 65 76 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
              <path d="M 65 78 C 55 72, 46 71, 40 78 C 48 76, 56 72, 63 80 Z" fill="url(#goldGradient)" stroke="url(#rimGradient)" strokeWidth="0.5" />
            </g>
          </defs>

          {/* BACKGROUND WINGS GROUP (Rendered first) */}
          <g>
            {/* Left Wing */}
            <use href="#leftWing" />
            {/* Right Wing (mirrored symmetrically) */}
            <use href="#leftWing" transform="translate(220, 0) scale(-1, 1)" />
          </g>

          {/* FOREGROUND CENTRAL SHIELD / DIAMOND */}
          <g filter="url(#goldShadow)">
            {/* White diamond inner backing fill */}
            <polygon 
              points="92,45 128,45 145,62 110,95 75,62" 
              fill="#FFFFFF" 
            />
            {/* outer thick golden diamond cut border */}
            <polygon 
              points="92,45 128,45 145,62 110,95 75,62" 
              fill="none" 
              stroke="url(#goldGradient)" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
            />
            {/* second inner fine hairline gold trim */}
            <polygon 
              points="93.2,46.8 126.8,46.8 142.2,62 110,92.5 77.8,62" 
              fill="none" 
              stroke="url(#goldHighlight)" 
              strokeWidth="0.75" 
              strokeLinejoin="round"
              opacity="0.85"
            />
          </g>

          {/* FIVE STARS ACCENTS PLACEMENT */}
          <use href="#goldStar" x="83" y="62" />
          <use href="#goldStar" x="137" y="62" />
          <use href="#goldStar" x="97" y="78" />
          <use href="#goldStar" x="123" y="78" />
          <use href="#goldStar" x="110" y="88" />

          {/* CENTRAL ELEVATED CURSIVE "Live" SCRIPT */}
          <g filter="url(#goldShadow)">
            <text 
              x="110" 
              y="60" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="cursive-live" 
              fill="url(#goldHighlight)"
              stroke="#A27305"
              strokeWidth="0.3"
              style={{ fontSize: '20px' }}
            >
              Live
            </text>
          </g>
        </svg>
      </div>
      {!iconOnly && (
        <div className="font-display">
          <h1 className="text-base md:text-lg font-display font-black text-slate-900 leading-none tracking-tight">
            Live Custom Clothing
          </h1>
          <p className="text-[9px] text-emerald-600 font-mono font-black tracking-widest uppercase mt-1">
            "You Wear It. We Share It."
          </p>
        </div>
      )}
    </div>
  );
}
