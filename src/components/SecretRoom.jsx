import React, { useEffect, useState } from 'react';
import { X, Sparkles, Music, Star, Heart } from 'lucide-react';
import { playSecretFanfare, playLullabyPhrase, playChimeNote } from '../utils/sound';

export default function SecretRoom({ 
  isOpen, 
  onClose, 
  isMuted, 
  onTriggerSparkles 
}) {
  const [lanternLit, setLanternLit] = useState(true);
  const [constellationRevealed, setConstellationRevealed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playSecretFanfare(isMuted);
      const timer = setTimeout(() => {
        setConstellationRevealed(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setConstellationRevealed(false);
    }
  }, [isOpen, isMuted]);

  if (!isOpen) return null;

  const handleLanternClick = () => {
    setLanternLit(!lanternLit);
    playChimeNote(lanternLit ? 392 : 784, 0.8, isMuted);
  };

  const handleMusicBoxClick = () => {
    playLullabyPhrase(isMuted);
    onTriggerSparkles?.();
  };

  // Constellation star points for "Ursa Dormiens - The Slumber Bear"
  const constellationStars = [
    { x: 25, y: 35, name: "Nose" },
    { x: 38, y: 25, name: "Ear" },
    { x: 45, y: 38, name: "Head" },
    { x: 62, y: 32, name: "Back" },
    { x: 78, y: 45, name: "Tail" },
    { x: 68, y: 68, name: "Hind Paw" },
    { x: 40, y: 65, name: "Front Paw" },
  ];

  const sweetDreamsGreeting = "Sweet dreams, little traveler! Pip and the Slumber Bear are watching over your restful sleep tonight.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251812]/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#fff8f1] border-2 border-[#a34063] text-[#5c4033] shadow-2xl overflow-y-auto max-h-[92vh] p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f3dce3] hover:bg-[#a34063] text-[#5c4033] hover:text-[#fff8f1] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close secret room"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Secret Room Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="pill-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#a34063]" />
            <span>Secret Chamber Unlocked</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#a34063]">
            Pip’s Hidden Lullaby Vault 🌙
          </h2>
          <p className="text-sm text-[#5c4033] max-w-md mx-auto">
            You discovered the fifth star! Here are Pip's hand-crafted treasures kept warm for midnight dreamers.
          </p>
        </div>

        {/* Reward 1: Celestial SVG Constellation Reward (Section 14.6) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#3a251e] border-2 border-[#541e30] text-[#fff8f1] mb-6 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading text-xs uppercase tracking-wider text-[#dfd5e6] flex items-center gap-1.5 font-bold">
              <Star className="w-3.5 h-3.5 text-[#f3dce3] fill-current" />
              <span>Constellation Discovery: Ursa Dormiens</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#541e30] text-[#f3dce3] font-semibold">
              The Slumber Bear
            </span>
          </div>

          {/* SVG Constellation Canvas */}
          <div className="relative w-full h-40 sm:h-44 flex items-center justify-center">
            <svg viewBox="0 0 100 80" className="w-full h-full">
              {/* Connecting Starlight Lines */}
              <polyline
                points="25,35 38,25 45,38 62,32 78,45 68,68 40,65 25,35 45,38 68,68"
                fill="none"
                stroke="#f3dce3"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                strokeOpacity={constellationRevealed ? "0.85" : "0.2"}
                className="transition-all duration-1000"
              />

              {/* Constellation Stars */}
              {constellationStars.map((pt, i) => (
                <g key={i} className="animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.2"
                    fill="#a34063"
                    stroke="#fff8f1"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="1.2"
                    fill="#fff8f1"
                  />
                </g>
              ))}
            </svg>
          </div>

          <p className="font-hand text-xs sm:text-sm text-center text-[#dfd5e6] italic pt-1">
            "{sweetDreamsGreeting}"
          </p>
        </div>

        {/* Interactive Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          {/* Card 1: Glowing Moon Lantern */}
          <div 
            onClick={handleLanternClick}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-center group ${
              lanternLit 
                ? 'bg-[#f3dce3] border-[#a34063] shadow-md' 
                : 'bg-[#fff8f1] border-[#f3dce3] opacity-80'
            }`}
          >
            <div className="relative flex justify-center mb-3">
              <img 
                src="/pip_dream_lantern.png" 
                alt="Glowing Nightlight Lantern"
                className={`w-32 sm:w-36 h-32 sm:h-36 object-contain transition-transform duration-300 group-hover:scale-105 ${
                  lanternLit ? 'filter drop-shadow-[0_0_16px_rgba(163,64,99,0.55)]' : 'grayscale-40'
                }`}
              />
            </div>
            <div className="font-heading font-semibold text-[#5c4033] flex items-center justify-center gap-1.5">
              <span>Crescent Moon Lantern</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#fff8f1] text-[#a34063] font-bold border border-[#a34063]/40">
                {lanternLit ? 'Glow On' : 'Dimmed'}
              </span>
            </div>
            <p className="text-xs text-[#5c4033] opacity-80 mt-1">Tap to toggle gentle nightlight</p>
          </div>

          {/* Card 2: Unicorn Lullaby Music Box */}
          <div 
            onClick={handleMusicBoxClick}
            className="p-5 rounded-2xl border bg-[#f3dce3] border-[#f3dce3] hover:border-[#a34063] transition-all duration-300 cursor-pointer text-center group shadow-sm hover:shadow-md"
          >
            <div className="relative flex justify-center mb-3">
              <img 
                src="/pip_lullaby_box.png" 
                alt="Unicorn Music Box"
                className="w-32 sm:w-36 h-32 sm:h-36 object-contain transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
              />
            </div>
            <div className="font-heading font-semibold text-[#5c4033] flex items-center justify-center gap-1.5">
              <span>Unicorn Music Box</span>
              <Music className="w-3.5 h-3.5 text-[#a34063]" />
            </div>
            <p className="text-xs text-[#5c4033] opacity-80 mt-1">Tap to wind & play Twinkle Lullaby</p>
          </div>

        </div>

        {/* Return Button */}
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="btn-primary text-sm px-6 py-2.5 min-h-[46px]"
          >
            Return to the Nursery Sky
          </button>
        </div>

      </div>
    </div>
  );
}
