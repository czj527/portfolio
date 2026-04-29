import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme mode types
export type ThemeMode =
  | 'light'
  | 'dark'
  | 'realtime'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter';

// Season type
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// Time period type
export type TimePeriod = 'morning' | 'noon' | 'afternoon' | 'night';

interface AppSettings {
  themeMode: ThemeMode;
  particleEffects: boolean;
}

interface AppState {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // Current theme state (computed)
  currentTheme: ThemeMode;
  currentSeason: Season;
  currentPeriod: TimePeriod;
}

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'realtime',
  particleEffects: true,
};

// Get current season based on month
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter'; // 12, 1, 2
}

// Get time period based on hour
export function getTimePeriod(): TimePeriod {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  return 'night';
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get theme based on settings and time
function getResolvedTheme(themeMode: ThemeMode): ThemeMode {
  switch (themeMode) {
    case 'realtime': {
      const period = getTimePeriod();
      if (period === 'morning') {
        return getCurrentSeason();
      }
      if (period === 'noon') return 'summer'; // Warm noon
      if (period === 'afternoon') return 'light';
      return 'dark'; // night
    }
    case 'spring':
    case 'summer':
    case 'autumn':
    case 'winter':
    case 'light':
    case 'dark':
      return themeMode;
    default:
      return 'realtime';
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
      
      // Initial computed values
      currentTheme: getResolvedTheme(DEFAULT_SETTINGS.themeMode),
      currentSeason: getCurrentSeason(),
      currentPeriod: getTimePeriod(),
    }),
    {
      name: 'portfolio-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

// Update computed values periodically for realtime mode
if (typeof window !== 'undefined') {
  setInterval(() => {
    const state = useAppStore.getState();
    if (state.settings.themeMode === 'realtime') {
      useAppStore.setState({
        currentTheme: getResolvedTheme('realtime'),
        currentSeason: getCurrentSeason(),
        currentPeriod: getTimePeriod(),
      });
    }
  }, 60000); // Check every minute
}
