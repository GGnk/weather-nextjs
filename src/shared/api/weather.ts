import { WEATHER_OPTIONS } from '../constants';
import { apiClient } from '../utils/apiClient';

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
  try {
    if (!(latitude && longitude) && !slug) {
      throw new Error('No coordinates or slug query provided');
    }

    const baseUrl = `/api/weather/${slug}`;
    const query = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    return await apiClient.get<WeatherResponse>(`${baseUrl}?${query.toString()}`);
  } catch (error) {
    throw error;
  }
};

export const fetchWeatherDescription = async (data: {
  coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
  locationAdress: string;
}) => {
  try {
    return await apiClient.post<{
      text: string | null;
      request_time?: string;
    }>('/api/weather/description', data);
  } catch (error) {
    throw error;
  }
};
