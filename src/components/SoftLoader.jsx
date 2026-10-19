import React, { useState, useEffect } from 'react';

export default function SoftLoader({ minDuration = 1200 }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDuration);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, minDuration + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDuration]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fff8f1] text-[#5c4033] select-none transition-opacity duration-600 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Midnight Nursery"
    >
      <div className="relative flex flex-col items-center space-y-5">
        
        {/* Soft Volumetric Rocking Moon SVG */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#f3dce3] blur-2xl opacity-60 animate-pulse-glow" />
          
          <svg viewBox="0 0 100 100" className="w-24 h-24 animate-float">
            <defs>
              <linearGradient id="loaderMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8f1" />
                <stop offset="65%" stopColor="#f3dce3" />
                <stop offset="100%" stopColor="#a34063" />
              </linearGradient>
            </defs>
            <path
              d="M 50 15 A 35 35 0 1 0 85 50 A 28 28 0 1 1 50 15 Z"
              fill="url(#loaderMoonGrad)"
              stroke="#a34063"
              strokeWidth="1.5"
            />
          </svg>

          {/* Twinkling mini stardust beside moon */}
          <span className="absolute top-2 right-1 w-2.5 h-2.5 rounded-full bg-[#a34063] animate-ping" />
        </div>

        {/* Storybook Welcome Text */}
        <div className="text-center space-y-1">
          <h2 className="font-heading text-xl font-bold text-[#a34063] tracking-wide">
            Midnight Nursery
          </h2>
          <p className="font-hand text-xs text-[#5c4033] opacity-80 animate-pulse">
            Fluffing fleece clouds & tucking in the stars... ☁️
          </p>
        </div>

      </div>
    </div>
  );
}
