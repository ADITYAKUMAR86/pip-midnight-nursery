import React, { useRef, useState, useEffect } from 'react';

export default function TiltCard({ 
  children, 
  className = "", 
  maxTilt = 7.5, 
  glare = true 
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isResetting, setIsResetting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  const handlePointerMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || (typeof window !== 'undefined' && window.__isDraggingSlider)) return;
    if (e.target && e.target.closest && e.target.closest('input, textarea, select, button, [data-no-tilt], .no-tilt')) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setIsResetting(false);
    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`,
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.35,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(243, 220, 227, 0.6) 0%, rgba(255, 248, 241, 0.15) 35%, transparent 70%)`
      });
    }
  };

  const handlePointerLeave = () => {
    setIsResetting(true);
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    });
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div 
      className="tilt-card-wrapper h-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={cardRef}
        style={transformStyle}
        className={`tilt-card-inner h-full ${isResetting ? 'is-resetting' : ''} ${className}`}
      >
        {children}
        {glare && (
          <div 
            className="tilt-card-glare"
            style={glareStyle}
          />
        )}
      </div>
    </div>
  );
}
