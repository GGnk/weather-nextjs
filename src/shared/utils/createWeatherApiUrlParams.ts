import type { WeatherApiQueryParameters } from '@/app/api/weather/[slug]/types';

export const createWeatherApiUrlParams = (params: WeatherApiQueryParameters): URLSearchParams => {
  const urlParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key as keyof WeatherApiQueryParameters];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // If the value is an array, join it with commas
        urlParams.append(key, value.join(','));
      } else {
        // Otherwise, just add it as a string
        urlParams.append(key, String(value));
      }
    }
  });

  return urlParams;
};
