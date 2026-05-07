'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData, WeatherType } from '@/app/api/weather/route';

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// In-memory cache to avoid redundant fetches
let globalCache: { data: WeatherData; timestamp: number } | null = null;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      // Check global cache first
      if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
        setWeather(globalCache.data);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/weather', {
        next: { revalidate: 1800 }, // Cache for 30 minutes on server
      });

      if (!response.ok) {
        throw new Error(`Weather API responded with status: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      
      // Update global cache
      globalCache = {
        data,
        timestamp: Date.now(),
      };

      setWeather(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      // Use cached data if available
      if (globalCache) {
        setWeather(globalCache.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchWeather();

    // Set up interval for periodic refresh (every 30 minutes)
    const intervalId = setInterval(fetchWeather, CACHE_DURATION);

    return () => clearInterval(intervalId);
  }, [fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
}

export type { WeatherData, WeatherType };
export default useWeather;
