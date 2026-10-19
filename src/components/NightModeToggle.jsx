import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { playLanternSound } from '../utils/sound';

export default function NightModeToggle({ 
  isNightMode, 
  onToggleNightMode, 
  isMuted = false 
}) {
  const handleToggle = () => {
    playLanternSound(!isNightMode, isMuted);
    onToggleNightMode();
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-300 cursor-pointer min-w-[44px] min-h-[44px] select-none border ${
        isNightMode
          ? 'bg-[#3d261d] text-[#f3dce3] border-[#541e30] hover:border-[#a34063] hover:bg-[#4a2f25]'
          : 'bg-[#f3dce3] text-[#5c4033] border-[#f3dce3] hover:border-[#a34063] hover:text-[#a34063]'
      }`}
      title={isNightMode ? "Switch to daytime light" : "Switch to bedtime night mode"}
      aria-label={isNightMode ? "Activate day mode" : "Activate night mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isNightMode ? (
          <Moon 
            className="w-4 h-4 text-[#dfd5e6] fill-[#dfd5e6]/30 transition-transform duration-300 transform rotate-12 scale-105" 
          />
        ) : (
          <Sun 
            className="w-4 h-4 text-[#a34063] transition-transform duration-300 transform hover:rotate-45" 
          />
        )}
      </div>

      {/* Tiny starlight speck on night mode */}
      {isNightMode && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#dfd5e6] animate-ping" />
      )}
    </button>
  );
}
