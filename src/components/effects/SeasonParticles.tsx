'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore, Season } from '@/store';
import { useWeather, WeatherType } from '@/hooks/useWeather';

// ==================== Particle Config ====================
interface ParticleStyle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  emoji: string;
}

const SEASON_EMOJIS: Record<Season, string[]> = {
  spring: ['🌸', '🌺', '🌷', '💮', '🦋'],
  summer: ['🍦', '🌊', '🍹', '🐚', '☀️'],
  autumn: ['🍂', '🍁', '🌾', '🍄', '🌰'],
  winter: ['❄️', '🌨️', '✨', '💎', '🧣'],
};

const PARTICLE_COUNTS: Record<Season, number> = {
  spring: 12,
  summer: 10,
  autumn: 12,
  winter: 15,
};

// Deterministic pseudo-random
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateParticles(season: Season): ParticleStyle[] {
  const emojis = SEASON_EMOJIS[season];
  const count = PARTICLE_COUNTS[season];
  const particles: ParticleStyle[] = [];

  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 5 + 0);
    const r2 = seededRandom(i * 5 + 1);
    const r3 = seededRandom(i * 5 + 2);
    const r4 = seededRandom(i * 5 + 3);

    particles.push({
      id: i,
      x: r1 * 95,
      size: 14 + r2 * 14,
      delay: r3 * 15,
      duration: 10 + r4 * 15,
      opacity: 0.5 + r3 * 0.4,
      emoji: emojis[Math.floor(r2 * emojis.length)],
    });
  }

  return particles;
}

// ==================== Season Particle Component ====================
function SeasonParticle({ particle, animationName }: { particle: ParticleStyle; animationName: string }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${particle.x}%`,
        top: '-5%',
        fontSize: `${particle.size}px`,
        opacity: particle.opacity,
        animation: `${animationName} ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
      }}
    >
      {particle.emoji}
    </div>
  );
}

const MemoizedSeasonParticle = React.memo(SeasonParticle);

// ==================== Rain Drop Component ====================
interface RainDropStyle {
  id: number;
  left: number;
  height: number;
  opacity: number;
  duration: number;
  delay: number;
}

function generateRainDrops(count: number = 60): RainDropStyle[] {
  const drops: RainDropStyle[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 4 + 0);
    const r2 = seededRandom(i * 4 + 1);
    const r3 = seededRandom(i * 4 + 2);
    const r4 = seededRandom(i * 4 + 3);
    drops.push({
      id: i,
      left: r1 * 100,
      height: 15 + r2 * 10,
      opacity: 0.3 + r3 * 0.4,
      duration: 0.4 + r4 * 0.8,
      delay: -r1 * 1.5,
    });
  }
  return drops;
}

// ==================== Snow Dot Component ====================
interface SnowDotStyle {
  id: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

function generateSnowDots(count: number = 50): SnowDotStyle[] {
  const dots: SnowDotStyle[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 5 + 0);
    const r2 = seededRandom(i * 5 + 1);
    const r3 = seededRandom(i * 5 + 2);
    const r4 = seededRandom(i * 5 + 3);
    const r5 = seededRandom(i * 5 + 4);
    dots.push({
      id: i,
      left: r1 * 100,
      size: 2 + r2 * 2,
      opacity: 0.4 + r3 * 0.4,
      duration: 5 + r4 * 7,
      delay: -r1 * 12,
      drift: r5 * 40 - 20,
    });
  }
  return dots;
}

// ==================== Lightning Overlay ====================
function LightningOverlay({ active }: { active: boolean }) {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (!active) return;
    const flash = () => {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 100);
    };
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        flash();
        if (Math.random() > 0.5) setTimeout(flash, 150);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-75 ${
        flashing ? 'opacity-30' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(200,220,255,0.5) 100%)',
      }}
    />
  );
}

// ==================== Main Component ====================
export function SeasonParticles() {
  const [mounted, setMounted] = useState(false);
  const currentSeason = useAppStore((state) => state.currentSeason);
  const settings = useAppStore((state) => state.settings);
  const { weather } = useWeather();

  useEffect(() => {
    setMounted(true);
  }, []);

  const season = currentSeason;
  const effectiveWeather = settings.weatherEffects ? weather : null;
  const effectiveWeatherType = effectiveWeather?.weatherType;
  const isWindy = effectiveWeather?.isWindy ?? false;
  const isSnowyWeather = effectiveWeatherType === 'snowy';
  const showLightning = effectiveWeatherType === 'thunderstorm';

  // Season emoji particles
  const emojiParticles = useMemo(() => {
    if (effectiveWeatherType === 'rainy' || effectiveWeatherType === 'thunderstorm') return [];
    if (effectiveWeatherType === 'snowy' && season !== 'winter') return [];
    return generateParticles(season);
  }, [season, effectiveWeatherType]);

  // Rain drops
  const rainDrops = useMemo(() => {
    if (effectiveWeatherType !== 'rainy' && effectiveWeatherType !== 'thunderstorm') return [];
    return generateRainDrops();
  }, [effectiveWeatherType]);

  // Snow dots (white circles for snowy weather)
  const snowDots = useMemo(() => {
    if (!isSnowyWeather) return [];
    return generateSnowDots();
  }, [isSnowyWeather]);

  // Animation name based on season
  const animationName = `${season}Fall`;

  if (!mounted || !settings.particleEffects || settings.themeMode === 'light') {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50" aria-hidden="true">
      <style>{`
        /* Season particle fall - with swing for natural feel */
        @keyframes springFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          25% { transform: translateY(25vh) translateX(calc(var(--swing, 30px) * 0.3)) rotate(90deg) scale(0.95); }
          50% { transform: translateY(50vh) translateX(calc(var(--swing, 30px) * -0.2)) rotate(180deg) scale(1); }
          75% { transform: translateY(75vh) translateX(calc(var(--swing, 30px) * 0.4)) rotate(270deg) scale(0.95); }
          90% { opacity: 0.6; }
          100% { transform: translateY(105vh) translateX(calc(var(--swing, 30px) * 0.8)) rotate(360deg) scale(0.85); opacity: 0; }
        }
        @keyframes summerFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          25% { transform: translateY(25vh) translateX(calc(var(--swing, 20px) * 0.2)) rotate(10deg); }
          50% { transform: translateY(50vh) translateX(calc(var(--swing, 20px) * -0.15)) rotate(-8deg); }
          75% { transform: translateY(75vh) translateX(calc(var(--swing, 20px) * 0.3)) rotate(6deg); }
          90% { opacity: 0.6; }
          100% { transform: translateY(105vh) translateX(calc(var(--swing, 20px) * 0.5)) rotate(-5deg); opacity: 0; }
        }
        @keyframes autumnFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          25% { transform: translateY(25vh) translateX(calc(var(--swing, 40px) * 0.4)) rotate(90deg); }
          50% { transform: translateY(50vh) translateX(calc(var(--swing, 40px) * -0.3)) rotate(180deg); }
          75% { transform: translateY(75vh) translateX(calc(var(--swing, 40px) * 0.5)) rotate(270deg); }
          90% { opacity: 0.6; }
          100% { transform: translateY(105vh) translateX(calc(var(--swing, 40px) * 0.9)) rotate(360deg); opacity: 0; }
        }
        @keyframes winterFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          25% { transform: translateY(25vh) translateX(calc(var(--swing, 60px) * 0.3)) rotate(120deg); }
          50% { transform: translateY(50vh) translateX(calc(var(--swing, 60px) * -0.2)) rotate(240deg); }
          75% { transform: translateY(75vh) translateX(calc(var(--swing, 60px) * 0.5)) rotate(360deg); }
          90% { opacity: 0.7; }
          100% { transform: translateY(105vh) translateX(calc(var(--swing, 60px) * 0.8)) rotate(480deg); opacity: 0; }
        }

        /* Rain fall */
        @keyframes rainFall {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        .rain-drop {
          background: linear-gradient(to bottom, transparent, rgba(150, 200, 255, 0.7));
          animation: rainFall linear infinite;
        }

        /* Snow dot fall */
        @keyframes snowDotFall {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(50vh) translateX(calc(var(--snow-drift, 0px))); }
          100% { transform: translateY(105vh) translateX(calc(var(--snow-drift, 0px) * -0.5)); opacity: 0; }
        }
        .snow-dot {
          animation: snowDotFall ease-in-out infinite;
        }
      `}</style>

      {/* Lightning overlay */}
      <LightningOverlay active={showLightning} />

      {/* Rain drops */}
      {rainDrops.map((drop) => (
        <div
          key={`rain-${drop.id}`}
          className="absolute top-0 w-[2px] rain-drop"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}

      {/* White snow dots */}
      {snowDots.map((dot) => (
        <div
          key={`snow-${dot.id}`}
          className="absolute top-0 rounded-full bg-white snow-dot"
          style={{
            left: `${dot.left}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            animationDuration: `${dot.duration}s`,
            animationDelay: `${dot.delay}s`,
            '--snow-drift': `${dot.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Season emoji particles */}
      {emojiParticles.map((p) => (
        <MemoizedSeasonParticle
          key={`${season}-${p.id}`}
          particle={p}
          animationName={animationName}
        />
      ))}
    </div>
  );
}

export default SeasonParticles;
