import React, { useState } from 'react';
import BrandLogo from './BrandLogo';

const liveLogoImg = new URL('./LiveLogo.png', import.meta.url).href;

interface LiveLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function LiveLogo({ className = "w-18 h-10", iconOnly = false }: LiveLogoProps) {
  const [hasError, setHasError] = useState(false);

  // If the PNG image fails to load (e.g. because it is currently empty),
  // we gracefully fall back to the beautiful SVGA-style vector BrandLogo.
  if (hasError || !liveLogoImg) {
    return <BrandLogo className={className} iconOnly={iconOnly} />;
  }

  return (
    <div className="flex items-center gap-2.5 select-none text-left">
      <div className={`relative flex items-center justify-center ${className} transition-transform duration-300 hover:scale-105`}>
        <img
          src={liveLogoImg}
          alt="Live Custom Logo"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain"
          style={{ minWidth: '40px' }}
        />
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
