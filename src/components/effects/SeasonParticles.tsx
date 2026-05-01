'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore, Season } from '@/store';

// Emoji sets per season
const SEASON_EMOJIS: Record<Season, string[]> = {
  spring: ['🌸', '🌺', '🌷', '💮', '🦋'],
  summer: ['☀️', '🌻', '🌊', '🐚', '🍹'],
  autumn: ['🍂', '🍁', '🌾', '🍄', '🌰'],
  winter: ['❄️', '🌨️', '✨', '💎', '🧊'],
};

const COUNTS: Record<Season, number> = {
  spring: 8,
  summer: 6,
  autumn: 7,
  winter: 10,
};

// Deterministic pseudo-random based on index
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface ParticleStyle {
  left: string;
  fontSize: number;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
  emoji: string;
}

function generateParticles(season: Season): ParticleStyle[] {
  const emojis = SEASON_EMOJIS[season];
  const count = COUNTS[season];
  const particles: ParticleStyle[] = [];

  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 4 + 0);
    const r2 = seededRandom(i * 4 + 1);
    const r3 = seededRandom(i * 4 + 2);
    const r4 = seededRandom(i * 4 + 3);

    particles.push({
      left: `${r1 * 95}%`,
      fontSize: 14 + r2 * 14,
      opacity: 0.4 + r3 * 0.5,
      animationDuration: `${10 + r4 * 12}s`,
      animationDelay: `${-r1 * 15}s`, // negative delay = start mid-animation
      emoji: emojis[Math.floor(r2 * emojis.length)],
    });
  }

  return particles;
}

export function SeasonParticles() {
  const [mounted, setMounted] = useState(false);
  const currentTheme = useAppStore((state) => state.currentTheme);
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve season from theme or current month
  const season = useMemo<Season>(() => {
    if (currentTheme === 'spring' || currentTheme === 'summer' ||
        currentTheme === 'autumn' || currentTheme === 'winter') {
      return currentTheme;
    }
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }, [currentTheme]);

  // Generate particles once per season (deterministic, no re-generation)
  const particles = useMemo(() => generateParticles(season), [season]);

  // Don't render on SSR, or if particles disabled, or light mode
  if (!mounted || !settings.particleEffects || currentTheme === 'light') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={`sp-${season}-${i}`}
          className="absolute top-0 season-particle"
          style={{
            left: p.left,
            fontSize: p.fontSize,
            animation: `seasonFall ${p.animationDuration} ease-in-out ${p.animationDelay} infinite`,
            '--sp-opacity': p.opacity,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default SeasonParticles;
