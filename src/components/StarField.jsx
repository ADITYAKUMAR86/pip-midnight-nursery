import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

export default function StarField({ 
  onStarClick, 
  secretUnlocked,
  isNightMode = false,
  reducedMotion = false 
}) {
  // Generate a collection of fixed twinkling stars with distinct sizes & positions
  const stars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      top: `${(i * 17) % 94 + 3}%`,
      left: `${(i * 23) % 94 + 3}%`,
      size: (i % 3) + 2.5, // 2.5px to 4.5px
      opacity: ((i % 5) + 3) / 10,
      duration: `${3.2 + (i % 4) * 0.8}s`,
      delay: `${(i % 5) * 0.6}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      
      {/* Global SVG Filter Definitions for Tasteful 3D Volumetric Depth */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Volumetric Soft Embossed Lighting Filter */}
          <filter id="nursery-embossed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.75" specularExponent="18" lightingColor="#fff8f1" result="spec">
              <fePointLight x="-10" y="-10" z="35" />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" />
          </filter>

          {/* Starlight Volumetric Glow Filter */}
          <filter id="starlight-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Fluffy Soft Pink Bedtime Clouds with Gentle Drift */}
      <div 
        className={`absolute -top-16 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#f3dce3] opacity-60 blur-3xl ${
          reducedMotion ? '' : 'animate-cloud-drift'
        }`}
      />
      <div 
        className={`absolute top-1/4 -right-24 w-80 sm:w-[32rem] h-80 sm:h-[32rem] rounded-full bg-[#dfd5e6] opacity-45 blur-3xl ${
          reducedMotion ? '' : 'animate-cloud-drift'
        }`}
        style={{ animationDelay: '-12s' }}
      />
      <div 
        className="absolute bottom-16 left-1/4 w-72 h-72 rounded-full bg-[#f3dce3] opacity-40 blur-2xl"
      />

      {/* Twinkling ambient stardust specks strictly in approved palette */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${reducedMotion ? '' : 'animate-twinkle'}`}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.id % 3 === 0 
              ? '#a34063' 
              : star.id % 3 === 1 
                ? '#f3dce3' 
                : '#dfd5e6',
            opacity: star.opacity * (isNightMode ? 0.95 : 0.7),
            animationDuration: star.duration,
            animationDelay: star.delay,
            boxShadow: '0 0 4px rgba(163, 64, 99, 0.35)'
          }}
        />
      ))}

      {/* THE SECRET STAR (Interactive Easter Egg) */}
      <div 
        className="absolute top-[16%] right-[10%] sm:right-[13%] pointer-events-auto cursor-pointer group select-none"
        onClick={onStarClick}
        title="A mysterious celestial star..."
        aria-label="Secret Starlight Easter Egg"
      >
        <div className="relative flex items-center justify-center p-3.5 min-w-[50px] min-h-[50px]">
          
          {/* Subtle Pulsing Berry / Soft Pink Aura Hint */}
          <div className="absolute inset-0 rounded-full bg-[#f3dce3] blur-md group-hover:scale-150 transition-transform duration-500 animate-pulse-glow" />
          
          <Star 
            className="w-7 h-7 sm:w-8 sm:h-8 text-[#a34063] fill-[#f3dce3] transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-45 drop-shadow-[0_2px_8px_rgba(163,64,99,0.45)]" 
          />
          
          {/* Floating hint tooltip on hover */}
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#fff8f1] text-[#5c4033] border border-[#a34063] shadow-md">
              {secretUnlocked ? '✨ Secret Chamber Unlocked!' : 'A mysterious celestial star...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
