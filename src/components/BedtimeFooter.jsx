import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowUp, Send, Heart, Pause, Play } from 'lucide-react';
import { playTwinkle, playChimeNote, playBubblePop } from '../utils/sound';

export default function BedtimeFooter({ 
  onTriggerSparkles, 
  reducedMotion = false, 
  onToggleReducedMotion 
}) {
  const [wish, setWish] = useState('');
  const [releasedWishes, setReleasedWishes] = useState([]);
  const [showDock, setShowDock] = useState(false);
  const wishTimeoutsRef = useRef([]);

  // Check scroll position to display dock only past landing fold
  useEffect(() => {
    const handleScroll = () => {
      setShowDock(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup pending wish timeouts on unmount
  useEffect(() => {
    return () => {
      wishTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSendWish = (e) => {
    e.preventDefault();
    if (!wish.trim()) return;

    const newWish = {
      id: Date.now(),
      text: wish.trim(),
      left: 15 + Math.random() * 65,
    };

    setReleasedWishes((prev) => [...prev, newWish]);
    setWish('');
    playTwinkle(false);
    onTriggerSparkles?.();

    const t = setTimeout(() => {
      setReleasedWishes((prev) => prev.filter((w) => w.id !== newWish.id));
    }, 4200);
    wishTimeoutsRef.current.push(t);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playChimeNote(880, 0.6, false);
  };

  const handleToggleMotions = () => {
    playBubblePop(false);
    if (onToggleReducedMotion) {
      onToggleReducedMotion();
    } else {
      document.documentElement.classList.toggle('reduce-motion-override');
    }
  };

  return (
    <footer className="relative pt-16 pb-28 px-4 sm:px-6 z-10 border-t border-[#f3dce3] transition-colors duration-500 overflow-hidden select-none">
      
      {/* Floating Released Wish Balloons in Soft Pink and Muted Berry */}
      {releasedWishes.map((w) => (
        <div
          key={w.id}
          className="absolute pointer-events-none px-4 py-2.5 rounded-full bg-[#f3dce3] text-[#5c4033] font-hand text-xs font-semibold shadow-md border border-[#a34063] z-30 transition-all"
          style={{
            left: `${w.left}%`,
            bottom: '30%',
            animation: 'float 3.8s ease-out forwards',
          }}
        >
          ✨ Stardust wish released: "{w.text}"
        </div>
      ))}

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Interactive "Send a Sweet Dream Wish" Box */}
        <div className="interactive-card max-w-xl mx-auto p-6 sm:p-8 text-center space-y-4">
          <div className="pill-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#a34063]" />
            <span>Interactive Wish Box</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#a34063]">
            Send a Sweet Dream to the Midnight Sky
          </h3>
          <p className="text-xs sm:text-sm text-[#5c4033] opacity-80">
            Type your bedtime thought or wish for tomorrow. Pip will tuck it into the starlight.
          </p>

          <form onSubmit={handleSendWish} className="flex flex-col sm:flex-row gap-2.5">
            <input 
              type="text"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="e.g. A peaceful morning, deep restful sleep..."
              className="flex-1 nursery-input"
              maxLength={80}
            />
            <button
              type="submit"
              className="btn-primary text-xs sm:text-sm py-2 px-6 min-h-[48px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Release Wish</span>
            </button>
          </form>
        </div>

        {/* Footer Navigation & Signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[#f3dce3] text-xs text-[#5c4033]">
          
          {/* Logo & Lore */}
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🌙</span>
            <span className="font-heading font-bold text-[#5c4033] text-sm">
              Midnight Nursery
            </span>
            <span className="opacity-75">• Baby's gentle starlit sanctuary</span>
          </div>

          {/* Quick Nav Anchors with Hover Underline */}
          <div className="flex items-center gap-5">
            <a href="#hero" className="hover:text-[#a34063] transition-colors font-semibold py-1">Hero</a>
            <a href="#about" className="hover:text-[#a34063] transition-colors font-semibold py-1">Meet Pip</a>
            <a href="#workshop" className="hover:text-[#a34063] transition-colors font-semibold py-1">Dream Workshop</a>
            <a href="#story" className="hover:text-[#a34063] transition-colors font-semibold py-1">Night Story</a>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="btn-secondary text-xs py-2 px-3.5 min-h-[42px] flex items-center gap-1.5"
          >
            <span>Back to Bedtime Sky</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center text-[11px] text-[#5c4033] opacity-70 space-y-1">
          <p>© {new Date().getFullYear()} Welcome to the Midnight Nursery. Baby First Hackathon Submission.</p>
          <p className="text-[10px] text-[#a34063]">
            Built with pure CSS, layered SVG 3D depth, Web Audio API synthesis, and child-safe zero-tracking principles.
          </p>
        </div>

      </div>

      {/* Floating Bottom-Right Quick Action Widget - Compact and positioned away from central interactive workshop cards */}
      <aside 
        aria-label="Quick Actions" 
        className={`fixed bottom-4 right-4 sm:right-6 z-30 pointer-events-none transition-opacity duration-500 ${
          showDock ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff8f1] border border-[#f3dce3] shadow-lg">
          <button
            onClick={() => {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#5c4033] hover:text-[#a34063] hover:bg-[#f3dce3] transition-all cursor-pointer min-h-[34px]"
          >
            <span>Pip Art</span>
          </button>

          <div className="w-px h-4 bg-[#f3dce3]" />

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#5c4033] hover:text-[#a34063] hover:bg-[#f3dce3] transition-all cursor-pointer min-h-[34px]"
            title="Scroll to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#a34063]" />
            <span>Top</span>
          </button>

          <div className="w-px h-4 bg-[#f3dce3] hidden sm:block" />

          <button
            onClick={handleToggleMotions}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#5c4033] hover:text-[#a34063] hover:bg-[#f3dce3] transition-all cursor-pointer min-h-[34px]"
            aria-label={reducedMotion ? 'Play motions' : 'Pause little motions'}
            title={reducedMotion ? 'Play motions' : 'Pause motions'}
          >
            {reducedMotion ? <Play className="w-3 h-3 text-[#a34063]" /> : <Pause className="w-3 h-3 text-[#a34063]" />}
          </button>
        </div>
      </aside>

    </footer>
  );
}
