import React, { useState, useRef, useEffect } from 'react';
import { Moon, Clock, ShieldCheck, X, Check, Play, Square } from 'lucide-react';
import { playBubblePop, playChimeNote } from '../utils/sound';

export default function SleepTimerModal({ 
  isOpen, 
  onClose, 
  timerState, // { isActive, remainingSeconds, totalSeconds, isFinished }
  onStartTimer, 
  onCancelTimer,
  isMuted = false 
}) {
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const holdIntervalRef = useRef(null);

  // Reset parent gate when opened
  useEffect(() => {
    if (isOpen) {
      setParentUnlocked(false);
      setHoldProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Parent Gate: 2-second continuous hold
  const startHolding = () => {
    clearInterval(holdIntervalRef.current);
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / 2000) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setParentUnlocked(true);
        playChimeNote(880, 0.4, isMuted, 0.15);
      }
    }, 40);
  };

  const stopHolding = () => {
    clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const handleSelectDuration = (seconds) => {
    playChimeNote(659.25, 0.5, isMuted, 0.12);
    onStartTimer(seconds);
    onClose();
  };

  const handleCancel = () => {
    playBubblePop(isMuted);
    onCancelTimer();
    onClose();
  };

  const formatRemaining = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251812]/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-[#fff8f1] border-2 border-[#a34063] text-[#5c4033] shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f3dce3] hover:bg-[#a34063] text-[#5c4033] hover:text-[#fff8f1] transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Close sleep timer dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="pill-badge">
            <Clock className="w-3.5 h-3.5 text-[#a34063]" />
            <span>Bedtime Wind-Down</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#a34063]">
            Sleep Timer & Bedtime Mode
          </h3>

          <p className="text-xs sm:text-sm text-[#5c4033] opacity-80">
            Gradually dims lighting, slows animations, fades the lullaby, and puts Pip to sleep.
          </p>
        </div>

        {/* Step 1: Parent Gate if not unlocked */}
        {!parentUnlocked ? (
          <div className="p-6 rounded-2xl bg-[#f3dce3] border border-[#a34063]/30 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a34063]">
              <ShieldCheck className="w-4 h-4 text-[#a34063]" />
              <span>Parent Gate (Child Safety)</span>
            </div>

            <p className="text-xs text-[#5c4033]">
              Press and hold the button below for 2 seconds to access bedtime timer settings.
            </p>

            {/* Hold Button with Progress Ring */}
            <div className="relative flex flex-col items-center">
              <button
                type="button"
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                className="w-full relative overflow-hidden btn-primary text-xs sm:text-sm py-3 px-6 cursor-pointer active:scale-98 select-none"
              >
                {/* Visual hold fill bar */}
                <div 
                  className="absolute inset-0 bg-[#6e243e] opacity-40 transition-all duration-75 pointer-events-none"
                  style={{ width: `${holdProgress}%` }}
                />
                <span className="relative z-10 font-bold">
                  {holdProgress > 0 ? `Holding... ${Math.round(holdProgress)}%` : "Hold 2 Seconds to Unlock"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Unlocked Parent Settings */
          <div className="space-y-5 animate-fade-in">
            {timerState.isActive ? (
              <div className="p-4 rounded-2xl bg-[#f3dce3] border border-[#a34063] text-center space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#a34063]">
                  Sleep Timer Active 🌙
                </span>
                <div className="font-heading text-3xl font-bold text-[#5c4033]">
                  {formatRemaining(timerState.remainingSeconds)}
                </div>
                <p className="text-xs text-[#5c4033] opacity-80">
                  World is winding down. Pip is getting sleepy.
                </p>
                <button
                  onClick={handleCancel}
                  className="mt-2 btn-secondary text-xs py-2 px-4 flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Square className="w-3.5 h-3.5 text-[#a34063]" />
                  <span>Cancel Timer & Wake Pip</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#5c4033] uppercase tracking-wider text-center">
                  Select Bedtime Duration
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "5 Minutes", seconds: 300, desc: "Quick wind-down" },
                    { label: "10 Minutes", seconds: 600, desc: "Standard tuck-in" },
                    { label: "15 Minutes", seconds: 900, desc: "Deep sleep journey" },
                    { label: "30s Demo ⚡", seconds: 30, desc: "Quick judge demo" },
                  ].map((item) => (
                    <button
                      key={item.seconds}
                      onClick={() => handleSelectDuration(item.seconds)}
                      className="p-3.5 rounded-2xl border border-[#f3dce3] bg-[#fff8f1] hover:border-[#a34063] hover:bg-[#f3dce3] text-left transition-all cursor-pointer group active:scale-95"
                    >
                      <div className="font-heading text-sm font-bold text-[#5c4033] group-hover:text-[#a34063]">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#5c4033] opacity-75">
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={onClose}
                className="text-xs font-bold text-[#a34063] hover:underline cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
