import { NextResponse } from 'next/server';
import axios from 'axios';
import type { WeatherResponse } from '@/shared/api/weather';

interface IWeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    is_day: '';
    weather_code: string;
    pressure_msl: string;
    wind_speed_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: 1 | 2;
    weather_code: number;
    pressure_msl: number;
    wind_speed_10m: number;
  };
}
const API_URL = process.env.WEATHER_API_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams({
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m',
    temperature_unit: 'celsius',
    wind_speed_unit: 'ms',
    precipitation_unit: 'mm',
    timeformat: 'iso8601',
  });

  try {
    const response = await axios.get<IWeatherApiResponse>(`${API_URL}?${query.toString()}`);
    const { current, current_units } = response.data;
    const result: WeatherResponse = {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      current: {
        time: current.time,
        temperature: `${current.temperature_2m} ${current_units.temperature_2m}`,
        humidity: `${current.relative_humidity_2m} ${current_units.relative_humidity_2m}`,
        apparent_temperature: `${current.apparent_temperature} ${current_units.apparent_temperature}`,
        is_day: current.is_day,
        weather_code: current.weather_code,
        pressure: `${current.pressure_msl} ${current_units.pressure_msl}`,
        wind_speed: `${current.wind_speed_10m} ${current_units.wind_speed_10m}`,
      },
    };
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching weather data' }, { status: 500 });
  }
}
