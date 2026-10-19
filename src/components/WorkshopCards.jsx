import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Music, 
  Moon, 
  Play, 
  Pause, 
  RotateCw, 
  Sliders, 
  Boxes,
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';
import TiltCard from './TiltCard';
import { 
  playChimeNote, 
  playWindUpClick, 
  playLullabyPhrase, 
  stopLullabyPhrase,
  setMutedState,
  playLanternSound, 
  playRattleSound,
  playBubblePop
} from '../utils/sound';

const TOY_BLOCKS = [
  { id: 1, letter: "P", symbol: "☁️", bg: "#fff8f1", border: "#a34063", text: "#5c4033" },
  { id: 2, letter: "I", symbol: "⭐", bg: "#f3dce3", border: "#a34063", text: "#a34063" },
  { id: 3, letter: "P", symbol: "🌙", bg: "#dfd5e6", border: "#a34063", text: "#5c4033" },
  { id: 4, letter: "✨", symbol: "💖", bg: "#a34063", border: "#5c4033", text: "#fff8f1" },
];

export default function WorkshopCards({ isMuted, onTriggerSparkles, onToggleMute }) {
  // Card 1: Music Box State
  const [isMusicBoxPlaying, setIsMusicBoxPlaying] = useState(false);
  const [keyRotation, setKeyRotation] = useState(0);
  const [floatingNotes, setFloatingNotes] = useState([]);

  // Card 2: Lantern Nightlight State
  const [brightness, setBrightness] = useState(85);
  const [lanternMode, setLanternMode] = useState('rose'); // rose | blush | velvet

  // Card 3: Rattle & Block Toys State
  const [isRattling, setIsRattling] = useState(false);
  const [stackedCount, setStackedCount] = useState(2); // 1 to 4
  const [rattleMessage, setRattleMessage] = useState("Click rattle to shake or blocks to stack!");
  const timeoutsRef = useRef([]);
  const audioRef = useRef(null);

  // Sync audio muted property with isMuted
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopLullabyPhrase();
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const triggerFloatingNotes = () => {
    for (let i = 0; i < 4; i++) {
      const t = setTimeout(() => {
        const noteId = Date.now() + i;
        const symbols = ['♪', '♫', '♩', '♬', '✨'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        setFloatingNotes((prev) => [...prev.slice(-6), { id: noteId, symbol, left: 30 + Math.random() * 40 }]);
        const cleanT = setTimeout(() => {
          setFloatingNotes((prev) => prev.filter(n => n.id !== noteId));
        }, 2000);
        timeoutsRef.current.push(cleanT);
      }, i * 380);
      timeoutsRef.current.push(t);
    }
  };

  // Wind up crank handler for Card 1
  const handleWindKey = (e) => {
    e?.stopPropagation();
    playWindUpClick(isMuted);
    setKeyRotation((prev) => prev + 120);

    const noteId = Date.now();
    const symbols = ['♪', '♫', '♩', '♬', '✨'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    setFloatingNotes((prev) => [...prev.slice(-6), { id: noteId, symbol, left: 35 + Math.random() * 30 }]);

    const t = setTimeout(() => {
      setFloatingNotes((prev) => prev.filter(n => n.id !== noteId));
    }, 2000);
    timeoutsRef.current.push(t);
  };

  const handlePlayMusicBox = (e) => {
    e?.stopPropagation();
    const audio = audioRef.current;

    if (isMusicBoxPlaying) {
      if (audio) {
        audio.pause();
      }
      stopLullabyPhrase();
      setIsMusicBoxPlaying(false);
      return;
    }

    if (isMuted) {
      onToggleMute?.();
      setMutedState(false);
      if (audio) audio.muted = false;
    }

    setKeyRotation((prev) => prev + 180);
    onTriggerSparkles?.();
    triggerFloatingNotes();

    if (audio) {
      audio.currentTime = 0;
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicBoxPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio play restricted or failed, falling back to Web Audio synth:', err);
            setIsMusicBoxPlaying(true);
            playLullabyPhrase(false, () => {
              setIsMusicBoxPlaying(false);
            });
          });
      } else {
        setIsMusicBoxPlaying(true);
      }
    } else {
      setIsMusicBoxPlaying(true);
      playLullabyPhrase(false, () => {
        setIsMusicBoxPlaying(false);
      });
    }
  };

  const handleSliderPointerDown = () => {
    if (typeof window !== 'undefined') {
      window.__isDraggingSlider = true;
      const handlePointerUp = () => {
        window.__isDraggingSlider = false;
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchend', handlePointerUp);
      };
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchend', handlePointerUp);
    }
  };

  const handleBrightnessChange = (val) => {
    const clamped = Math.max(10, Math.min(100, Math.round(val)));
    setBrightness(clamped);
  };

  const handleInteractiveNote = (freq, e) => {
    e?.stopPropagation();
    playChimeNote(freq, 1.2, isMuted, 0.2);
    handleWindKey();
  };

  // Card 2 Glow Filter
  const getGlowFilter = () => {
    const alpha = brightness / 100;
    if (lanternMode === 'rose') {
      return `drop-shadow(0 0 ${24 * alpha}px rgba(163, 64, 99, ${0.75 * alpha}))`;
    }
    if (lanternMode === 'blush') {
      return `drop-shadow(0 0 ${28 * alpha}px rgba(243, 220, 227, ${0.9 * alpha})) drop-shadow(0 0 10px rgba(163, 64, 99, 0.4))`;
    }
    return `drop-shadow(0 0 ${20 * alpha}px rgba(92, 64, 51, ${0.5 * alpha})) drop-shadow(0 0 12px rgba(163, 64, 99, 0.5))`;
  };

  // Card 3 Interactive Handlers (Rattle & Block Toys)
  const handleShakeRattle = (e) => {
    e?.stopPropagation();
    setIsRattling(true);
    playRattleSound(isMuted);
    setRattleMessage("Chitter-chatter! 🪇 Warm beads rattle!");
    setTimeout(() => setIsRattling(false), 700);
  };

  const handleStackBlock = (e) => {
    e?.stopPropagation();
    if (stackedCount < TOY_BLOCKS.length) {
      const next = stackedCount + 1;
      setStackedCount(next);
      playChimeNote(440 + next * 110, 0.45, isMuted, 0.16);
      if (next === TOY_BLOCKS.length) {
        onTriggerSparkles?.();
        setRattleMessage("Hooray! Pip's 4-block tower is complete! 🌟");
      } else {
        setRattleMessage(`Stacked block #${next}! Keep building! 🧱`);
      }
    } else {
      // Topple & rebuild
      setStackedCount(1);
      playBubblePop(isMuted);
      setRattleMessage("Tumble down! Time to build again! ✨");
    }
  };

  return (
    <section 
      id="workshop" 
      className="relative py-24 px-4 sm:px-6 z-10 transition-colors duration-500"
    >
      {/* Real audio element for music box lullaby */}
      <audio 
        ref={audioRef}
        id="pip-musicbox-audio"
        preload="auto"
        onEnded={() => setIsMusicBoxPlaying(false)}
        onError={(err) => console.warn('Audio tag playback error:', err)}
      >
        <source src="/pip_lullaby.mp3" type="audio/mpeg" />
        <source src="/pip_lullaby.wav" type="audio/wav" />
      </audio>

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="pill-badge px-4 py-1.5 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-[#a34063]" />
            <span>Interactive Creations</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#a34063]">
            The Dream Workshop
          </h2>
          <p className="text-lg sm:text-xl font-light text-[#5c4033] max-w-2xl mx-auto leading-relaxed">
            Three 3D-depth tools Pip uses to protect the night. Move your cursor to tilt and explore each one!
          </p>
        </div>

        {/* 3 Creation Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Lullaby Music Box */}
          <TiltCard className="h-full">
            <div className="interactive-card p-6 sm:p-8 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-[#f3dce3] text-[#a34063]">
                    Creation 01
                  </span>
                  <span className="text-xs sm:text-sm text-[#5c4033] flex items-center gap-1.5 font-bold">
                    <Music className="w-4 h-4 text-[#a34063]" />
                    Harmonic Box
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#5c4033] mb-2 group-hover:text-[#a34063] transition-colors">
                  Lullaby Music Box
                </h3>
                <p className="text-sm sm:text-base text-[#5c4033] opacity-85 mb-6 leading-relaxed">
                  Wind the side key to spin the unicorn carousel and send soothing notes into the room.
                </p>

                {/* Music Box Interactive Stage */}
                <div className="relative py-4 flex flex-col items-center justify-center">
                  {/* Floating Note Particles in Muted Berry */}
                  {floatingNotes.map((note) => (
                    <span
                      key={note.id}
                      className="absolute text-[#a34063] font-bold text-lg animate-float pointer-events-none select-none z-20"
                      style={{
                        left: `${note.left}%`,
                        bottom: '55%',
                        animationDuration: '1.8s'
                      }}
                    >
                      {note.symbol}
                    </span>
                  ))}

                  {/* Music Box Image with Subtle Zoom on Card Hover */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src="/pip_lullaby_box.png" 
                      alt="Unicorn Lullaby Music Box"
                      className={`w-48 h-auto object-contain transition-transform duration-500 ${
                        isMusicBoxPlaying ? 'scale-106' : 'group-hover:scale-104'
                      }`}
                    />
                    
                    {/* Rotating Wind-up Key Button in Muted Berry */}
                    <button 
                      onClick={handleWindKey}
                      className="absolute bottom-4 right-0 p-3 rounded-full bg-[#a34063] text-[#fff8f1] font-bold shadow-md hover:bg-[#f3dce3] hover:text-[#5c4033] hover:border hover:border-[#a34063] cursor-pointer transition-transform"
                      style={{ transform: `rotate(${keyRotation}deg)` }}
                      title="Click to wind up key!"
                      aria-label="Wind music box key"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls: Play/Pause and Playable Notes */}
              <div className="pt-6 border-t border-[#f3dce3] space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayMusicBox}
                    className="flex-1 btn-primary text-xs sm:text-sm min-h-[44px]"
                    aria-label={isMusicBoxPlaying ? "Pause music box lullaby" : "Play music box lullaby"}
                  >
                    {isMusicBoxPlaying ? (
                      <>
                        <Pause className="w-4 h-4 text-[#fff8f1]" />
                        <span>Pause Lullaby</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-[#fff8f1] text-[#fff8f1]" />
                        <span>Wind & Play Twinkle</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMute?.();
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      isMuted 
                        ? 'bg-[#dfd5e6] text-[#5c4033] border-[#a34063]/30 hover:bg-[#f3dce3]' 
                        : 'bg-[#f3dce3] text-[#a34063] border-[#a34063]/30 hover:bg-[#a34063] hover:text-[#fff8f1]'
                    }`}
                    title={isMuted ? "Unmute nursery sound" : "Mute nursery sound"}
                    aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Individual Interactive Chime Keys */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <span className="text-[11px] text-[#5c4033] font-bold">Chimes:</span>
                  {[
                    { label: "C", freq: 523.25 },
                    { label: "E", freq: 659.25 },
                    { label: "G", freq: 783.99 },
                    { label: "B", freq: 987.77 },
                  ].map((note) => (
                    <button
                      key={note.label}
                      onClick={(e) => handleInteractiveNote(note.freq, e)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#f3dce3] text-[#5c4033] border border-[#f3dce3] hover:border-[#a34063] hover:bg-[#a34063] hover:text-[#fff8f1] transition-all cursor-pointer active:scale-95 min-h-[38px] min-w-[38px]"
                    >
                      {note.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Glowing Nightlights */}
          <TiltCard className="h-full">
            <div className="interactive-card p-6 sm:p-7 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f3dce3] text-[#a34063]">
                    Creation 02
                  </span>
                  <span className="text-xs text-[#5c4033] flex items-center gap-1 font-semibold">
                    <Moon className="w-3.5 h-3.5 text-[#a34063]" />
                    Nocturnal Glow
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#5c4033] mb-1 group-hover:text-[#a34063] transition-colors">
                  Crescent Nightlight
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] opacity-80 mb-4">
                  Adjust the luminance slider and switch cozy tones to create a peaceful atmosphere.
                </p>

                {/* Lantern Interactive Image with Dynamic Glow Filter */}
                <div className="relative py-4 flex items-center justify-center">
                  <div 
                    className="w-40 h-40 rounded-full bg-[#f3dce3] blur-2xl absolute pointer-events-none transition-opacity duration-150" 
                    style={{ opacity: brightness / 100 }}
                  />
                  <img 
                    src="/pip_dream_lantern.png" 
                    alt="Glowing Moon Lantern"
                    className="w-44 h-auto object-contain relative z-10 transition-[filter] duration-150"
                    style={{ filter: getGlowFilter() }}
                  />
                </div>
              </div>

              {/* Glow Controls: Brightness Slider & Hue Toggles */}
              <div className="pt-6 border-t border-[#f3dce3] space-y-4">
                {/* Slider */}
                <div 
                  className="space-y-2 select-none"
                  data-no-tilt="true"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center text-xs text-[#5c4033] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#a34063]" />
                      Luminance
                    </span>
                    <span className="font-bold text-[#a34063] min-w-[36px] text-right">{brightness}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrightnessChange(brightness - 10);
                        playBubblePop(isMuted);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f3dce3] hover:bg-[#a34063] hover:text-[#fff8f1] text-[#a34063] font-bold text-base transition-colors cursor-pointer shrink-0"
                      aria-label="Decrease luminance"
                      title="Decrease brightness"
                    >
                      -
                    </button>

                    <input 
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={brightness}
                      onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                      onInput={(e) => handleBrightnessChange(Number(e.target.value))}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        handleSliderPointerDown();
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleSliderPointerDown();
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleSliderPointerDown();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          handleBrightnessChange(brightness - 5);
                        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          handleBrightnessChange(brightness + 5);
                        } else if (e.key === 'PageDown') {
                          e.preventDefault();
                          handleBrightnessChange(brightness - 15);
                        } else if (e.key === 'PageUp') {
                          e.preventDefault();
                          handleBrightnessChange(brightness + 15);
                        } else if (e.key === 'Home') {
                          e.preventDefault();
                          handleBrightnessChange(10);
                        } else if (e.key === 'End') {
                          e.preventDefault();
                          handleBrightnessChange(100);
                        }
                      }}
                      aria-label="Crescent Nightlight Luminance"
                      aria-valuemin="10"
                      aria-valuemax="100"
                      aria-valuenow={brightness}
                      style={{
                        '--slider-bg': `linear-gradient(to right, #a34063 0%, #a34063 ${brightness}%, #f3dce3 ${brightness}%, #f3dce3 100%)`
                      }}
                      className="nursery-range-slider select-none"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrightnessChange(brightness + 10);
                        playBubblePop(isMuted);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f3dce3] hover:bg-[#a34063] hover:text-[#fff8f1] text-[#a34063] font-bold text-base transition-colors cursor-pointer shrink-0"
                      aria-label="Increase luminance"
                      title="Increase brightness"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tone Selection within Strict Four Colors */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {[
                    { id: 'rose', label: 'Rose Mute' },
                    { id: 'blush', label: 'Soft Blush' },
                    { id: 'velvet', label: 'Warm Brown' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanternMode(mode.id);
                        playLanternSound(true, isMuted);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[40px] ${
                        lanternMode === mode.id 
                          ? 'bg-[#a34063] border-[#a34063] text-[#fff8f1] shadow-sm' 
                          : 'bg-[#fff8f1] border-[#f3dce3] text-[#5c4033] hover:border-[#a34063]'
                      }`}
                    >
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Card 3: Rattle & Block Toys (Replaces Delivery Map as requested) */}
          <TiltCard className="h-full">
            <div className="interactive-card p-6 sm:p-7 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f3dce3] text-[#a34063]">
                    Creation 03
                  </span>
                  <span className="text-xs text-[#5c4033] flex items-center gap-1 font-semibold">
                    <Boxes className="w-3.5 h-3.5 text-[#a34063]" />
                    Interactive Toys
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#5c4033] mb-1 group-hover:text-[#a34063] transition-colors">
                  Rattle & Block Toys
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] opacity-80 mb-4">
                  Playable, interactive toys Pip invented that visitors can click or stack.
                </p>

                {/* Interactive Stage: Pip's Baby Rattle and Stacking Blocks */}
                <div className="relative w-full h-44 rounded-2xl bg-[#fff8f1] border border-[#f3dce3] p-3 flex items-center justify-around overflow-hidden shadow-inner group-hover:border-[#a34063] transition-colors select-none">
                  
                  {/* Left: Interactive Pip's Bedtime Rattle */}
                  <div 
                    onClick={handleShakeRattle}
                    className="flex flex-col items-center justify-center cursor-pointer group/rattle p-2 rounded-xl hover:bg-[#f3dce3]/40 transition-colors"
                    title="Click to shake Pip's bedtime rattle!"
                  >
                    <div 
                      className={`relative w-20 h-24 flex items-center justify-center transition-transform duration-300 ${
                        isRattling ? 'animate-bounce rotate-12 scale-110' : 'group-hover/rattle:scale-105'
                      }`}
                    >
                      <svg viewBox="0 0 80 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(92,64,51,0.18)]">
                        {/* Ring Handle */}
                        <circle cx="40" cy="80" r="14" fill="none" stroke="#a34063" strokeWidth="6" />
                        
                        {/* Stem */}
                        <rect x="36" y="46" width="8" height="24" rx="4" fill="#5c4033" />
                        
                        {/* Collar ribbon */}
                        <ellipse cx="40" cy="46" rx="10" ry="4" fill="#f3dce3" stroke="#a34063" strokeWidth="1.5" />
                        
                        {/* Rattle Spherical Bell */}
                        <circle cx="40" cy="26" r="22" fill="#f3dce3" stroke="#a34063" strokeWidth="2.5" />
                        <ellipse cx="40" cy="26" rx="20" ry="8" fill="none" stroke="#a34063" strokeWidth="1.5" strokeDasharray="3 2" />
                        
                        {/* Beads inside rattle */}
                        <circle cx={isRattling ? "34" : "36"} cy={isRattling ? "22" : "28"} r="4" fill="#a34063" className="transition-all" />
                        <circle cx={isRattling ? "46" : "42"} cy={isRattling ? "30" : "24"} r="3.5" fill="#5c4033" className="transition-all" />
                        <circle cx={isRattling ? "40" : "44"} cy={isRattling ? "20" : "28"} r="3.5" fill="#dfd5e6" className="transition-all" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-[#a34063] uppercase tracking-wider mt-1">
                      {isRattling ? "Shaking! 🪇" : "Tap Rattle"}
                    </span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-[1px] h-28 bg-[#f3dce3]" />

                  {/* Right: Stackable Wooden Blocks Tower */}
                  <div 
                    onClick={handleStackBlock}
                    className="flex flex-col items-center justify-end h-full py-1 cursor-pointer group/blocks px-3 rounded-xl hover:bg-[#f3dce3]/40 transition-colors"
                    title="Click to stack or topple blocks!"
                  >
                    <div className="flex flex-col-reverse items-center gap-1 w-24">
                      {TOY_BLOCKS.slice(0, stackedCount).map((b, idx) => (
                        <div
                          key={b.id}
                          className="w-14 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 transform animate-float-slow"
                          style={{
                            backgroundColor: b.bg,
                            border: `2px solid ${b.border}`,
                            color: b.text,
                            animationDelay: `${idx * 0.4}s`
                          }}
                        >
                          <span className="font-heading text-sm mr-1">{b.letter}</span>
                          <span className="text-[11px]">{b.symbol}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pedestal Base */}
                    <div className="w-20 h-2 bg-[#5c4033] rounded-full mt-1 opacity-70" />
                    
                    <span className="text-[10px] font-bold text-[#5c4033] uppercase tracking-wider mt-1">
                      {stackedCount >= TOY_BLOCKS.length ? "Tap: Topple!" : "Tap: Stack!"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Interactive Controls & Status */}
              <div className="pt-5 border-t border-[#f3dce3] space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleShakeRattle}
                    className="flex-1 btn-primary text-xs py-2 px-3 min-h-[42px] flex items-center justify-center gap-1.5"
                  >
                    <span>Shake Rattle 🪇</span>
                  </button>

                  <button
                    onClick={handleStackBlock}
                    className="flex-1 btn-secondary text-xs py-2 px-3 min-h-[42px] flex items-center justify-center gap-1.5"
                  >
                    <span>{stackedCount >= TOY_BLOCKS.length ? 'Topple & Rebuild 🔄' : `Stack Block (${stackedCount}/4) 🧱`}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-[#5c4033] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#a34063] fill-[#f3dce3]" />
                    <span>Tower: {stackedCount} / 4 Stacked</span>
                  </span>
                  <span className="text-[11px] text-[#a34063] font-semibold italic">
                    "{rattleMessage}"
                  </span>
                </div>
              </div>
            </div>
          </TiltCard>

        </div>

      </div>
    </section>
  );
}
