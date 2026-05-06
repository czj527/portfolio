'use client';

import { useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAppStore, ThemeMode } from '@/store';
import { SeasonParticles } from '@/components/effects/SeasonParticles';

type SeasonClass = 'spring' | 'summer' | 'autumn' | 'winter';
type BrightnessClass = 'light' | 'dark';

const ALL_SEASON_CLASSES: SeasonClass[] = ['spring', 'summer', 'autumn', 'winter'];
const ALL_BRIGHTNESS_CLASSES: BrightnessClass[] = ['light', 'dark'];

function getCurrentSeason(): SeasonClass {
  if (typeof window === 'undefined') return 'spring';
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 4) return 'spring';
  if (month >= 5 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
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

  // 早晨 6-9: 季节亮色
  if (hour >= 6 && hour < 9) {
    return { season, brightness: 'light' };
  }

  // 上午 9-12: 季节亮色
  if (hour >= 9 && hour < 12) {
    return { season, brightness: 'light' };
  }

  // 中午 12-14: 季节亮色偏暖
  if (hour >= 12 && hour < 14) {
    return { season, brightness: 'light' };
  }

  // 下午 14-17: 季节亮色
  if (hour >= 14 && hour < 17) {
    return { season, brightness: 'light' };
  }

  // 傍晚 17-19: 季节暗色，过渡
  if (hour >= 17 && hour < 19) {
    return { season, brightness: 'dark' };
  }

  // 夜间 19-6: 季节暗色
  return { season, brightness: 'dark' };
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  ALL_SEASON_CLASSES.forEach((cls) => root.classList.remove(cls));
  ALL_BRIGHTNESS_CLASSES.forEach((cls) => root.classList.remove(cls));
  root.classList.add(resolved.season);
  root.classList.add(resolved.brightness);
  root.setAttribute('data-theme', `${resolved.season}-${resolved.brightness}`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useAppStore((state) => state.settings);
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

    applyTheme(resolved);

    // 同步更新 store，供 SeasonParticles 等组件使用
    useAppStore.setState({
      currentTheme: resolved.brightness === 'dark' ? 'dark' : resolved.season,
      currentSeason: resolved.season,
    });
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
