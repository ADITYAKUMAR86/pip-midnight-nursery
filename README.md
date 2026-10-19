# Pip’s Midnight Nursery 🌙✨
> **An Interactive Bedtime Story & Slumber Sanctuary**  
> *Baby First Hackathon Submission*

Welcome to **Pip’s Midnight Nursery**, an interactive bedtime story experience designed to help visitors—big and small—wind down gently toward peaceful sleep. The website follows **Pip**, a sleepy skull-faced baby and *Junior Dream Engineer*, through a cozy sanctuary of wind-up music boxes, glowing crescent nightlights, playful wooden blocks, and soothing bedtime lullabies.

---

## 🌟 Key Features

### 1. Welcoming Entrance (`WelcomeScreen`)
- **Seamless Video Atmosphere**: Atmospheric bedtime entrance animation (`pip_welcome.mp4`) with smooth video loop, soft starlight catchlights, and cozy nursery styling.
- **Natural Fluid Responsiveness**: Fully responsive layout designed to display comfortably across desktop, tablet, and mobile, with smooth scrolling across 100%, 110%, and 125% browser zoom levels.

### 2. Character Showcase (`AboutPip` & `PipCharacter`)
- **Meet Pip**: Character dossier, nocturnal stats, and gentle bedtime advice whispers.
- **Nightly Routine Checklist**: Interactive 4-step routine (warm chamomile milk, cloud tucking, star lantern check, stardust dream wishes) with celebratory completion fanfare.
- **Living Character Eyes**: Subtle pointer-following eye-tracking and natural, baby-like eyelid blinking with gentle sleep curves.

### 3. The Dream Workshop (`WorkshopCards` with 3D Depth)
- **Lullaby Music Box (Creation 01)**:
  - Genuine music box audio playback connected to high-fidelity audio assets (`/pip_lullaby.mp3` and `/pip_lullaby.wav`).
  - Seamless play/pause toggle with rotating wind-up key, floating melody particles, and direct mute controls.
  - Interactive individual chime notes (C, E, G, B) powered by procedural Web Audio API synthesis.
- **Crescent Nightlight (Creation 02)**:
  - Custom tactile luminance range slider with dynamic linear-gradient progress track fill (`#a34063` berry to `#f3dce3` blush).
  - Fine-grained `-` and `+` steppers and keyboard navigation (Arrow keys, Home, End, PageUp/Down).
  - 3 warm ambient tone modes (*Rose Mute*, *Soft Blush*, *Warm Brown*) with instant lantern glow filter updates.
- **Rattle & Wooden Blocks (Creation 03)**:
  - Shakeable wooden baby rattle with authentic acoustic bead burst sounds.
  - Stackable 4-block tower with playful tumble & rebuild physics and celebratory starlight sparkles.

### 4. A Journey Through the Night (`StoryScenes`)
- **4-Scene Bedtime Narrative**: From *Twilight Departure* to *Dawn’s Soft Welcome*.
- **Count the Stars with Pip Mini-Game**: Interactive celestial star counter embedded directly in the narrative.
- **Web Speech API Read-Aloud**: Voice narration with live word-by-word visual highlighting.

### 5. Sanctuary Night Mode & Bedtime Sleep Timer
- **Twilight / Night Mode Toggle**: Soft contrast transitions without harsh blue light or pitch-black darkness.
- **Wind-Down Sleep Timer**: Progressive wind-down timer with a 2-second hold parent gate, automatic progressive lighting shifts, smooth 8-second audio fade-out, and Pip drifting off to sleep with floating Zzz stardust.

### 6. The Secret Room Easter Egg (`SecretRoom`)
- Hidden five-touch celestial star in the starlit sky unlocking an exclusive vault with dream charms and constellation rewards.

### 7. Accessible Motion & Interaction Preferences
- Complete compliance with `prefers-reduced-motion: reduce`.
- In-app "Pause motion" toggles in both the sticky Navbar and the floating quick-action widget.
- Calms background star twinkling, cloud floats, and 3D card tilt while keeping all core controls fully accessible.

---

## 🎨 Color Palette

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Cream** | `#fff8f1` | Primary background, soft fleece clouds, warm light |
| **Muted Berry** | `#a34063` | Primary headings, active accents, key interactive buttons |
| **Dark Brown** | `#5c4033` | Body typography, card borders, grounding shadows |
| **Soft Blush Pink** | `#f3dce3` | Pill badges, secondary cards, slider track, ambient halos |
| **Lavender** | `#dfd5e6` | Constellation accents, soft night clouds |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (included with Node.js)

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
Open [http://localhost:5175/](http://localhost:5175/) in your web browser.

### Production Build
```bash
# Build optimized static assets into /dist
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```text
baby/
├── dist/                      # Pre-built production bundle (ready to deploy)
│   ├── assets/                # Minified and fingerprinted JS & CSS bundles
│   ├── pip_lullaby.mp3        # Lullaby music box audio (MP3 format)
│   ├── pip_lullaby.wav        # Lullaby music box audio (WAV format)
│   ├── pip_welcome.mp4        # Welcome screen background video
│   └── index.html             # Production entry point
├── public/                    # Static runtime assets
│   ├── manifest.json          # Web app manifest
│   ├── pip_avatar_cloud.png   # Floating cloud interactive Pip
│   ├── pip_dream_lantern.png  # Crescent lantern 3D artwork
│   ├── pip_lullaby_box.png    # Wind-up music box 3D artwork
│   ├── pip_portrait.png       # Pip formal portrait showcase
│   ├── pip_lullaby.mp3        # High-quality music box MP3 asset
│   ├── pip_lullaby.wav        # High-quality music box WAV asset
│   ├── pip_welcome.mp4        # Optimized welcome entrance video
│   └── sw.js                  # Service worker
├── src/
│   ├── components/            # Modular React components
│   │   ├── AboutPip.jsx       # Character profile, routine checklist & typing story
│   │   ├── BedtimeFooter.jsx  # Wish box, navigation, and bottom-right quick dock
│   │   ├── CountStarsMiniGame.jsx # Embedded bedtime star counter mini-game
│   │   ├── DreamWorkshop.jsx  # Workshop section container
│   │   ├── ErrorBoundary.jsx  # React error boundary component
│   │   ├── Footer.jsx         # Footer component
│   │   ├── Hero.jsx           # Parallax bedtime sanctuary hero section
│   │   ├── Navbar.jsx         # Header with Night Mode, Motion & Sleep Timer
│   │   ├── NightModeToggle.jsx# Twilight/Night theme switch
│   │   ├── PipAvatar.jsx      # Pip visual avatar
│   │   ├── PipCharacter.jsx   # Interactive Pip with eye-tracking & eyelid blinks
│   │   ├── SecretRoom.jsx     # Easter egg constellation chamber
│   │   ├── SecretRoomModal.jsx# Easter egg constellation modal dialog
│   │   ├── SleepTimerModal.jsx# Wind-down timer with parent safety gate
│   │   ├── SoftLoader.jsx     # Gentle initial loading screen
│   │   ├── StarField.jsx      # Twinkling stardust background & secret star
│   │   ├── StoryJourney.jsx   # Story section container
│   │   ├── StoryScenes.jsx    # 4-scene bedtime narrative & speech read-aloud
│   │   ├── TiltCard.jsx       # 3D depth tilt card wrapper with drag isolation
│   │   ├── WelcomeScreen.jsx  # Atmospheric landing entrance with video background
│   │   └── WorkshopCards.jsx  # The Dream Workshop (Music Box, Lantern, Blocks)
│   ├── utils/
│   │   └── sound.js           # Procedural Web Audio API sound generator
│   ├── App.jsx                # Root application state & accessibility coordinator
│   ├── index.css              # Custom Tailwind CSS v4 styling & theme tokens
│   └── main.jsx               # React 19 application entry point
├── index.html                 # HTML shell with Google Fonts
├── package.json               # Project dependencies and npm scripts
├── vite.config.js             # Vite configuration with port 5175 binding
└── README.md                  # Project documentation & reference guide
```

---

## 🔒 Child-Safe & Privacy Focused
- **No data collection or external user tracking.**
- **Local audio assets and procedural synthesis** without third-party audio network dependencies.
- **Safe audio gain limiter (max 0.22 ceiling)** designed specifically for gentle bedtime listening.
