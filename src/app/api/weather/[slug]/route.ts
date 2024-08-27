import { NextResponse } from 'next/server';
import type { WeatherResponseWithCurrent, WeatherResponseWithDaily } from '@/shared/api/weather';
import { roundToNearestInteger } from '@/shared/utils/numbers';
import type { WeatherApiResponse, WeatherApiResponseWithCurrent, WeatherApiResponseWithDaily } from './types';
import { ensureUtcOffset } from '@/shared/utils/time';
import { WEATHER_OPTIONS } from '@/shared/constants';

type Params = {
  slug: WEATHER_OPTIONS;
};

const API_URL = process.env.WEATHER_API_URL;

export async function GET(request: Request, context: { params: Params }) {
  const slug = context.params.slug;

  const { searchParams } = new URL(request.url);
  const isDailyWeather = slug === WEATHER_OPTIONS.DAILY;

  const dailyQueryParams = {
    daily: 'temperature_2m_min,temperature_2m_max,weather_code,wind_speed_10m_max',
    forecast_days: '14',
  };

  const currentQueryParams = {
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    forecast_hours: '12',
  };
  const query = new URLSearchParams({
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    ...(isDailyWeather ? dailyQueryParams : currentQueryParams),
    temperature_unit: 'celsius',
    wind_speed_unit: 'ms',
    precipitation_unit: 'mm',
    timeformat: 'iso8601',
    // All timestamps are returned as local-time and data is returned starting at 00:00 local-time
    timezone: 'GMT',
  });

  try {
    const response = await fetch(`${API_URL}?${query.toString()}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = (await response.json()) as WeatherApiResponse;
    const currentHour = new Date();
    let result = {
      request_time: new Date().toISOString(),
      latitude: data.latitude,
      longitude: data.longitude,
    };

    if (isDailyWeather) {
      const { daily, daily_units } = data as WeatherApiResponseWithDaily;

      result = {
        ...result,
        daily: daily.time.reduce<WeatherResponseWithDaily['daily']>((acc, day, index) => {
          const timeUTC = ensureUtcOffset(day);

          return [
            ...acc,
            {
              time: timeUTC,
              temperature_2m_min: `${roundToNearestInteger(daily.temperature_2m_min[index])} ${daily_units.temperature_2m_min}`,
              temperature_2m_max: `${roundToNearestInteger(daily.temperature_2m_max[index])} ${daily_units.temperature_2m_max}`,
              weather_code: daily.weather_code[index],
              wind_speed_10m_max: `${daily.wind_speed_10m_max[index]} ${daily_units.wind_speed_10m_max}`,
            },
          ];
        }, []),
      } as WeatherResponseWithDaily;
    } else {
      const { current, current_units, hourly, hourly_units } = data as WeatherApiResponseWithCurrent;

      result = {
        ...result,
        current: {
          time: ensureUtcOffset(current.time),
          temperature: `${roundToNearestInteger(current.temperature_2m)} ${current_units.temperature_2m}`,
          humidity: `${current.relative_humidity_2m} ${current_units.relative_humidity_2m}`,
          apparent_temperature: `${roundToNearestInteger(current.apparent_temperature)} ${current_units.apparent_temperature}`,
          is_day: current.is_day,
          weather_code: current.weather_code,
          pressure: `${current.pressure_msl} ${current_units.pressure_msl}`,
          wind_speed: `${current.wind_speed_10m} ${current_units.wind_speed_10m}`,
        },
        hourly: hourly.time.reduce<WeatherResponseWithCurrent['hourly']>((acc, hour, index) => {
          const timeUTC = ensureUtcOffset(hour);
          const hourDate = new Date(timeUTC);
          if (hourDate < currentHour) return acc;

          return [
            ...acc,
            {
              time: timeUTC,
              temperature: `${roundToNearestInteger(hourly.temperature_2m[index])} ${hourly_units.temperature_2m}`,
              humidity: `${hourly.relative_humidity_2m[index]} ${hourly_units.relative_humidity_2m}`,
              apparent_temperature: `${roundToNearestInteger(hourly.apparent_temperature[index])} ${hourly_units.apparent_temperature}`,
              precipitation: `${hourly.precipitation[index]} ${hourly_units.precipitation}`,
              weather_code: hourly.weather_code[index],
              wind_speed: `${hourly.wind_speed_10m[index]} ${hourly_units.wind_speed_10m}`,
            },
          ];
        }, []),
      } as WeatherResponseWithCurrent;
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching weather data', data: error }, { status: 500 });
  }
}
