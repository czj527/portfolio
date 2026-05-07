'use client';

import { useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAppStore, ThemeMode } from '@/store';
import { SeasonParticles } from '@/components/effects/SeasonParticles';
import { useWeather, WeatherType } from '@/hooks/useWeather';

type SeasonClass = 'spring' | 'summer' | 'autumn' | 'winter';
type BrightnessClass = 'light' | 'dark';

const ALL_SEASON_CLASSES: SeasonClass[] = ['spring', 'summer', 'autumn', 'winter'];
const ALL_BRIGHTNESS_CLASSES: BrightnessClass[] = ['light', 'dark'];
const ALL_WEATHER_CLASSES: string[] = ['weather-sunny', 'weather-cloudy', 'weather-overcast', 'weather-rainy', 'weather-thunderstorm', 'weather-snowy', 'weather-windy'];

function getCurrentSeason(): SeasonClass {
  if (typeof window === 'undefined') return 'spring';
  const month = new Date().getMonth() + 1;
  if (month >= 1 && month < 4) return 'spring';
  if (month >= 4 && month < 7) return 'summer';
  if (month >= 7 && month < 10) return 'autumn';
  return 'winter';
}

export type ResolvedTheme = {
  season: SeasonClass;
  brightness: BrightnessClass;
};

function getTimeBasedTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return { season: 'spring', brightness: 'light' };
  const hour = new Date().getHours();
  const season = getCurrentSeason();

  // Morning 6-9: Season light
  if (hour >= 6 && hour < 9) {
    return { season, brightness: 'light' };
  }

  // Late morning 9-12: Season light
  if (hour >= 9 && hour < 12) {
    return { season, brightness: 'light' };
  }

  // Noon 12-14: Season light warm
  if (hour >= 12 && hour < 14) {
    return { season, brightness: 'light' };
  }

  // Afternoon 14-17: Season light
  if (hour >= 14 && hour < 17) {
    return { season, brightness: 'light' };
  }

  // Evening 17-19: Season dark transition
  if (hour >= 17 && hour < 19) {
    return { season, brightness: 'dark' };
  }

  // Night 19-6: Season dark
  return { season, brightness: 'dark' };
}

function applyTheme(
  resolved: ResolvedTheme,
  weatherType?: WeatherType,
  isWindy?: boolean
) {
  const root = document.documentElement;
  
  // Remove old season classes
  ALL_SEASON_CLASSES.forEach((cls) => root.classList.remove(cls));
  // Remove old brightness classes
  ALL_BRIGHTNESS_CLASSES.forEach((cls) => root.classList.remove(cls));
  // Remove old weather classes
  ALL_WEATHER_CLASSES.forEach((cls) => root.classList.remove(cls));
  
  // Add new classes
  root.classList.add(resolved.season);
  root.classList.add(resolved.brightness);
  
  // Add weather class if available
  if (weatherType) {
    root.classList.add(`weather-${weatherType}`);
  }
  if (isWindy) {
    root.classList.add('weather-windy');
  }
  
  // Set data attributes for CSS selection
  root.setAttribute('data-theme', `${resolved.season}-${resolved.brightness}`);
  root.setAttribute('data-weather', weatherType || 'unknown');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useAppStore((state) => state.settings);
  const { weather } = useWeather();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTheme = useCallback(() => {
    let resolved: ResolvedTheme;

    switch (settings.themeMode) {
      case 'light':
        resolved = { season: getCurrentSeason(), brightness: 'light' };
        break;
      case 'dark':
        resolved = { season: getCurrentSeason(), brightness: 'dark' };
        break;
      case 'spring':
        resolved = { season: 'spring', brightness: 'light' };
        break;
      case 'summer':
        resolved = { season: 'summer', brightness: 'light' };
        break;
      case 'autumn':
        resolved = { season: 'autumn', brightness: 'light' };
        break;
      case 'winter':
        resolved = { season: 'winter', brightness: 'light' };
        break;
      case 'realtime':
        resolved = getTimeBasedTheme();
        break;
      default:
        resolved = getTimeBasedTheme();
    }

    // Apply theme with weather info (only if weatherEffects enabled)
    applyTheme(
      resolved,
      settings.weatherEffects ? weather?.weatherType : undefined,
      settings.weatherEffects ? weather?.isWindy : undefined
    );

    // Sync store for other components
    useAppStore.setState({
      currentTheme: resolved.brightness === 'dark' ? 'dark' : resolved.season,
      currentSeason: resolved.season,
    });
  }, [settings.themeMode, weather]);

  useEffect(() => {
    updateTheme();

    if (settings.themeMode === 'realtime') {
      intervalRef.current = setInterval(updateTheme, 60000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [settings.themeMode, updateTheme]);

  return (
    <>
      {children}
      <SeasonParticles />
    </>
  );
}

export { useAppStore };
export default ThemeProvider;
