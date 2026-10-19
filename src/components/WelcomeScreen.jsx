import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Moon, Heart, Stars, ArrowRight, RotateCcw } from 'lucide-react';
import { playTwinkle, playLullabyPhrase } from '../utils/sound';

// Reference video timeline (pip_welcome.mp4, ~10s):
// 0s–4.6s  Pip walks in from the left, 4.6s–9.9s idle + blinking (looped)
const IDLE_START = 4.6;
const LOOP_END = 9.85;
const ARRIVE_AT = 3.6;
const FALLBACK_MS = 4500; // reveal text even if autoplay is blocked

const DUST = [
  { top: '18%', left: '22%', size: 'w-3.5 h-3.5', delay: '0s' },
  { top: '30%', left: '76%', size: 'w-4 h-4', delay: '0.9s' },
  { top: '58%', left: '16%', size: 'w-3 h-3', delay: '1.7s' },
  { top: '64%', left: '82%', size: 'w-3.5 h-3.5', delay: '0.4s' },
  { top: '10%', left: '60%', size: 'w-3 h-3', delay: '2.2s' },
];

export default function WelcomeScreen({
  onEnter,
  isMuted = false,
  isNightMode = false,
  reducedMotion = false,
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [hasArrived, setHasArrived] = useState(reducedMotion);
  const videoRef = useRef(null);
  const arrivedRef = useRef(reducedMotion);

  const markArrived = useCallback(() => {
    if (arrivedRef.current) return;
    arrivedRef.current = true;
    setHasArrived(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview_center') === '1';

    const seekTo = (t) => {
      try { video.currentTime = t; } catch { /* metadata not ready yet */ }
    };

    // Reduced motion: park Pip standing in the centre, no walking.
    if (reducedMotion) {
      const park = () => { seekTo(6.0); video.pause(); };
      if (video.readyState >= 1) park();
      else video.addEventListener('loadedmetadata', park, { once: true });
      markArrived();
      return () => video.removeEventListener('loadedmetadata', park);
    }

    if (preview) {
      seekTo(6.5);
      markArrived();
    }

    const onFrame = (_now, meta) => {
      const t = meta && typeof meta.mediaTime === 'number' ? meta.mediaTime : video.currentTime;
      if (t >= ARRIVE_AT) markArrived();
      if (t >= LOOP_END) seekTo(IDLE_START); // loop the idle + blink pose
      frameId = video.requestVideoFrameCallback(onFrame);
    };
    const onTimeUpdate = () => {
      if (video.currentTime >= ARRIVE_AT) markArrived();
      if (video.currentTime >= LOOP_END) seekTo(IDLE_START);
    };
    const onEnded = () => {
      seekTo(IDLE_START);
      video.play().catch(() => {});
    };

    let frameId = null;
    const hasRVFC = 'requestVideoFrameCallback' in video;
    if (hasRVFC) frameId = video.requestVideoFrameCallback(onFrame);
    else video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    video.play().catch(() => {});
    const fallback = setTimeout(markArrived, FALLBACK_MS);

    return () => {
      clearTimeout(fallback);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      if (hasRVFC && frameId !== null) video.cancelVideoFrameCallback(frameId);
    };
  }, [reducedMotion, markArrived]);

  const handleReplayWalk = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    playTwinkle(isMuted);
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handlePipClick = () => {
    playTwinkle(isMuted);
  };

  const handleEnterClick = () => {
    playLullabyPhrase(isMuted);
    playTwinkle(isMuted);
    onEnter?.();
    const nextSection = document.getElementById('about') || document.getElementById('hero');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Staged reveal for everything under Pip (starts when Pip reaches the centre)
  const reveal = (delayMs) => ({
    style: {
      visibility: hasArrived ? 'visible' : 'hidden',
      transitionDelay: hasArrived && !reducedMotion ? `${delayMs}ms` : '0ms',
    },
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      hasArrived ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
    }`,
  });
  const cardReveal = reveal(0);
  const buttonReveal = reveal(160);
  const tipReveal = reveal(320);

  return (
    <section
      id="welcome"
      className={`relative w-full min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 pb-6 sm:pb-8 px-3 sm:px-6 select-none transition-colors duration-700 overflow-x-hidden ${
        isNightMode ? 'bg-[#251812]' : 'bg-[#fff8f1]'
      }`}
      style={{
        backgroundImage: isNightMode
          ? 'radial-gradient(ellipse at top, #3b2820 0%, #251812 70%)'
          : 'radial-gradient(ellipse at top, #fff3e6 0%, #fff8f1 65%, #fbeeed 100%)',
      }}
      aria-label="Welcome to Pip's Midnight Nursery"
    >
      {/* Ambient dream background (soft orbs only - no hard rings) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/3 w-420 sm:w-560 lg:w-760 h-420 sm:h-560 lg:h-760">
          <div
            className={`w-full h-full rounded-full bg-[#f3dce3] blur-3xl opacity-40 ${
              reducedMotion ? '' : 'welcome-breathe'
            }`}
          />
        </div>
        <div className="absolute -bottom-20 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#dfd5e6] blur-3xl opacity-35" />

        <div
          className={`absolute top-8 left-8 sm:left-14 text-[#a34063] opacity-55 ${reducedMotion ? '' : 'animate-float'}`}
        >
          <Stars className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div
          className={`absolute top-14 right-10 sm:right-16 text-[#a34063] opacity-45 ${reducedMotion ? '' : 'animate-twinkle'}`}
        >
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div
          className={`absolute bottom-10 left-8 sm:left-14 text-[#a34063] opacity-45 ${reducedMotion ? '' : 'animate-float-slow'}`}
        >
          <Moon className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div
          className={`absolute bottom-12 right-12 sm:right-18 text-[#a34063] opacity-45 ${reducedMotion ? '' : 'animate-twinkle'}`}
          style={{ animationDelay: '1.4s' }}
        >
          <Stars className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/*
        NOTE: this column is intentionally `relative` WITHOUT a z-index.
        A z-index here would create a stacking context and stop the video's
        mix-blend-multiply from blending with the page background.
      */}
      <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl my-auto text-center flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 lg:space-y-2.5">

        {/* Pill Badge */}
        <div
          className="welcome-rise inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#f3dce3] border border-[#a34063]/25 shadow-xs"
          style={{ '--d': '0.1s' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#a34063]" />
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-[#a34063]">
            Welcome to the Midnight Nursery
          </span>
          <Heart className="w-3 h-3 text-[#a34063] fill-[#a34063]" />
        </div>

        {/* Headings */}
        <div className="space-y-0.5">
          <h1
            className="welcome-rise font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#a34063] leading-tight drop-shadow-xs"
            style={{ '--d': '0.25s' }}
          >
            Before You Fall Asleep...
          </h1>
          <p
            className="welcome-rise text-[10px] sm:text-xs md:text-sm font-bold tracking-widest text-[#5c4033]/80 uppercase"
            style={{ '--d': '0.4s' }}
          >
            A quiet sanctuary for weary minds
          </p>
        </div>

        {/* Pip stage - the reference walk-in video */}
        <div className="relative w-full flex flex-col items-center justify-center my-0.5">
          <div
            onClick={handlePipClick}
            className={`relative w-full max-w-240 sm:max-w-280 md:max-w-[320px] lg:max-w-360 aspect-854/480 flex items-center justify-center overflow-hidden cursor-pointer group ${
              isNightMode ? 'rounded-2xl bg-[#fff8f1] shadow-[0_12px_32px_rgba(0,0,0,0.35)]' : ''
            }`}
            title="Pip is walking into the nursery! Tap Pip to hear stardust chime"
          >
            {/*
              Video background is light grey (~238-255). brightness(1.07) lifts it to
              pure white, then multiply turns that white into the page colour, so only
              Pip remains. The soft mask feathers the edges, so Pip appears to walk
              out of the mist instead of out of a box.
            */}
            <video
              ref={videoRef}
              src="/pip_welcome.mp4"
              poster="/pip_welcome_poster.png"
              autoPlay
              muted
              playsInline
              preload="auto"
              className="welcome-stage-in w-full h-full object-contain pointer-events-none select-none mix-blend-multiply"
              style={{
                '--d': '0.55s',
                filter: 'brightness(1.07)',
                ...(isNightMode
                  ? {}
                  : {
                      WebkitMaskImage:
                        'radial-gradient(ellipse 96% 92% at 50% 50%, #000 62%, transparent 100%)',
                      maskImage:
                        'radial-gradient(ellipse 96% 92% at 50% 50%, #000 62%, transparent 100%)',
                    }),
              }}
            />

            {/* Stardust that drifts around Pip once he has arrived */}
            {!reducedMotion &&
              DUST.map((d, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`absolute pointer-events-none text-[#a34063] transition-opacity duration-1000 ${
                    hasArrived ? 'opacity-60 animate-twinkle' : 'opacity-0'
                  }`}
                  style={{ top: d.top, left: d.left, animationDelay: d.delay }}
                >
                  <Sparkles className={d.size} />
                </span>
              ))}

            {/* Replay Walk Button */}
            {!reducedMotion && hasArrived && (
              <button
                onClick={handleReplayWalk}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-[#fff8f1]/80 hover:bg-[#fff8f1] text-[#a34063] border border-[#a34063]/20 shadow-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                title="Replay Pip's walk animation"
                aria-label="Replay walk animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Junior Dream Engineer Badge */}
          <div className="relative -mt-1.5 z-20">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-[#a34063] text-[#fff8f1] shadow-md whitespace-nowrap inline-flex items-center gap-1.5">
              <span>Junior Dream Engineer</span>
            </span>
          </div>
        </div>

        {/* Lore Introduction Card */}
        <div
          style={cardReveal.style}
          className={`${cardReveal.className} p-2.5 sm:p-3.5 lg:p-4 rounded-xl sm:rounded-2xl bg-[#fff8f1]/95 border border-[#f3dce3] shadow-md backdrop-blur-md text-center space-y-1 max-w-lg lg:max-w-xl mx-auto`}
        >
          <p className="text-xs sm:text-sm lg:text-base text-[#5c4033] leading-snug sm:leading-relaxed font-semibold">
            Meet <strong className="font-black text-[#a34063] underline decoration-[#f3dce3] underline-offset-4">Pip</strong> — a gentle, sleepy, skull-faced baby and <span className="font-bold text-[#a34063]">Junior Dream Engineer</span> who creates the dreams visitors fall asleep inside.
          </p>
          <p className="text-[11px] sm:text-xs text-[#5c4033]/85 leading-snug sm:leading-relaxed font-normal">
            Inside the nursery, busy thoughts melt into soft clouds, music-box lullabies chime in the still air, and quiet bedtime inventions await your discovery.
          </p>
        </div>

        {/* Primary Call to Action */}
        <div
          style={buttonReveal.style}
          className={`${buttonReveal.className} pt-0.5 flex flex-col sm:flex-row items-center justify-center gap-3`}
        >
          <button
            onClick={handleEnterClick}
            disabled={isLeaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 sm:px-8 sm:py-2.5 rounded-full bg-[#a34063] text-[#fff8f1] text-sm sm:text-base font-black shadow-[0_8px_24px_rgba(163,64,99,0.3)] hover:bg-[#5c4033] hover:shadow-[0_12px_28px_rgba(92,64,51,0.35)] hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer min-h-42 sm:min-h-46"
            aria-label="Enter the Nursery and Meet Pip"
          >
            <Sparkles className="w-4 h-4 text-[#fff8f1]" />
            <span>Enter the Nursery & Meet Pip</span>
            <ArrowRight className="w-4 h-4 text-[#fff8f1]" />
          </button>
        </div>

        {/* Bedtime Whisper Hint */}
        <p
          style={tipReveal.style}
          className={`${tipReveal.className} text-[10px] sm:text-[11px] text-[#5c4033]/70 font-medium tracking-wide`}
        >
          🌙 Tip: Turn on sound for wind-up music boxes and celestial lullabies.
        </p>
      </div>
    </section>
  );
}