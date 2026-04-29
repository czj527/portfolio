'use client';

import { useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAppStore, ThemeMode } from '@/store';
import { SeasonParticles } from '@/components/effects/SeasonParticles';

type ThemeClass = 'light' | 'dark' | 'spring' | 'summer' | 'autumn' | 'winter';

const ALL_THEME_CLASSES: ThemeClass[] = [
  'light',
  'dark',
  'spring',
  'summer',
  'autumn',
  'winter',
];

function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  if (typeof window === 'undefined') return 'spring';
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getTimeBasedTheme(): ThemeClass {
  if (typeof window === 'undefined') return 'spring';
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return getCurrentSeason();
  }
  
  if (hour >= 12 && hour < 14) {
    return 'summer';
  }
  
  if (hour >= 14 && hour < 18) {
    return 'light';
  }
  
  return 'dark';
}

function applyTheme(themeClass: ThemeClass) {
  const root = document.documentElement;
  ALL_THEME_CLASSES.forEach((cls) => root.classList.remove(cls));
  root.classList.add(themeClass);
  root.setAttribute('data-theme', themeClass);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useAppStore((state) => state.settings);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTheme = useCallback(() => {
    let resolvedTheme: ThemeClass;

    switch (settings.themeMode) {
      case 'light':
        resolvedTheme = 'light';
        break;
      case 'dark':
        resolvedTheme = 'dark';
        break;
      case 'spring':
        resolvedTheme = 'spring';
        break;
      case 'summer':
        resolvedTheme = 'summer';
        break;
      case 'autumn':
        resolvedTheme = 'autumn';
        break;
      case 'winter':
        resolvedTheme = 'winter';
        break;
      case 'realtime':
        resolvedTheme = getTimeBasedTheme();
        break;
      default:
        resolvedTheme = getTimeBasedTheme();
    }

    applyTheme(resolvedTheme);
  }, [settings.themeMode]);

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
