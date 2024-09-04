import { NextResponse } from 'next/server';
import axios from 'axios';
import { createWeatherApiUrlParams } from '@/shared/utils/createWeatherApiUrlParams';
import { WeatherApiQueryParameters } from '../[slug]/types';
import { generateAIWeatherContent } from './generateAIWeatherContent';

const API_URL = process.env.WEATHER_API_URL as string;

export async function POST(request: Request) {
  const {
    coords: { latitude, longitude },
    locationAdress,
  } = await request.json();

  try {
    if (!(latitude && longitude && locationAdress))
      throw new Error(
        '[Weather] Unable to get location data without all coordinates (latitude, longitude and locationAdress)',
      );

    const requestParams: WeatherApiQueryParameters = {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ],
      temperature_unit: 'celsius',
      wind_speed_unit: 'ms',
      precipitation_unit: 'mm',
      timeformat: 'iso8601',
      // All timestamps are returned as local-time and data is returned starting at 00:00 local-time
      timezone: 'GMT',
    };
    const query = createWeatherApiUrlParams(requestParams);

    const weatherData = await axios.get(`${API_URL}?${query.toString()}`);

    if (!(weatherData.status >= 200 && weatherData.status < 300)) {
      throw new Error(`Response status: ${weatherData.status}`);
    }

    const result = await generateAIWeatherContent(JSON.stringify(weatherData.data), { locationAdress });
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text, request_time: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching ai weather content', data: (error as Error).message },
      { status: 500 },
    );
  }
}
