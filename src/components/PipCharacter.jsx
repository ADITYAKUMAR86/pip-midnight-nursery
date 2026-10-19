import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Moon } from 'lucide-react';

export default function PipCharacter({ 
  onClick, 
  speechText, 
  interactive = true, 
  isSleeping = false,
  isNightMode = false,
  reducedMotion = false,
  className = "" 
}) {
  const containerRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // Subtle Eye-Tracking with motion preference guard
  useEffect(() => {
    if (isSleeping || reducedMotion) {
      setPupilOffset({ x: 0, y: 0 });
      return;
    }

    let animationFrameId;

    const handlePointerMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const faceCenterX = rect.left + rect.width * 0.51;
      const faceCenterY = rect.top + rect.height * 0.38;

      const dx = e.clientX - faceCenterX;
      const dy = e.clientY - faceCenterY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.hypot(dx, dy);

      // Subtle, safe travel radius clamped to 3.2px to stay within socket boundaries
      const maxRadius = 3.2;
      const clampedDistance = Math.min(distance / 36, maxRadius);

      const targetX = Math.cos(angle) * clampedDistance;
      const targetY = Math.sin(angle) * clampedDistance;

      animationFrameId = requestAnimationFrame(() => {
        setPupilOffset({ x: targetX, y: targetY });
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isSleeping, reducedMotion]);

  // Natural spontaneous blinking at varied intervals (with gentle baby flutter)
  useEffect(() => {
    if (isSleeping || reducedMotion) {
      setIsBlinking(false);
      return;
    }

    let blinkTimer;
    let resetTimer;
    let flutterTimer;
    let isCancelled = false;

    const scheduleNextBlink = () => {
      if (isCancelled) return;
      // Randomized bedtime interval between 3.2s and 5.6s
      const delay = 3200 + Math.random() * 2400;

      blinkTimer = setTimeout(() => {
        if (isCancelled) return;
        setIsBlinking(true);

        // Occasional sweet double-blink (18% chance)
        const isDoubleBlink = Math.random() < 0.18;

        resetTimer = setTimeout(() => {
          if (isCancelled) return;
          setIsBlinking(false);

          if (isDoubleBlink) {
            flutterTimer = setTimeout(() => {
              if (isCancelled) return;
              setIsBlinking(true);
              setTimeout(() => {
                if (isCancelled) return;
                setIsBlinking(false);
                scheduleNextBlink();
              }, 110);
            }, 130);
          } else {
            scheduleNextBlink();
          }
        }, 140);
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      isCancelled = true;
      clearTimeout(blinkTimer);
      clearTimeout(resetTimer);
      clearTimeout(flutterTimer);
    };
  }, [isSleeping, reducedMotion]);

  const handleClick = (e) => {
    if (!interactive) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 650);
    if (onClick) onClick(e);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative select-none ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      onClick={handleClick}
      aria-label="Pip the dream courier character"
    >
      {/* Interactive Speech Bubble in strict cream, brown, and soft pink */}
      {speechText && (
        <div 
          className="absolute -top-16 sm:-top-14 left-1/2 -translate-x-1/2 w-max max-w-[280px] sm:max-w-xs px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-center shadow-lg border border-[#f3dce3] bg-[#fff8f1] text-[#5c4033] z-30 animate-float-slow transition-all group-hover:border-[#a34063]"
        >
          <p className="font-hand leading-relaxed">
            "{speechText}"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-[#f3dce3] bg-[#fff8f1] group-hover:border-[#a34063]" />
        </div>
      )}

      {/* Floating Base with Jump Bounce on Click */}
      <div 
        className={`relative transition-transform duration-300 ${
          isJumping ? '-translate-y-4 scale-105' : 'hover:scale-102'
        }`}
      >
        {/* Layer 1: Volumetric SVG Moon & Halo Glow behind Pip */}
        <div className="absolute -top-10 -right-6 w-32 h-32 pointer-events-none z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(163,64,99,0.3)] animate-float-slow">
            <defs>
              <linearGradient id="pipMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8f1" />
                <stop offset="60%" stopColor="#f3dce3" />
                <stop offset="100%" stopColor="#a34063" stopOpacity="0.8" />
              </linearGradient>
              <filter id="pipMoonSpecular" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feSpecularLighting in="blur" surfaceScale="3" specularConstant="0.8" specularExponent="16" lightingColor="#fff8f1" result="spec">
                  <fePointLight x="20" y="20" z="40" />
                </feSpecularLighting>
                <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" />
              </filter>
            </defs>
            <path 
              d="M 50 15 A 35 35 0 1 0 85 50 A 28 28 0 1 1 50 15 Z" 
              fill="url(#pipMoonGrad)" 
              filter="url(#pipMoonSpecular)"
            />
          </svg>
        </div>

        {/* Soft Pink Bedtime Halo Glow behind Cloud */}
        <div 
          className="absolute inset-0 -m-8 rounded-full blur-3xl pointer-events-none bg-[#f3dce3] opacity-65 group-hover:opacity-85 transition-opacity duration-500" 
        />

        {/* Layer 2: Main Floating Pip Container */}
        <div className={`relative ${isSleeping || reducedMotion ? '' : 'animate-float'}`}>
          <img 
            src="/pip_avatar_cloud.png" 
            alt="Pip floating on a cloud" 
            className="w-72 sm:w-80 md:w-96 lg:w-[420px] max-w-full h-auto drop-shadow-[0_20px_35px_rgba(92,64,51,0.2)] transition-all duration-300"
          />

          {/* Eye Overlays: Anatomically aligned to Pip's 3/4 turned face */}
          {/* Left Eye Socket (viewer's left - 3/4 perspective) */}
          <div 
            className="absolute rounded-[50%] overflow-hidden pointer-events-none select-none"
            style={{
              left: '40.8%',
              top: '41.2%',
              width: '8.8%',
              height: '7.6%',
              transform: 'translate(-50%, -50%) rotate(-4deg)',
            }}
          >
            {/* Interactive Living Starlight Pupil with Eye-Tracking (awake only) */}
            {!isSleeping && (
              <div 
                className="absolute rounded-full pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '44%',
                  height: '52%',
                  transform: `translate(calc(-50% + ${Math.max(-2.5, Math.min(2.5, pupilOffset.x))}px), calc(-50% + ${Math.max(-2.5, Math.min(2.5, pupilOffset.y))}px))`,
                  background: 'radial-gradient(circle, #fffdfa 15%, #fef08a 45%, #f59e0b 80%, transparent 100%)',
                  boxShadow: '0 0 8px 2px rgba(254, 240, 138, 0.9), 0 0 14px 4px rgba(245, 158, 11, 0.4)',
                }}
              >
                {/* Specular Catchlight */}
                <span 
                  className="absolute top-[18%] left-[18%] w-[35%] h-[35%] rounded-full bg-white shadow-[0_0_2px_#fff]" 
                />
              </div>
            )}

            {/* Soft Cream Eyelid for Natural Blinking & Peaceful Sleep */}
            <div 
              className="absolute inset-0 rounded-[50%] pointer-events-none transition-transform ease-in-out"
              style={{
                transformOrigin: 'top center',
                transform: (isSleeping || isBlinking) ? 'scaleY(1)' : 'scaleY(0)',
                transitionDuration: isBlinking ? '120ms' : '160ms',
                background: 'linear-gradient(to bottom, #faf3ea 0%, #f3e6d8 85%, #ebd7c7 100%)',
                boxShadow: '0 1.5px 3px rgba(92, 64, 51, 0.25)',
              }}
            >
              <svg viewBox="0 0 20 12" className="absolute bottom-0 left-0 w-full h-[65%]">
                <path 
                  d="M 2 4 Q 10 10 18 4" 
                  fill="none" 
                  stroke="#5c4033" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>

          {/* Right Eye Socket (viewer's right - forward perspective) */}
          <div 
            className="absolute rounded-[50%] overflow-hidden pointer-events-none select-none"
            style={{
              left: '58.4%',
              top: '38.0%',
              width: '11.4%',
              height: '11.4%',
              transform: 'translate(-50%, -50%) rotate(3deg)',
            }}
          >
            {/* Interactive Living Starlight Pupil with Eye-Tracking (awake only) */}
            {!isSleeping && (
              <div 
                className="absolute rounded-full pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '42%',
                  height: '46%',
                  transform: `translate(calc(-50% + ${Math.max(-3.5, Math.min(3.5, pupilOffset.x))}px), calc(-50% + ${Math.max(-3.5, Math.min(3.5, pupilOffset.y))}px))`,
                  background: 'radial-gradient(circle, #fffdfa 15%, #fef08a 45%, #f59e0b 80%, transparent 100%)',
                  boxShadow: '0 0 10px 3px rgba(254, 240, 138, 0.9), 0 0 16px 4px rgba(245, 158, 11, 0.45)',
                }}
              >
                {/* Specular Catchlight */}
                <span 
                  className="absolute top-[18%] left-[18%] w-[35%] h-[35%] rounded-full bg-white shadow-[0_0_2px_#fff]" 
                />
              </div>
            )}

            {/* Soft Cream Eyelid for Natural Blinking & Peaceful Sleep */}
            <div 
              className="absolute inset-0 rounded-[50%] pointer-events-none transition-transform ease-in-out"
              style={{
                transformOrigin: 'top center',
                transform: (isSleeping || isBlinking) ? 'scaleY(1)' : 'scaleY(0)',
                transitionDuration: isBlinking ? '120ms' : '160ms',
                background: 'linear-gradient(to bottom, #faf3ea 0%, #f3e6d8 85%, #ebd7c7 100%)',
                boxShadow: '0 1.5px 3px rgba(92, 64, 51, 0.25)',
              }}
            >
              <svg viewBox="0 0 20 12" className="absolute bottom-0 left-0 w-full h-[65%]">
                <path 
                  d="M 2 4 Q 10 10 18 4" 
                  fill="none" 
                  stroke="#5c4033" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>

          {/* Floating Bedtime Zzz Stardust when sleeping */}
          {isSleeping && (
            <div className="absolute top-1/4 right-1/4 pointer-events-none select-none z-20">
              <span className="absolute font-heading font-bold text-xs text-[#a34063] animate-zzz-1">z</span>
              <span className="absolute font-heading font-bold text-sm text-[#a34063] animate-zzz-2">z</span>
              <span className="absolute font-heading font-bold text-base text-[#a34063] animate-zzz-3">Z</span>
            </div>
          )}

          {/* Interactive Tap Helper Pill */}
          {interactive && (
            <div className="absolute -bottom-3 right-8 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#fff8f1] text-[#5c4033] border border-[#f3dce3] shadow-md group-hover:border-[#a34063] group-hover:scale-105 transition-all min-h-[36px]">
              {isSleeping ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#a34063]" />
                  <span>Pip is sleeping</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#a34063] animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Tap Pip</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
