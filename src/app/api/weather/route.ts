import { NextResponse } from 'next/server';

// Weather type definition
export type WeatherType = 'sunny' | 'cloudy' | 'overcast' | 'rainy' | 'thunderstorm' | 'snowy';

export interface WeatherData {
  weatherType: WeatherType;
  isWindy: boolean;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  updatedAt: number;
}

// Weather code mappings
const SUNNY_CODES = [113];
const CLOUDY_CODES = [116, 119, 122];
const OVERCAST_CODES = [143, 248, 260];
const RAINY_CODES = [176, 263, 266, 293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359, 362, 365, 368, 374, 377];
const THUNDERSTORM_CODES = [179, 182, 185, 200, 227, 230, 386, 389, 392, 395];
const SNOWY_CODES = [227, 230, 320, 323, 326, 329, 332, 335, 338, 350, 371, 377];

// Map weather type to Chinese description
const WEATHER_DESCRIPTIONS: Record<WeatherType, string> = {
  sunny: '晴天',
  cloudy: '多云',
  overcast: '阴天',
  rainy: '下雨',
  thunderstorm: '打雷下雨',
  snowy: '下雪',
};

// Map weather type to emoji
const WEATHER_ICONS: Record<WeatherType, string> = {
  sunny: '☀️',
  cloudy: '⛅',
  overcast: '☁️',
  rainy: '🌧️',
  thunderstorm: '⛈️',
  snowy: '❄️',
};

// Map weather code to weather type
function getWeatherType(code: number, temp: number): WeatherType {
  if (SUNNY_CODES.includes(code)) return 'sunny';
  if (CLOUDY_CODES.includes(code)) return 'cloudy';
  if (OVERCAST_CODES.includes(code)) return 'overcast';
  if (THUNDERSTORM_CODES.includes(code)) return 'thunderstorm';
  if (SNOWY_CODES.includes(code) && temp < 5) return 'snowy';
  if (RAINY_CODES.includes(code)) return 'rainy';
  return 'cloudy'; // Default fallback
}

// WTTR.in API response type
interface WttrResponse {
  current_condition: Array<{
    temp_C: string;
    FeelsLikeC: string;
    weatherCode: string;
    windspeedKmph: string;
    humidity: string;
    cloudcover: string;
    precipMM: string;
    weatherDesc: Array<{ value: string }>;
  }>;
}

// Cache for weather data
let weatherCache: { data: WeatherData; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  try {
    // Check cache first
    if (weatherCache && Date.now() - weatherCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(weatherCache.data, {
        headers: {
          'Cache-Control': 'public, max-age=1800',
        },
      });
    }

    // Fetch weather from wttr.in
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(
      'https://wttr.in/Wuhan?format=j1&lang=zh',
      {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data: WttrResponse = await response.json();
    const current = data.current_condition?.[0];

    if (!current) {
      throw new Error('Invalid weather data from API');
    }

    const weatherCode = parseInt(current.weatherCode, 10);
    const temp = parseInt(current.temp_C, 10);
    const windspeedKmph = parseInt(current.windspeedKmph, 10);
    const humidity = parseInt(current.humidity, 10);

    // Determine weather type
    let weatherType = getWeatherType(weatherCode, temp);

    // Check for snow conditions (rainy code but low temp and precipitation)
    if (weatherType === 'rainy' && temp < 3) {
      weatherType = 'snowy';
    }

    // Determine if it's windy (wind speed > 30 km/h)
    const isWindy = windspeedKmph > 30;

    const weatherData: WeatherData = {
      weatherType,
      isWindy,
      temp,
      feelsLike: parseInt(current.FeelsLikeC, 10),
      humidity,
      windSpeed: windspeedKmph,
      description: WEATHER_DESCRIPTIONS[weatherType],
      icon: WEATHER_ICONS[weatherType],
      updatedAt: Date.now(),
    };

    // Update cache
    weatherCache = {
      data: weatherData,
      timestamp: Date.now(),
    };

    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': 'public, max-age=1800',
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);

    // Return cached data if available, even if stale
    if (weatherCache) {
      return NextResponse.json(weatherCache.data, {
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'X-Weather-Stale': 'true',
        },
      });
    }

    // Return default weather data as fallback
    const fallbackData: WeatherData = {
      weatherType: 'cloudy',
      isWindy: false,
      temp: 20,
      feelsLike: 20,
      humidity: 60,
      windSpeed: 15,
      description: '多云',
      icon: '⛅',
      updatedAt: Date.now(),
    };

    return NextResponse.json(fallbackData);
  }
}
