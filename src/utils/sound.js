// Pure Web Audio API Synthesizer for cozy bedtime sounds & lullabies
// Strictly synthesized in code: zero external audio files, zero dependencies, safe sound levels.

let audioCtx = null;
let masterGain = null;
let currentMasterVolume = 0.8; // User preference (0 to 1)
let isAudioMuted = false;
let ambientLullabyInterval = null;
let ambientLullabyTimeouts = [];

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      // Safe maximum ceiling for toddler bedtime listening (0.24 max gain)
      masterGain.gain.setValueAtTime(isAudioMuted ? 0 : currentMasterVolume * 0.22, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMasterVolume(level = 0.8) {
  currentMasterVolume = Math.max(0, Math.min(1, level));
  if (audioCtx && masterGain) {
    const now = audioCtx.currentTime;
    const targetGain = isAudioMuted ? 0 : currentMasterVolume * 0.22;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.05);
  }
}

export function setMutedState(muted) {
  isAudioMuted = muted;
  if (audioCtx && masterGain) {
    const now = audioCtx.currentTime;
    const targetGain = isAudioMuted ? 0 : currentMasterVolume * 0.22;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.05);
  }
}

export function getMutedState() {
  return isAudioMuted;
}

// Fade audio out smoothly (used by Sleep Timer)
export function fadeAudioOut(durationSeconds = 8) {
  if (audioCtx && masterGain) {
    const now = audioCtx.currentTime;
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0.0001, now + durationSeconds);
  }
  setTimeout(() => {
    stopAmbientLullaby();
  }, durationSeconds * 1000);
}

// Gentle sine-wave chime note with warm harmonic decay
export function playChimeNote(frequency = 523.25, duration = 1.2, isMuted = false, gainLevel = 0.16) {
  if (isMuted || isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  try {
    const now = ctx.currentTime;
    
    // Primary fundamental tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Soft bell harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency * 2.01, now);

    // Warm envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(gainLevel * 0.35, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));

    osc.connect(gain);
    osc2.connect(gain2);

    gain.connect(masterGain);
    gain2.connect(masterGain);

    osc.start(now);
    osc2.start(now);

    osc.stop(now + duration);
    osc2.stop(now + duration);
  } catch (e) {
    console.debug('Audio error', e);
  }
}

// Mechanical wind-up click sound
export function playWindUpClick(isMuted = false) {
  if (isMuted || isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    console.debug(e);
  }
}

// Soft wooden baby rattle shake sound
export function playRattleSound(isMuted = false) {
  if (isMuted || isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;
  try {
    const burstCount = 4;
    for (let i = 0; i < burstCount; i++) {
      const now = ctx.currentTime + (i * 0.055);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + (i % 2) * 80, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    console.debug(e);
  }
}

// Soft tactile bubble pop
export function playBubblePop(isMuted = false) {
  if (isMuted || isAudioMuted) return;
  playChimeNote(880, 0.18, isMuted, 0.11);
}

// Sparkle twinkle for clicking stars or Pip
export function playTwinkle(isMuted = false) {
  if (isMuted || isAudioMuted) return;
  const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playChimeNote(freq, 0.9, isMuted, 0.13);
    }, idx * 75);
  });
}

// Lullaby melody (Twinkle Twinkle Little Star phrase)
let lullabyTimer = null;
let phraseTimeouts = [];

export function stopLullabyPhrase() {
  clearTimeout(lullabyTimer);
  phraseTimeouts.forEach(t => clearTimeout(t));
  phraseTimeouts = [];
}

export function playLullabyPhrase(isMuted = false, onFinished) {
  stopLullabyPhrase();
  if (isMuted || isAudioMuted) return;

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const melody = [
    { freq: 523.25, time: 0 },    // C5
    { freq: 523.25, time: 350 },  // C5
    { freq: 783.99, time: 700 },  // G5
    { freq: 783.99, time: 1050 }, // G5
    { freq: 880.00, time: 1400 }, // A5
    { freq: 880.00, time: 1750 }, // A5
    { freq: 783.99, time: 2100 }, // G5
    { freq: 698.46, time: 2700 }, // F5
    { freq: 698.46, time: 3050 }, // F5
    { freq: 659.25, time: 3400 }, // E5
    { freq: 659.25, time: 3750 }, // E5
    { freq: 587.33, time: 4100 }, // D5
    { freq: 587.33, time: 4450 }, // D5
    { freq: 523.25, time: 4800 }  // C5
  ];

  melody.forEach((item, index) => {
    const t = setTimeout(() => {
      playChimeNote(item.freq, 1.4, isMuted, 0.14);
      if (index === melody.length - 1) {
        const finishTimer = setTimeout(() => {
          onFinished?.();
        }, 1200);
        phraseTimeouts.push(finishTimer);
      }
    }, item.time);
    phraseTimeouts.push(t);
  });
}

// Continuous ambient gentle music box loop
export function startAmbientLullaby(isMuted = false) {
  stopAmbientLullaby();
  if (isMuted || isAudioMuted) return;
  playLullabyPhrase(isMuted);
  ambientLullabyInterval = setInterval(() => {
    playLullabyPhrase(isMuted);
  }, 5800);
}

export function stopAmbientLullaby() {
  if (ambientLullabyInterval) {
    clearInterval(ambientLullabyInterval);
    ambientLullabyInterval = null;
  }
  ambientLullabyTimeouts.forEach(t => clearTimeout(t));
  ambientLullabyTimeouts = [];
}

// Waypoint arrival chime
export function playWaypointChime(index = 0, isMuted = false) {
  if (isMuted || isAudioMuted) return;
  const scales = [523.25, 587.33, 659.25, 783.99]; // C, D, E, G
  const freq = scales[index % scales.length];
  playChimeNote(freq, 1.0, isMuted, 0.14);
  setTimeout(() => {
    playChimeNote(freq * 1.5, 0.8, isMuted, 0.1);
  }, 120);
}

// Lantern switch sound
export function playLanternSound(turnOn, isMuted = false) {
  if (isMuted || isAudioMuted) return;
  playChimeNote(turnOn ? 784 : 440, 0.6, isMuted, 0.12);
}

// Secret room fanfare
export function playSecretFanfare(isMuted = false) {
  if (isMuted || isAudioMuted) return;
  const fanfare = [
    { freq: 523.25, time: 0 },
    { freq: 659.25, time: 120 },
    { freq: 783.99, time: 240 },
    { freq: 1046.50, time: 380 },
    { freq: 1318.51, time: 540 }
  ];
  fanfare.forEach(item => {
    setTimeout(() => {
      playChimeNote(item.freq, 1.8, isMuted, 0.15);
    }, item.time);
  });
}

// Web Speech API gentle read-aloud helper (gentle bedtime tone)
let activeUtterance = null;
export function speakGentleStory(text, onWord, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82; // Calm, gentle bedtime pacing
  utterance.pitch = 1.05; // Friendly, warm
  utterance.volume = 0.7;

  // Prefer warm friendly voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Karen'))
  );
  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onboundary = (event) => {
    if (event.name === 'word' && onWord) {
      onWord(event.charIndex, event.charLength || 5);
    }
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}
