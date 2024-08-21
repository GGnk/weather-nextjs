'use client';

import { useEffect, useState } from 'react';
import { fetchWeatherData, WeatherResponse } from '../api/weather';

export const useWeather = (coords: GeolocationCoordinates | null, slug?: Parameters<typeof fetchWeatherData>[2]) => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    if (weatherData || !coords) return;

    fetchWeatherData(coords.latitude, coords.longitude, slug).then((result) => {
      console.log('[fetchWeatherCurrentData] result: ', result);
      setWeatherData(result);
    });
  }, [coords, slug, weatherData]);

  return weatherData;
};
