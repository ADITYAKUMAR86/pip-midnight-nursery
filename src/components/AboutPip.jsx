import React, { useState } from 'react';
import { Heart, Sparkles, Feather, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';
import RawReactTypingEffect from 'react-typing-effect';
import { playTwinkle, playBubblePop, playChimeNote } from '../utils/sound';

const ReactTypingEffect = 
  (typeof RawReactTypingEffect === 'function' ? RawReactTypingEffect : null) ||
  (typeof RawReactTypingEffect?.default === 'function' ? RawReactTypingEffect.default : null) ||
  RawReactTypingEffect;

const STORY_TEXT = "Pip was discovered asleep inside a comet tail that drifted into the Midnight Nursery centuries ago. Wearing a nightcap stitched from shooting-star dust, Pip’s sole purpose is ensuring no dream gets lost in the dark.\n\nWhen you toss and turn, Pip gently lowers a fleece cloud, turns on the warm crescent lantern to chase away night shadows, and winds up the carousel music box until your breathing matches the quiet rhythm of the moon.";

const ADVICE_LIST = [
  "If your thoughts race at night, imagine putting them in a soft cloud and letting Pip carry them away.",
  "A cup of warm chamomile and a three-second deep sigh is Pip’s secret for quick slumber.",
  "The stars don’t hurry; they just shine when the world goes still. Take your time to rest.",
  "Even the brightest moon sleeps when the morning dawn calls."
];

export default function AboutPip({ isMuted, onTriggerSparkles }) {
  const [bedtimeChecklist, setBedtimeChecklist] = useState([
    { id: 1, text: "Polish the Crescent Moon Lantern", done: true },
    { id: 2, text: "Wind up the Unicorn Music Box", done: false },
    { id: 3, text: "Fluff three bedtime clouds", done: false },
    { id: 4, text: "Whisper sweet dreams to every window", done: false },
  ]);

  const [adviceIndex, setAdviceIndex] = useState(0);

  const handleToggleCheck = (id) => {
    playBubblePop(isMuted);
    const updated = bedtimeChecklist.map(item => {
      if (item.id === id) {
        const nextState = !item.done;
        if (nextState) playTwinkle(isMuted);
        return { ...item, done: nextState };
      }
      return item;
    });

    setBedtimeChecklist(updated);

    if (updated.every(i => i.done)) {
      onTriggerSparkles?.();
      playChimeNote(1046.5, 1.5, isMuted, 0.2);
    }
  };

  const handleNextAdvice = () => {
    playChimeNote(659.25, 0.8, isMuted, 0.12);
    setAdviceIndex((prev) => (prev + 1) % ADVICE_LIST.length);
  };

  return (
    <section 
      id="about" 
      className="relative py-24 px-4 sm:px-6 z-10 transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="pill-badge px-4 py-1.5 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-[#a34063]" />
            <span>Character Dossier</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#a34063]">
            Meet Pip, the Dream Courier
          </h2>
          <p className="text-lg sm:text-xl font-light text-[#5c4033] max-w-2xl mx-auto leading-relaxed">
            Not a ghost, not a human, but a spark of celestial warmth wrapped in bedtime fleece.
          </p>
        </div>

        {/* Character Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Pip's Master Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="interactive-card p-6 sm:p-9 max-w-lg w-full text-center group cursor-pointer">
              
              <div className="relative mb-5 flex justify-center overflow-hidden rounded-3xl">
                <img 
                  src="/pip_portrait.png" 
                  alt="Pip Official Character Portrait"
                  className="w-72 sm:w-84 md:w-96 h-auto object-contain drop-shadow-[0_16px_28px_rgba(92,64,51,0.22)] transform group-hover:scale-104 transition-transform duration-300" 
                />
              </div>

              {/* Character Identity Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2.5">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#5c4033] group-hover:text-[#a34063] transition-colors">
                    Pip of the Nursery
                  </h3>
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#a34063] fill-[#f3dce3] animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#a34063]">
                  First Class Dream Weaver & Pillow Plumper
                </p>
              </div>

              {/* Special Gear Attributes */}
              <div className="mt-6 pt-6 border-t border-[#f3dce3] grid grid-cols-2 gap-3.5 text-left">
                <div className="p-4 rounded-2xl bg-[#f3dce3] text-[#5c4033] text-xs sm:text-sm transition-all group-hover:bg-[#fff8f1] group-hover:border group-hover:border-[#a34063]">
                  <span className="block font-bold text-[#a34063] mb-1">Primary Tool:</span>
                  Crescent Lantern (Glows when thoughts turn quiet)
                </div>
                <div className="p-4 rounded-2xl bg-[#f3dce3] text-[#5c4033] text-xs sm:text-sm transition-all group-hover:bg-[#fff8f1] group-hover:border group-hover:border-[#a34063]">
                  <span className="block font-bold text-[#a34063] mb-1">Secondary Tool:</span>
                  Unicorn Music Box (Plays wind-up dream sonatas)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Character Lore & Interactive Bedtime Checklist */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Story Lore Paragraphs with react-typing-effect Progressive Typing Animation */}
            <div className="interactive-card p-6 sm:p-9 space-y-5">
              <h4 className="font-heading text-2xl sm:text-3xl font-bold text-[#a34063] flex items-center gap-2.5">
                <Feather className="w-6 h-6 text-[#a34063]" />
                <span>The Story of Pip</span>
              </h4>
              <div 
                className="text-base sm:text-lg lg:text-xl text-[#5c4033] min-h-[170px] sm:min-h-[150px] leading-relaxed"
                aria-label="Story of Pip"
              >
                {typeof ReactTypingEffect === 'function' ? (
                  <ReactTypingEffect
                    text={STORY_TEXT}
                    speed={20}
                    typingDelay={350}
                    eraseDelay={100000000}
                    cursor=""
                    cursorRenderer={() => null}
                    displayTextRenderer={(text) => {
                      const paragraphs = text.split('\n\n');
                      const isFinished = text.length >= STORY_TEXT.length;
                      return (
                        <div className="space-y-4">
                          {paragraphs.map((paragraph, index) => {
                            const isLast = index === paragraphs.length - 1;
                            return (
                              <p key={index} className="leading-relaxed font-normal">
                                {paragraph}
                                {isLast && !isFinished && (
                                  <span 
                                    className="text-[#a34063] font-bold ml-1 inline-block animate-pulse select-none text-xl"
                                    aria-hidden="true"
                                  >
                                    ▍
                                  </span>
                                )}
                              </p>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {STORY_TEXT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="leading-relaxed font-normal">{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive: Pip's Bedtime Routine Checklist */}
            <div className="p-6 sm:p-9 rounded-[28px] border border-[#f3dce3] bg-[#fff8f1] shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#5c4033] flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-[#a34063]" />
                  <span>Pip’s Nightly Routine (Tap to Complete)</span>
                </h4>
                <span className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full bg-[#f3dce3] text-[#a34063]">
                  {bedtimeChecklist.filter(i => i.done).length} / {bedtimeChecklist.length} Complete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {bedtimeChecklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToggleCheck(item.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-98 min-h-[56px] ${
                      item.done 
                        ? 'bg-[#f3dce3] border-[#a34063] text-[#5c4033] font-bold' 
                        : 'bg-[#fff8f1] border-[#f3dce3] text-[#5c4033] hover:border-[#a34063] hover:bg-[#f3dce3]/50'
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#a34063] shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-[#5c4033]/50 shrink-0" />
                    )}
                    <span className="text-sm sm:text-base leading-snug">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Bedtime Advice Card */}
            <div className="p-6 sm:p-7 rounded-[28px] border border-[#a34063]/30 bg-[#f3dce3] flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#a34063]">
                  Pip's Bedtime Whisper
                </span>
                <p className="font-hand text-base sm:text-lg md:text-xl italic text-[#5c4033] leading-relaxed">
                  "{ADVICE_LIST[adviceIndex]}"
                </p>
              </div>
              <button
                onClick={handleNextAdvice}
                className="shrink-0 btn-primary text-sm sm:text-base font-bold py-3 px-6 min-h-[48px]"
              >
                <span>Another Whisper</span>
                <span>✨</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
