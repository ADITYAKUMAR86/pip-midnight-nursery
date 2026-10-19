import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Menu, 
  X, 
  ArrowUpRight, 
  Clock,
  Pause,
  Play
} from 'lucide-react';
import NightModeToggle from './NightModeToggle';
import { playBubblePop, playChimeNote } from '../utils/sound';

export default function Navbar({
  isMuted,
  onToggleMute,
  isNightMode,
  onToggleNightMode,
  secretUnlocked,
  onOpenSecretRoom,
  timerState,
  onOpenSleepTimer,
  reducedMotion = false,
  onToggleReducedMotion
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['welcome', 'hero', 'about', 'workshop', 'story'];
      const scrollPos = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    playChimeNote(659.25, 0.35, isMuted, 0.12);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-6xl mx-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between nursery-navbar">
        
        {/* Nursery Brand / Logo */}
        <div 
          onClick={() => scrollTo('welcome')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#f3dce3] border border-[#a34063]/30 shadow-sm group-hover:scale-105 group-hover:border-[#a34063] transition-all">
            <span className="text-base select-none">🌙</span>
          </div>
          <span className="font-heading text-sm sm:text-base md:text-lg font-bold tracking-wide text-[#5c4033] group-hover:text-[#a34063] transition-colors">
            Midnight Nursery
          </span>
        </div>

        {/* Desktop Navigation Links with Animated Underline and Hover Lift */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-5">
          <button 
            onClick={() => scrollTo('welcome')} 
            className={`nav-item ${activeSection === 'welcome' || activeSection === 'hero' ? 'active' : ''}`}
          >
            Welcome
          </button>
          <button 
            onClick={() => scrollTo('about')} 
            className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}
          >
            Meet Pip
          </button>
          <button 
            onClick={() => scrollTo('workshop')} 
            className={`nav-item ${activeSection === 'workshop' ? 'active' : ''}`}
          >
            Dream Workshop
          </button>
          <button 
            onClick={() => scrollTo('story')} 
            className={`nav-item ${activeSection === 'story' ? 'active' : ''}`}
          >
            Night Story
          </button>
        </nav>

        {/* Right Section: Toggles, Badges & CTA Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Sleep Timer Indicator Pill */}
          <button
            onClick={onOpenSleepTimer}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer min-h-[40px] ${
              timerState?.isActive
                ? 'bg-[#a34063] text-[#fff8f1] border-[#a34063] animate-pulse'
                : 'bg-[#f3dce3] text-[#5c4033] border-transparent hover:border-[#a34063]'
            }`}
            title="Bedtime Sleep Timer"
            aria-label="Open sleep timer"
          >
            <Clock className={`w-3.5 h-3.5 ${timerState?.isActive ? 'text-[#fff8f1]' : 'text-[#a34063]'}`} />
            <span className="hidden sm:inline">
              {timerState?.isActive ? formatTimer(timerState.remainingSeconds) : 'Sleep Timer'}
            </span>
          </button>

          {/* Secret Room Button (Only shown when unlocked; no 0/5 star rating indicator) */}
          {secretUnlocked && (
            <button 
              onClick={onOpenSecretRoom}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[#a34063] text-[#fff8f1] border border-[#a34063] animate-pulse cursor-pointer hover:bg-[#f3dce3] hover:text-[#5c4033] transition-all min-h-[40px]"
              title="Open Secret Room"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fff8f1]" />
              <span>Secret Room</span>
            </button>
          )}

          {/* Accessible Motion Preferences Toggle */}
          <button
            onClick={() => {
              playBubblePop(isMuted);
              onToggleReducedMotion?.();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer min-h-[40px] ${
              reducedMotion
                ? 'bg-[#a34063] text-[#fff8f1] border-[#a34063]'
                : 'bg-[#f3dce3] text-[#5c4033] border-transparent hover:border-[#a34063]'
            }`}
            title={reducedMotion ? "Resume gentle animations" : "Pause little motions"}
            aria-label={reducedMotion ? "Resume gentle animations" : "Pause little motions"}
          >
            {reducedMotion ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#fff8f1]" />
                <span className="hidden xl:inline">Play motion</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#a34063]" />
                <span className="hidden xl:inline">Pause motion</span>
              </>
            )}
          </button>

          {/* Night Mode Toggle */}
          <NightModeToggle 
            isNightMode={isNightMode}
            onToggleNightMode={onToggleNightMode}
            isMuted={isMuted}
          />

          {/* Sound Mute/Unmute Button */}
          <button
            onClick={() => {
              playBubblePop(isMuted);
              onToggleMute();
            }}
            className="p-2.5 rounded-full text-[#5c4033] hover:text-[#a34063] hover:bg-[#f3dce3] transition-all duration-200 cursor-pointer active:scale-95 border border-transparent hover:border-[#f3dce3] min-w-[40px] min-h-[40px] flex items-center justify-center"
            title={isMuted ? "Unmute lullabies" : "Mute audio"}
            aria-label="Toggle sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 opacity-50" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#a34063] animate-pulse" />
            )}
          </button>

          {/* Navbar Primary CTA Button */}
          <button
            onClick={() => scrollTo('workshop')}
            className="btn-nav-cta hidden sm:inline-flex min-h-[42px]"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-lg text-[#5c4033] hover:text-[#a34063] hover:bg-[#f3dce3] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-sm mx-auto rounded-3xl p-5 border border-[#f3dce3] bg-[#fff8f1] text-[#5c4033] shadow-xl space-y-3 animate-fade-in select-none">
          <div className="flex flex-col gap-2 font-medium text-sm">
            <button 
              onClick={() => scrollTo('welcome')} 
              className={`text-left px-4 py-3 rounded-xl transition-colors min-h-[48px] ${
                activeSection === 'welcome' || activeSection === 'hero' ? 'bg-[#f3dce3] text-[#a34063] font-bold' : 'hover:bg-[#f3dce3]'
              }`}
            >
              Welcome
            </button>
            <button 
              onClick={() => scrollTo('about')} 
              className={`text-left px-4 py-3 rounded-xl transition-colors min-h-[48px] ${
                activeSection === 'about' ? 'bg-[#f3dce3] text-[#a34063] font-bold' : 'hover:bg-[#f3dce3]'
              }`}
            >
              Meet Pip
            </button>
            <button 
              onClick={() => scrollTo('workshop')} 
              className={`text-left px-4 py-3 rounded-xl transition-colors min-h-[48px] ${
                activeSection === 'workshop' ? 'bg-[#f3dce3] text-[#a34063] font-bold' : 'hover:bg-[#f3dce3]'
              }`}
            >
              Dream Workshop
            </button>
            <button 
              onClick={() => scrollTo('story')} 
              className={`text-left px-4 py-3 rounded-xl transition-colors min-h-[48px] ${
                activeSection === 'story' ? 'bg-[#f3dce3] text-[#a34063] font-bold' : 'hover:bg-[#f3dce3]'
              }`}
            >
              Night Story
            </button>

            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSleepTimer();
              }}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#f3dce3] transition-colors flex items-center justify-between min-h-[48px]"
            >
              <span>Bedtime Sleep Timer</span>
              <span className="text-xs font-bold text-[#a34063]">
                {timerState?.isActive ? formatTimer(timerState.remainingSeconds) : 'Set Timer'}
              </span>
            </button>

            {secretUnlocked && (
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSecretRoom();
                }} 
                className="text-left px-4 py-3 rounded-xl bg-[#a34063] text-[#fff8f1] font-bold min-h-[48px] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enter Secret Chamber</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
