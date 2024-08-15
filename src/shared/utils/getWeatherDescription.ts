import { WEATHER_DESCRIPTIONS, WeatherGroup } from '../constants';

export const getWeatherDescription = (weatherCode: number): WeatherGroup => {
  return WEATHER_DESCRIPTIONS[weatherCode] || 'Unknown weather code';
};
