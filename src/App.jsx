import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import StarField from './components/StarField';
import Hero from './components/Hero';
import AboutPip from './components/AboutPip';
import WorkshopCards from './components/WorkshopCards';
import StoryScenes from './components/StoryScenes';
import SecretRoom from './components/SecretRoom';
import Footer from './components/Footer';
import SleepTimerModal from './components/SleepTimerModal';
import WelcomeScreen from './components/WelcomeScreen';
import { 
  playTwinkle, 
  playSecretFanfare, 
  setMutedState, 
  fadeAudioOut, 
  stopAmbientLullaby 
} from './utils/sound';

export default function App() {
  // Dedicated Full-Screen Welcome Interface state
  const [hasEntered, setHasEntered] = useState(false);

  // Sound mute state
  const [isMuted, setIsMuted] = useState(false);

  // Night Mode state
  const [isNightMode, setIsNightMode] = useState(false);

  // Motion Preferences: respect OS setting + user in-app toggle
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [userMotionOverride, setUserMotionOverride] = useState(null);

  const reducedMotion = userMotionOverride !== null ? userMotionOverride : systemReducedMotion;

  const handleToggleReducedMotion = useCallback(() => {
    setUserMotionOverride(prev => prev === null ? !systemReducedMotion : !prev);
  }, [systemReducedMotion]);

  // Listen dynamically to OS motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => {
      setSystemReducedMotion(e.matches);
    };
    if (media.addEventListener) {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } else if (media.addListener) {
      media.addListener(handler);
      return () => media.removeListener(handler);
    }
  }, []);


  // Sync class on document root
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion-override');
    } else {
      document.documentElement.classList.remove('reduce-motion-override');
    }
  }, [reducedMotion]);

  // Easter egg: Clicking mysterious star 5 times unlocks the secret room
  const [starClicks, setStarClicks] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);


  // Sleep Timer / Bedtime Mode state
  const [timerState, setTimerState] = useState({
    isActive: false,
    remainingSeconds: 0,
    totalSeconds: 0,
    isFinished: false,
  });
  const [isSleepTimerModalOpen, setIsSleepTimerModalOpen] = useState(false);
  const timerIntervalRef = useRef(null);

  // Sync mute state with Web Audio master volume
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      setMutedState(next);
      return next;
    });
  }, []);

  // Sparkles using strictly approved colors with reduced-motion support
  const triggerSparkles = useCallback(() => {
    if (reducedMotion) return;
    confetti({
      particleCount: 42,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a34063', '#5c4033', '#f3dce3', '#fff8f1', '#dfd5e6'],
      shapes: ['star', 'circle'],
      scalar: 1.05,
      disableForReducedMotion: true,
    });
  }, [reducedMotion]);

  // Easter egg 5-star click handler
  const handleStarClick = useCallback(() => {
    setStarClicks((prevClicks) => {
      const nextClicks = prevClicks + 1;
      playTwinkle(isMuted);

      if (nextClicks >= 5) {
        setSecretUnlocked(true);
        setIsSecretModalOpen(true);
        triggerSparkles();
        playSecretFanfare(isMuted);
      }
      return nextClicks;
    });
  }, [isMuted, triggerSparkles]);

  // Sleep Timer start handler
  const handleStartTimer = useCallback((seconds) => {
    clearInterval(timerIntervalRef.current);
    setTimerState({
      isActive: true,
      remainingSeconds: seconds,
      totalSeconds: seconds,
      isFinished: false,
    });

    timerIntervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        if (!prev.isActive) return prev;
        const nextRem = prev.remainingSeconds - 1;

        // Progressively shift into night mode as timer winds down
        if (nextRem <= prev.totalSeconds * 0.7 && !isNightMode) {
          setIsNightMode(true);
        }

        // Fade audio in final 8 seconds
        if (nextRem === 8) {
          fadeAudioOut(8);
        }

        if (nextRem <= 0) {
          clearInterval(timerIntervalRef.current);
          stopAmbientLullaby();
          return {
            isActive: false,
            remainingSeconds: 0,
            totalSeconds: prev.totalSeconds,
            isFinished: true, // Pip is now asleep
          };
        }

        return {
          ...prev,
          remainingSeconds: nextRem,
        };
      });
    }, 1000);
  }, [isNightMode]);

  // Sleep Timer cancel handler
  const handleCancelTimer = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    setTimerState({
      isActive: false,
      remainingSeconds: 0,
      totalSeconds: 0,
      isFinished: false,
    });
  }, []);

  // Cleanup timer interval on unmount
  useEffect(() => {
    return () => clearInterval(timerIntervalRef.current);
  }, []);

  // Sync data-theme attribute on html root for night mode styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isNightMode) {
        document.documentElement.setAttribute('data-theme', 'night');
        document.body.classList.add('night-mode');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('night-mode');
      }
    }
  }, [isNightMode]);

  return (
    <div 
      className={`min-h-screen relative select-none overflow-x-hidden transition-colors duration-700 ${
        isNightMode ? 'bg-[#251812] text-[#fff8f1]' : 'bg-[#fff8f1] text-[#5c4033]'
      } ${timerState.isFinished ? 'sleep-timer-still' : ''}`}
    >
      {/* Landing Page: Full-Screen Introduction with reference video animation */}
      <WelcomeScreen 
        onEnter={() => setHasEntered(true)} 
        isMuted={isMuted} 
        isNightMode={isNightMode} 
        reducedMotion={reducedMotion}
      />

      {/* Nursery Sanctuary Container - accessible directly below landing page */}
      <div className="relative transition-all duration-700">
        {/* Background Twinkling Stars & Soft Pink Clouds */}
        <StarField 
          onStarClick={handleStarClick}
          secretUnlocked={secretUnlocked}
          isNightMode={isNightMode}
          reducedMotion={reducedMotion}
        />

      {/* Section 6: Sticky Floating Navbar with Night Mode, Motion Toggle & Sleep Timer */}
      <Navbar 
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isNightMode={isNightMode}
        onToggleNightMode={() => setIsNightMode(!isNightMode)}
        secretUnlocked={secretUnlocked}
        onOpenSecretRoom={() => setIsSecretModalOpen(true)}
        timerState={timerState}
        onOpenSleepTimer={() => setIsSleepTimerModalOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Main Storybook Sections in Exact Required Order: Hero, About, Workshop, Story */}
      <main className="relative z-10 space-y-12">
        {/* Section 2: Hero Welcome with Pip on Cloud & Parallax Depth */}
        <Hero 
          isMuted={isMuted}
          onTriggerSparkles={triggerSparkles}
          isNightMode={isNightMode}
          isSleeping={timerState.isFinished}
          onOpenSleepTimer={() => setIsSleepTimerModalOpen(true)}
          reducedMotion={reducedMotion}
        />

        {/* Section 2: Meet Pip Character Dossier & Interactive Checklist */}
        <AboutPip 
          isMuted={isMuted}
          onTriggerSparkles={triggerSparkles}
        />

        {/* Section 2: The Dream Workshop (Projects Section with 3 Interactive Cards) */}
        <WorkshopCards 
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onTriggerSparkles={triggerSparkles}
        />

        {/* Section 2: Story Scenes (A Journey Through the Night with 3D Depth & Read-Along) */}
        <StoryScenes 
          isMuted={isMuted}
          onTriggerSparkles={triggerSparkles}
        />
      </main>

      {/* Section 2: Closing Bedtime Footer */}
      <Footer 
        onTriggerSparkles={triggerSparkles}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />
      </div>

      {/* Section 2: Secret Room Modal (5-Click Easter Egg Vault + Constellation Reward) */}
      <SecretRoom 
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        isMuted={isMuted}
        onTriggerSparkles={triggerSparkles}
      />

      {/* Extra Feature: Sleep Timer & Bedtime Wind-Down Dialog with 2s Parent Gate */}
      <SleepTimerModal 
        isOpen={isSleepTimerModalOpen}
        onClose={() => setIsSleepTimerModalOpen(false)}
        timerState={timerState}
        onStartTimer={handleStartTimer}
        onCancelTimer={handleCancelTimer}
        isMuted={isMuted}
      />
    </div>
  );
}
