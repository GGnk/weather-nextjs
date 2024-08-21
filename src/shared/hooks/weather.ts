'use client';

import { useEffect, useState } from 'react';
import { fetchWeatherData, WeatherResponse } from '../api/weather';
import { WEATHER_OPTIONS } from '../constants';

export const useWeather = (coords: GeolocationCoordinates | null, slug?: WEATHER_OPTIONS) => {
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
