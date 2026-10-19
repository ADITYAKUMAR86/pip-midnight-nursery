import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Music, Heart } from 'lucide-react';
import PipCharacter from './PipCharacter';
import { playTwinkle, playLullabyPhrase } from '../utils/sound';

export default function Hero({ 
  isMuted, 
  onTriggerSparkles,
  isNightMode = false,
  isSleeping = false,
  onOpenSleepTimer,
  reducedMotion = false
}) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const heroRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Parallax depth calculation across layers with reduced-motion support
  useEffect(() => {
    if (reducedMotion) {
      setParallaxOffset({ x: 0, y: 0 });
      return;
    }

    let animId;
    const handlePointerMove = (e) => {
      if (!heroRef.current || reducedMotion) return;
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) return;

      const rect = heroRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      animId = requestAnimationFrame(() => {
        setParallaxOffset({
          x: Math.max(-1, Math.min(1, relX)),
          y: Math.max(-1, Math.min(1, relY)),
        });
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  const dialogues = [
    "Hi there! I'm Pip, your nighttime dream courier.",
    "Yaaawn... tucking in the stars is serious business! ⭐",
    "Giggle! Your stardust tickles! ✨",
    "I keep soft fleece clouds ready for everyone who needs restful sleep. ☁️",
    "Psst... have you discovered the secret five-touch star in the sky? 🌙",
    "Let's play a lullaby together! Press the Music Box button. 🎶"
  ];

  const handlePipClick = () => {
    playTwinkle(isMuted);
    onTriggerSparkles?.();
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
  };

  const handleMusicBoxClick = () => {
    playLullabyPhrase(isMuted);
    setDialogueIndex(5);
  };

  const handleTuckInClick = () => {
    playTwinkle(isMuted);
    onTriggerSparkles?.();
    setDialogueIndex(2);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 overflow-hidden z-10"
    >
      {/* Parallax Depth Layer 1: Far Ambient Stardust Cloud */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallaxOffset.x * 8}px, ${parallaxOffset.y * 8}px, 0)`
        }}
      >
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-[#f3dce3] blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-1/3 right-12 w-80 h-80 rounded-full bg-[#dfd5e6] blur-3xl opacity-35 pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Welcoming Bedtime Story Copy */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          
          {/* Subtle Story Motto */}
          <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base font-bold text-[#a34063] tracking-wide">
            <span>small dreams. peaceful slumbers.</span>
            <Heart className="w-4 h-4 text-[#a34063] fill-[#f3dce3]" />
          </div>

          {/* Main Storybook Heading in Muted Berry & Dark Brown */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#a34063]">
            Baby's Midnight <br />
            <span className="text-[#5c4033]">
              Nursery Sanctuary
            </span>
          </h1>

          {/* Descriptive Bedtime Text */}
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal text-[#5c4033]">
            An interactive bedtime sanctuary where busy thoughts soften like stardust, quiet moments turn into music-box lullabies, and little dreamers are guided into peaceful sleep by <strong className="font-bold text-[#a34063] underline decoration-[#f3dce3] underline-offset-4">Pip</strong>.
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <button
              onClick={handleTuckInClick}
              className="btn-primary px-6 py-3.5 text-sm sm:text-base min-h-[48px] font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#fff8f1] group-hover:rotate-45 transition-transform" />
              <span>Tuck In With Pip</span>
            </button>

            <button
              onClick={handleMusicBoxClick}
              className="btn-secondary px-6 py-3.5 text-sm sm:text-base min-h-[48px] font-bold"
            >
              <Music className="w-4 h-4 text-[#a34063] animate-bounce" style={{ animationDuration: '2.5s' }} />
              <span>Play Lullaby Chimes</span>
            </button>

            <button
              onClick={() => scrollToSection('workshop')}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-[#a34063] hover:text-[#5c4033] transition-colors cursor-pointer min-h-[48px]"
            >
              <span>Explore Workshop</span>
              <span className="text-base">→</span>
            </button>
          </div>

          {/* Pip's nocturnal stats/badges */}
          <div className="pt-4 grid grid-cols-3 gap-3.5 max-w-lg mx-auto lg:mx-0">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fff8f1] border border-[#f3dce3] text-center shadow-sm hover:border-[#a34063] hover:bg-[#f3dce3] transition-all">
              <div className="text-xs sm:text-sm text-[#a34063] font-extrabold uppercase tracking-wider mb-0.5">Status</div>
              <div className="text-sm sm:text-base lg:text-lg font-bold text-[#5c4033]">
                {isSleeping ? 'Fast Asleep 💤' : 'Sleepy & Ready'}
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fff8f1] border border-[#f3dce3] text-center shadow-sm hover:border-[#a34063] hover:bg-[#f3dce3] transition-all">
              <div className="text-xs sm:text-sm text-[#a34063] font-extrabold uppercase tracking-wider mb-0.5">Courier</div>
              <div className="text-sm sm:text-base lg:text-lg font-bold text-[#5c4033]">Dream Dispatch</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fff8f1] border border-[#f3dce3] text-center shadow-sm hover:border-[#a34063] hover:bg-[#f3dce3] transition-all">
              <div className="text-xs sm:text-sm text-[#a34063] font-extrabold uppercase tracking-wider mb-0.5">Tucked In</div>
              <div className="text-sm sm:text-base lg:text-lg font-bold text-[#5c4033]">9,420 Stars ⭐</div>
            </div>
          </div>
        </div>

        {/* Right Column: Pip Avatar with Pointer Parallax & Eye-Tracking */}
        <div 
          className="lg:col-span-5 flex flex-col items-center justify-center relative transition-transform duration-300 ease-out"
          style={{
            transform: reducedMotion ? 'none' : `translate3d(${parallaxOffset.x * 16}px, ${parallaxOffset.y * 16}px, 0)`
          }}
        >
          <PipCharacter 
            speechText={dialogues[dialogueIndex]}
            onClick={handlePipClick}
            interactive={true}
            isNightMode={isNightMode}
            isSleeping={isSleeping}
            reducedMotion={reducedMotion}
          />
        </div>

      </div>
    </section>
  );
}
