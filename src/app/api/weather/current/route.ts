import { NextResponse } from 'next/server';
import axios from 'axios';
import type { WeatherResponse } from '@/shared/api/weather';
import { roundToNearestInteger } from '@/shared/utils/numbers';
import { IWeatherApiResponse } from './types';
import { ensureUtcOffset } from '@/shared/utils/time';

const API_URL = process.env.WEATHER_API_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams({
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    temperature_unit: 'celsius',
    wind_speed_unit: 'ms',
    precipitation_unit: 'mm',
    timeformat: 'iso8601',
    forecast_days: '1',
    // All timestamps are returned as local-time and data is returned starting at 00:00 local-time
    timezone: 'GMT',
  });

  try {
    const response = await axios.get<IWeatherApiResponse>(`${API_URL}?${query.toString()}`);
    const { current, current_units, hourly, hourly_units } = response.data;
    const currentHour = new Date();

    const result: WeatherResponse = {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
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
      hourly: hourly.time.reduce<WeatherResponse['hourly']>((acc, hour, index) => {
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
    };
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching weather data' }, { status: 500 });
  }
}
