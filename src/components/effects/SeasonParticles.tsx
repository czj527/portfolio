'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore, Season } from '@/store';
import { useWeather, WeatherType } from '@/hooks/useWeather';

// Emoji sets per season
const SEASON_EMOJIS: Record<Season, string[]> = {
  spring: ['🌸', '🌺', '🌷', '💮', '🦋'],
  summer: ['☀️', '🌻', '🌊', '🐚', '🍹'],
  autumn: ['🍂', '🍁', '🌾', '🍄', '🌰'],
  winter: ['❄️', '🌨️', '✨', '💎', '🧊'],
};

// Weather-specific emoji sets
const WEATHER_EMOJIS: Record<WeatherType, string[]> = {
  sunny: ['☀️', '✨', '🌤️', '💫'],
  cloudy: ['☁️', '⛅', '🌥️', '☁️'],
  overcast: ['☁️', '🌫️', '☁️'],
  rainy: ['💧', '🌧️', '💦', '🌧️', '💧'],
  thunderstorm: ['⛈️', '⚡', '💥', '🌩️'],
  snowy: ['❄️', '🌨️', '❅', '❆', '🌨️'],
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

// Weather particle count multipliers
const WEATHER_COUNT_MULTIPLIERS: Record<WeatherType, number> = {
  sunny: 0.8,
  cloudy: 1.0,
  overcast: 1.2,
  rainy: 1.5,
  thunderstorm: 2.0,
  snowy: 1.8,
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

    // Different timing function for rain (faster drop)
    const timingFunction = weatherType === 'rainy' || weatherType === 'thunderstorm'
      ? 'linear'
      : 'ease-in-out';

    particles.push({
      left: `${r1 * 95}%`,
      fontSize: weatherType === 'rainy' || weatherType === 'thunderstorm'
        ? 10 + r2 * 6  // Smaller for rain
        : weatherType === 'snowy'
          ? 12 + r2 * 8  // Medium for snow
          : 14 + r2 * 14,  // Original for others
      opacity: 0.5 + r3 * 0.4,
      animationDuration: `${animationDuration}s`,
      animationDelay: `${-r1 * 15}s`,
      animationTimingFunction: timingFunction,
      emoji: emojis[Math.floor(r2 * emojis.length)],
      horizontalDrift,
    });
  }

  return particles;
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

  // Generate particles with weather influence
  const particles = useMemo(
    () => generateParticles(season, weather?.weatherType, weather?.isWindy),
    [season, weather?.weatherType, weather?.isWindy]
  );

  // Don't render on SSR, or if particles disabled, or user explicitly chose light mode
  if (!mounted || !settings.particleEffects || settings.themeMode === 'light') {
    return null;
  }

  // Determine animation class based on weather
  const getAnimationClass = (): string => {
    if (!weather) return 'season-particle';
    
    switch (weather.weatherType) {
      case 'rainy':
      case 'thunderstorm':
        return 'rain-particle';
      case 'snowy':
        return 'snow-particle';
      default:
        return 'season-particle';
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={`sp-${season}-${weather?.weatherType || 'default'}-${i}`}
          className={getAnimationClass()}
          style={{
            left: p.left,
            fontSize: p.fontSize,
            animation: `seasonFall ${p.animationDuration} ${p.animationTimingFunction} ${p.animationDelay} infinite`,
            '--sp-opacity': p.opacity,
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
