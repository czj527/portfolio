'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore, Season } from '@/store';
import { useWeather, WeatherType } from '@/hooks/useWeather';

// Emoji sets per season (for non-rain/snow weather)
const SEASON_EMOJIS: Record<Season, string[]> = {
  spring: ['🌸', '🌿', '🌷', '🌱', '🦋'],   // 花、青草、小花、小树苗、蝴蝶
  summer: ['🍦', '🌊', '🍹', '🐚', '☀️'],   // 冰淇淋、海浪、饮料、贝壳、太阳
  autumn: ['🍂', '🍁', '🌾', '🍄', '🌰'],   // 枫叶、红叶、麦穗、蘑菇、栗子
  winter: ['🧣', '❄️', '🌨️', '✨', '💎'],   // 围巾、雪花、雪云、星星、冰晶
};

// Fallback emojis when no weather data
const DEFAULT_EMOJIS = ['✨', '⭐', '💫', '🌟'];

// Base particle counts per season
const BASE_COUNTS: Record<Season, number> = {
  spring: 8,
  summer: 6,
  autumn: 7,
  winter: 10,
};

// Weather particle count multipliers (for emoji particles)
const WEATHER_COUNT_MULTIPLIERS: Record<WeatherType, number> = {
  sunny: 0.8,
  cloudy: 1.0,
  overcast: 1.2,
  rainy: 0,  // No emoji particles for rain
  thunderstorm: 0,  // No emoji particles for thunderstorm
  snowy: 0,  // No emoji particles for snow (except winter season)
};

// Weather animation speed multipliers
const WEATHER_SPEED_MULTIPLIERS: Record<WeatherType, number> = {
  sunny: 0.8,
  cloudy: 1.0,
  overcast: 1.2,
  rainy: 2.5,
  thunderstorm: 3.0,
  snowy: 0.5,
};

// Deterministic pseudo-random based on index
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Rain drop style interface
interface RainDropStyle {
  left: string;
  height: number;      // 15-25px
  opacity: number;     // 0.3-0.7
  duration: string;    // 0.4-1.2s (rain drops are fast)
  delay: string;
  angle: number;       // Wind angle: 0, 15, or 25 degrees
}

// Generate rain drops for rainy/thunderstorm weather
function generateRainDrops(isWindy: boolean): RainDropStyle[] {
  const count = 60 + Math.floor(Math.random() * 20); // 60-80 rain drops
  const drops: RainDropStyle[] = [];
  
  // Angle based on wind: none=0deg, light=15deg, strong=25deg
  const angle = isWindy ? 15 : 0;
  
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 4 + 0);
    const r2 = seededRandom(i * 4 + 1);
    const r3 = seededRandom(i * 4 + 2);
    const r4 = seededRandom(i * 4 + 3);
    
    drops.push({
      left: `${r1 * 100}%`,
      height: 15 + r2 * 10, // 15-25px
      opacity: 0.3 + r3 * 0.4, // 0.3-0.7
      duration: `${0.4 + r4 * 0.8}s`, // 0.4-1.2s
      delay: `${-r1 * 1.5}s`, // Spread out the drops
      angle,
    });
  }
  
  return drops;
}

// Snow dot style interface (white circles, not emoji)
interface SnowDotStyle {
  left: string;
  size: number;       // 2-4px
  opacity: number;    // 0.4-0.8
  duration: string;   // 5-12s
  delay: string;
  horizontalDrift: string;
}

// Generate white snow dots for snowy weather
function generateSnowDots(): SnowDotStyle[] {
  const count = 60;
  const dots: SnowDotStyle[] = [];
  
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 5 + 0);
    const r2 = seededRandom(i * 5 + 1);
    const r3 = seededRandom(i * 5 + 2);
    const r4 = seededRandom(i * 5 + 3);
    const r5 = seededRandom(i * 5 + 4);
    
    dots.push({
      left: `${r1 * 100}%`,
      size: 2 + r2 * 2, // 2-4px
      opacity: 0.4 + r3 * 0.4, // 0.4-0.8
      duration: `${5 + r4 * 7}s`, // 5-12s (slow falling)
      delay: `${-r1 * 12}s`,
      horizontalDrift: `${r5 * 40 - 20}px`, // -20px to 20px
    });
  }
  
  return dots;
}

// Emoji particle style interface
interface ParticleStyle {
  left: string;
  fontSize: number;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
  animationTimingFunction: string;
  emoji: string;
  horizontalDrift?: string;
}

// Generate emoji particles for season/weather
function generateParticles(
  season: Season,
  weatherType?: WeatherType,
  isWindy?: boolean
): ParticleStyle[] {
  // Determine emoji set based on weather
  let emojis: string[];
  if (weatherType && WEATHER_EMOJIS[weatherType]) {
    emojis = WEATHER_EMOJIS[weatherType];
  } else {
    emojis = SEASON_EMOJIS[season];
  }

  // Determine base count and apply weather multiplier
  const baseCount = BASE_COUNTS[season];
  const weatherMultiplier = weatherType ? WEATHER_COUNT_MULTIPLIERS[weatherType] : 1;
  const windMultiplier = isWindy ? 1.3 : 1;
  const count = Math.round(baseCount * weatherMultiplier * windMultiplier);

  // Determine speed multiplier
  const speedMultiplier = weatherType ? WEATHER_SPEED_MULTIPLIERS[weatherType] : 1;
  const windSpeedMultiplier = isWindy ? 1.5 : 1;
  const finalSpeedMultiplier = speedMultiplier * windSpeedMultiplier;

  const particles: ParticleStyle[] = [];

  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 5 + 0);
    const r2 = seededRandom(i * 5 + 1);
    const r3 = seededRandom(i * 5 + 2);
    const r4 = seededRandom(i * 5 + 3);
    const r5 = seededRandom(i * 5 + 4);

    // Base animation duration (affected by weather)
    const baseDuration = 10 + r4 * 12;
    const animationDuration = baseDuration / finalSpeedMultiplier;

    // Horizontal drift for windy conditions
    const horizontalDrift = isWindy ? `${r5 * 30 - 15}px` : '0px';

    particles.push({
      left: `${r1 * 95}%`,
      fontSize: 14 + r2 * 14,
      opacity: 0.5 + r3 * 0.4,
      animationDuration: `${animationDuration}s`,
      animationDelay: `${-r1 * 15}s`,
      animationTimingFunction: 'ease-in-out',
      emoji: emojis[Math.floor(r2 * emojis.length)],
      horizontalDrift,
    });
  }

  return particles;
}

// Weather-specific emoji sets (only for non-rain/snow)
const WEATHER_EMOJIS: Record<WeatherType, string[]> = {
  sunny: ['☀️', '✨', '🌤️', '💫'],
  cloudy: ['☁️', '⛅', '🌥️', '☁️'],
  overcast: ['☁️', '🌫️', '☁️'],
  rainy: [],  // Not used
  thunderstorm: [],  // Not used
  snowy: [],  // Not used
};

// Lightning component for thunderstorm
function LightningOverlay({ active }: { active: boolean }) {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (!active) return;

    const flash = () => {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 100);
    };

    // Random lightning flashes
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        flash();
        // Sometimes double flash
        if (Math.random() > 0.5) {
          setTimeout(flash, 150);
        }
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

export function SeasonParticles() {
  const [mounted, setMounted] = useState(false);
  const currentSeason = useAppStore((state) => state.currentSeason);
  const settings = useAppStore((state) => state.settings);
  const { weather } = useWeather();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use currentSeason from store (set by ThemeProvider)
  const season = currentSeason;
  
  // When weatherEffects is disabled, effectiveWeather is null
  // This means no rain/snow/lightning effects, but season particles still show
  const effectiveWeather = settings.weatherEffects ? weather : null;
  const effectiveWeatherType = effectiveWeather?.weatherType;
  
  // Determine if we should show lightning
  const showLightning = effectiveWeatherType === 'thunderstorm';
  const isWindy = effectiveWeather?.isWindy ?? false;
  
  // Is it a snowy weather condition?
  const isSnowyWeather = effectiveWeatherType === 'snowy';

  // Generate rain drops for rainy/thunderstorm weather
  const rainDrops = useMemo(() => {
    if (effectiveWeatherType !== 'rainy' && effectiveWeatherType !== 'thunderstorm') {
      return [];
    }
    return generateRainDrops(isWindy);
  }, [effectiveWeatherType, isWindy]);

  // Generate white snow dots for snowy weather
  const snowDots = useMemo(() => {
    if (!isSnowyWeather) {
      return [];
    }
    return generateSnowDots();
  }, [isSnowyWeather]);

  // Generate emoji particles for season or other weather
  // Rules:
  // - If it's rainy/thunderstorm: no emoji particles
  // - If it's snowy AND not winter: no emoji particles (just white dots)
  // - If it's snowy AND is winter: show winter emoji particles + white dots
  // - Otherwise: show season emoji particles
  const emojiParticles = useMemo(() => {
    // No emoji particles for rain/thunderstorm
    if (effectiveWeatherType === 'rainy' || effectiveWeatherType === 'thunderstorm') {
      return [];
    }
    
    // Snowy weather without winter season: no emoji particles
    if (effectiveWeatherType === 'snowy' && season !== 'winter') {
      return [];
    }
    
    // For snowy + winter, or any other weather, show season emoji particles
    return generateParticles(season, effectiveWeatherType, isWindy);
  }, [season, effectiveWeatherType, isWindy]);

  // Don't render on SSR, or if particles disabled, or user explicitly chose light mode
  if (!mounted || !settings.particleEffects || settings.themeMode === 'light') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Lightning overlay for thunderstorm */}
      <LightningOverlay active={showLightning} />

      {/* Rain drops - CSS gradient lines */}
      {rainDrops.map((drop, i) => (
        <div
          key={`rain-${i}`}
          className="absolute top-0 w-[2px] rain-drop"
          style={{
            left: drop.left,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            '--rain-angle': `${drop.angle}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* White snow dots - small circles falling slowly */}
      {snowDots.map((dot, i) => (
        <div
          key={`snowdot-${i}`}
          className="absolute top-0 rounded-full bg-white snow-dot"
          style={{
            left: dot.left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            animationDuration: dot.duration,
            animationDelay: dot.delay,
            '--sp-drift': dot.horizontalDrift,
          } as React.CSSProperties}
        />
      ))}

      {/* Emoji particles for season/other weather */}
      {emojiParticles.map((p, i) => (
        <span
          key={`emoji-${season}-${effectiveWeatherType || 'default'}-${i}`}
          className="absolute top-0 season-particle"
          style={{
            left: p.left,
            fontSize: p.fontSize,
            opacity: p.opacity,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            '--sp-drift': p.horizontalDrift,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default SeasonParticles;
