import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Moon, 
  Sun, 
  Star, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkle 
} from 'lucide-react';
import { playChimeNote, speakGentleStory, stopSpeaking } from '../utils/sound';
import CountStarsMiniGame from './CountStarsMiniGame';

const SCENES = [
  {
    chapter: "Scene 01",
    title: "Twilight Departure",
    subtitle: "When the sky blushes amber and violet",
    description: "As the sundown bells toll across the valleys, Pip wakes up in the high nursery cloud. Pip straightens the star-patterned nightcap, polishes the crescent lantern, and loads the dream satchel with bundles of quiet thoughts.",
    quote: "Every sleepy head deserves a gentle companion when darkness falls.",
    icon: Moon,
    bgGlow: "rgba(163, 64, 99, 0.25)"
  },
  {
    chapter: "Scene 02",
    title: "The Constellation Highway",
    subtitle: "Navigating between the Orion and the Slumber Belt",
    description: "High above the noisy towns, Pip glides along glowing comet trails. Restless winds and stormy night thoughts are smoothed away by humming the unicorn lullaby notes. Stars lean in to whisper directions to children who can't sleep.",
    quote: "The quietest songs have the greatest power to calm stormy minds.",
    icon: Star,
    bgGlow: "rgba(223, 213, 230, 0.45)"
  },
  {
    chapter: "Scene 03",
    title: "The Midnight Tucking",
    subtitle: "Gentle taps on nursery windows",
    description: "Pip hovers by sleepy windows, leaving behind glowing moon-drops and warmth. Blankets are smoothed, pillow corners fluffed, and troubled dreams are replaced with visions of flying clouds and friendly woodland creatures.",
    quote: "Sleep safe, little dreamer; Pip keeps watch until the shadows fade.",
    icon: Sparkles,
    bgGlow: "rgba(243, 220, 227, 0.5)"
  },
  {
    chapter: "Scene 04",
    title: "Dawn’s Soft Welcome",
    subtitle: "Returning home to the nursery cradle",
    description: "As the first rosy blush of morning touches the horizon, Pip’s night journey draws to a close. Floating back onto the giant fluffy fleece cloud, Pip curls up with the lantern dimming and drifts into a restful daytime snooze.",
    quote: "Even the dream courier must sleep before the twilight calls again.",
    icon: Sun,
    bgGlow: "rgba(245, 238, 230, 0.6)"
  }
];

export default function StoryScenes({ isMuted, onTriggerSparkles }) {
  const [activeScene, setActiveScene] = useState(0);
  const [isReadAloudActive, setIsReadAloudActive] = useState(false);
  const [highlightWordIndex, setHighlightWordIndex] = useState(-1);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);

  const current = SCENES[activeScene];
  const IconComponent = current.icon;

  // Cleanup speech synthesis on unmount or scene change
  useEffect(() => {
    return () => stopSpeaking();
  }, [activeScene]);

  const goToScene = (index) => {
    stopSpeaking();
    setIsReadAloudActive(false);
    setHighlightWordIndex(-1);
    playChimeNote(440 + index * 110, 0.8, isMuted, 0.14);
    setActiveScene(index);
    if (index === SCENES.length - 1) {
      onTriggerSparkles?.();
    }
  };

  const handleNext = () => {
    const nextIdx = (activeScene + 1) % SCENES.length;
    goToScene(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeScene - 1 + SCENES.length) % SCENES.length;
    goToScene(prevIdx);
  };

  // Read aloud feature using Web Speech API
  const toggleReadAloud = () => {
    if (isReadAloudActive) {
      stopSpeaking();
      setIsReadAloudActive(false);
      setHighlightWordIndex(-1);
    } else {
      setIsReadAloudActive(true);
      const fullTextToRead = `${current.title}. ${current.description}. ${current.quote}`;
      speakGentleStory(
        fullTextToRead,
        (charIndex) => {
          setHighlightWordIndex(charIndex);
        },
        () => {
          setIsReadAloudActive(false);
          setHighlightWordIndex(-1);
        }
      );
    }
  };

  // Render description with interactive read-along word spans
  const words = current.description.split(" ");

  return (
    <section 
      id="story" 
      className="relative py-24 px-4 sm:px-6 z-10 transition-colors duration-500"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="pill-badge px-4 py-1.5 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-[#a34063]" />
            <span>Interactive Bedtime Story</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#a34063]">
            A Journey Through the Night
          </h2>
          <p className="text-lg sm:text-xl font-light text-[#5c4033] max-w-2xl mx-auto leading-relaxed">
            Follow Pip’s nocturnal flight from twilight departure to dawn rest.
          </p>

          {/* Calming Count the Stars Mini-Game Trigger */}
          <div className="pt-2">
            <button
              onClick={() => setIsMiniGameOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f3dce3] text-[#a34063] font-bold text-xs sm:text-sm border border-[#a34063]/30 hover:bg-[#a34063] hover:text-[#fff8f1] hover:border-[#a34063] transition-all cursor-pointer shadow-sm hover:scale-103 min-h-[46px]"
            >
              <Star className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '9s' }} />
              <span>Count the Stars with Pip (Mini Game)</span>
            </button>
          </div>
        </div>

        {/* Timeline Navigation Dots with Strict Four Colors */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-10 relative select-none">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#f3dce3] z-0 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#a34063] transition-all duration-500 z-0 rounded-full"
            style={{ width: `${(activeScene / (SCENES.length - 1)) * 100}%` }}
          />

          {SCENES.map((scene, idx) => (
            <button
              key={scene.chapter}
              onClick={() => goToScene(idx)}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all duration-300 cursor-pointer ${
                activeScene === idx 
                  ? 'bg-[#a34063] text-[#fff8f1] scale-120 shadow-md border-2 border-[#fff8f1]' 
                  : idx < activeScene
                    ? 'bg-[#f3dce3] text-[#a34063] border border-[#a34063]'
                    : 'bg-[#fff8f1] text-[#5c4033] border border-[#f3dce3] hover:border-[#a34063]'
              }`}
              title={`Jump to ${scene.title}`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        {/* 3D Depth Layered Story Vignette Card */}
        <div className="interactive-card p-8 sm:p-12 relative overflow-hidden" style={{ perspective: '1200px' }}>
          
          {/* Background Ambient Celestial Halo (translateZ -30px) */}
          <div 
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{ backgroundColor: current.bgGlow, transform: 'translateZ(-30px)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Illustrated Thematic Vignette with 3D Depth Layering */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div 
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center border-2 border-[#f3dce3] bg-[#f3dce3]/40 shadow-inner animate-float-slow"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Midground SVG Icon */}
                <IconComponent 
                  className="w-24 h-24 text-[#a34063] transition-transform duration-500 transform hover:scale-110 drop-shadow-[0_2px_8px_rgba(163,64,99,0.3)]" 
                />
                
                {/* Foreground 3D Floating Constellation Sparkles (translateZ 25px) */}
                <div 
                  className="absolute top-4 right-6 w-3 h-3 rounded-full bg-[#a34063] animate-twinkle pointer-events-none" 
                  style={{ transform: 'translateZ(25px)' }}
                />
                <div 
                  className="absolute bottom-6 left-8 w-2 h-2 rounded-full bg-[#f3dce3] border border-[#a34063] animate-twinkle pointer-events-none" 
                  style={{ animationDelay: '1.2s', transform: 'translateZ(25px)' }} 
                />
              </div>
            </div>

            {/* Right: Narrative Story Text with Read-Along Support */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#f3dce3] text-[#a34063] border border-[#a34063]/30">
                  {current.chapter}
                </span>
                <span className="text-xs sm:text-sm text-[#5c4033] font-bold opacity-80">
                  {current.subtitle}
                </span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#a34063]">
                {current.title}
              </h3>

              {/* Story Narrative with Read-Along Highlighting */}
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-[#5c4033]">
                {words.map((w, i) => (
                  <span 
                    key={i} 
                    className={isReadAloudActive && i === Math.floor(highlightWordIndex / 6) ? "story-word-highlight font-semibold" : ""}
                  >
                    {w}{' '}
                  </span>
                ))}
              </p>

              {/* Character Bedtime Quote Box */}
              <div className="p-5 sm:p-6 rounded-2xl border-l-4 border-[#a34063] bg-[#f3dce3] text-base sm:text-lg italic font-hand text-[#5c4033] leading-relaxed">
                "{current.quote}"
              </div>

              {/* Controls: Prev/Next & Optional Read-Aloud Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[#f3dce3]">
                
                {/* Read Aloud Button (Section 14.5) */}
                <button
                  onClick={toggleReadAloud}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer min-h-[48px] ${
                    isReadAloudActive
                      ? 'bg-[#a34063] text-[#fff8f1] border-[#a34063] animate-pulse'
                      : 'bg-[#fff8f1] text-[#5c4033] border-[#f3dce3] hover:border-[#a34063]'
                  }`}
                  title="Toggle gentle story voice narration"
                >
                  {isReadAloudActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#a34063]" />}
                  <span>{isReadAloudActive ? 'Stop Reading' : 'Read Aloud'}</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handlePrev}
                    className="btn-secondary text-xs sm:text-sm font-bold py-2.5 px-5 min-h-[48px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="btn-primary text-xs sm:text-sm font-bold py-2.5 px-6 min-h-[48px]"
                  >
                    <span>{activeScene === SCENES.length - 1 ? 'Start Over' : 'Next Scene'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Embedded Count-the-Stars Mini Game Modal */}
      <CountStarsMiniGame 
        isOpen={isMiniGameOpen}
        onClose={() => setIsMiniGameOpen(false)}
        isMuted={isMuted}
        onTriggerSparkles={onTriggerSparkles}
      />
    </section>
  );
}
