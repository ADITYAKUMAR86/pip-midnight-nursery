import React, { useState } from 'react';
import { Sparkles, Star, RotateCcw, X, Heart } from 'lucide-react';
import { playChimeNote, playTwinkle } from '../utils/sound';

export default function CountStarsMiniGame({ isOpen, onClose, isMuted, onTriggerSparkles }) {
  const [countedStars, setCountedStars] = useState([]);
  
  const starData = [
    { id: 1, x: 20, y: 35, size: 28, phrase: "One sleepy star tucking into bed! ⭐" },
    { id: 2, x: 48, y: 22, size: 34, phrase: "Two bright stars blinking in the dark! ✨" },
    { id: 3, x: 78, y: 32, size: 30, phrase: "Three cozy stars dreaming on a cloud! ☁️" },
    { id: 4, x: 28, y: 68, size: 32, phrase: "Four gentle stars keeping night watch! 🌙" },
    { id: 5, x: 55, y: 55, size: 36, phrase: "Five warm stars humming a lullaby! 🎶" },
    { id: 6, x: 82, y: 65, size: 28, phrase: "Six quiet stars yawning softly... 💤" },
    { id: 7, x: 45, y: 82, size: 30, phrase: "Seven peaceful stars! The whole sky is ready for sleep! 💖" },
  ];

  if (!isOpen) return null;

  const handleStarClick = (star) => {
    if (countedStars.includes(star.id)) return;

    const nextCounted = [...countedStars, star.id];
    setCountedStars(nextCounted);

    const baseFreq = 523.25; // C5
    const semitones = [0, 2, 4, 7, 9, 12, 14];
    const freq = baseFreq * Math.pow(2, semitones[countedStars.length % semitones.length] / 12);
    playChimeNote(freq, 1.4, isMuted, 0.16);

    if (nextCounted.length === starData.length) {
      setTimeout(() => {
        playTwinkle(isMuted);
        onTriggerSparkles?.();
      }, 300);
    }
  };

  const handleReset = () => {
    setCountedStars([]);
    playChimeNote(659.25, 0.5, isMuted, 0.1);
  };

  const currentPhrase = countedStars.length === 0 
    ? "Tap the stars in the night sky to count with Pip! No hurry, no timers."
    : starData[countedStars.length - 1].phrase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251812]/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#fff8f1] border-2 border-[#a34063] text-[#5c4033] shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f3dce3] hover:bg-[#a34063] text-[#5c4033] hover:text-[#fff8f1] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close star counting game"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Pip's gentle message */}
        <div className="text-center space-y-2 mb-4">
          <div className="pill-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#a34063]" />
            <span>Calm Bedtime Activity</span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#a34063]">
            Count the Stars with Pip ⭐
          </h3>
          <p className="font-hand text-sm sm:text-base text-[#5c4033] max-w-md mx-auto italic min-h-[40px] flex items-center justify-center">
            "{currentPhrase}"
          </p>
        </div>

        {/* Starlit Sky Field Canvas */}
        <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#3a251e] border-2 border-[#541e30] overflow-hidden shadow-inner my-4">
          
          {/* Ambient soft glow clouds */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-[#a34063] blur-3xl opacity-30 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#f3dce3] blur-3xl opacity-20 pointer-events-none" />

          {/* 7 Interactive Stars */}
          {starData.map((star) => {
            const isCounted = countedStars.includes(star.id);
            return (
              <button
                key={star.id}
                onClick={() => handleStarClick(star)}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.max(48, star.size + 16)}px`,
                  height: `${Math.max(48, star.size + 16)}px`,
                }}
                className="absolute flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-90 group"
                aria-label={`Star ${star.id}`}
              >
                {/* Glow ring */}
                <div 
                  className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    isCounted 
                      ? 'bg-[#f3dce3]/30 scale-125' 
                      : 'bg-transparent group-hover:bg-[#f3dce3]/20'
                  }`}
                />

                <Star 
                  style={{ width: `${star.size}px`, height: `${star.size}px` }}
                  className={`transition-all duration-500 ${
                    isCounted 
                      ? 'text-[#f3dce3] fill-[#f3dce3] scale-110 drop-shadow-[0_0_12px_rgba(243,220,227,0.9)] animate-pulse' 
                      : 'text-[#a34063] fill-[#a34063]/40 group-hover:scale-115 group-hover:text-[#f3dce3]'
                  }`}
                />

                {/* Star number badge */}
                {isCounted && (
                  <span className="absolute -bottom-2 font-heading text-xs font-bold text-[#fff8f1] bg-[#a34063] px-1.5 py-0.2 rounded-full border border-[#f3dce3]/50">
                    {star.id}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress & Reset controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-semibold text-[#5c4033] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#a34063] fill-[#f3dce3]" />
            <span>Tucked in: <strong>{countedStars.length} of 7</strong> stars</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 min-h-[42px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Count Again</span>
            </button>

            <button
              onClick={onClose}
              className="btn-primary text-xs py-2 px-5 min-h-[42px]"
            >
              Back to Story
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
