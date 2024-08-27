import axios from 'axios';
import { WEATHER_OPTIONS } from '../constants';

interface WeatherResponseBase {
  request_time: string;
  latitude: number;
  longitude: number;
}
export type WeatherResponseWithCurrent = WeatherResponseBase & {
  current: {
    time: string;
    temperature: string;
    humidity: string;
    apparent_temperature: string;
    is_day: number;
    weather_code: number;
    pressure: string;
    wind_speed: string;
  };
  hourly: {
    time: string;
    temperature: string;
    humidity: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: number;
    wind_speed: string;
  }[];
};

export type WeatherResponseWithDaily = WeatherResponseBase & {
  daily: {
    time: string;
    temperature_2m_min: string;
    temperature_2m_max: string;
    weather_code: number;
    wind_speed_10m_max: string;
  }[];
};

export type WeatherResponse = WeatherResponseWithCurrent | WeatherResponseWithDaily;

export const fetchWeatherData = async (latitude: number, longitude: number, slug: WEATHER_OPTIONS) => {
  const baseUrl = `/api/weather/${slug}`;
  const query = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  try {
    const url = `${baseUrl}?${query.toString()}`;
    const response = await axios.get<WeatherResponse>(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during request:', error.message);
      throw new Error('Error fetching weather data');
    } else {
      console.error('Unknown error:', error);
      throw new Error('Unknown error');
    }
  }
};
