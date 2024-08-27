'use client';

import { WeatherCurrentCard } from '@/shared/components/WeatherCards';
import { WeatherHourlyCarousel } from '@/shared/components/WeatherHourlyCarousel';
import { selectorGeo, useGeoStore } from '@/shared/hooks/geo';
import { useWeatherStore, selectorWeatherFecths, selectorCurrentWeather } from '@/shared/hooks/weather';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const WeatherCurrent = () => {
  const { coords, address } = useGeoStore(selectorGeo);
  const { fetchCurrentWeather } = useWeatherStore(useShallow(selectorWeatherFecths));
  const { currentWeather } = useWeatherStore(useShallow(selectorCurrentWeather));

  useEffect(() => {
    if (!coords) return;
    fetchCurrentWeather(coords);
  }, [coords, fetchCurrentWeather]);

  if (!currentWeather) return <p>Loading...</p>;
  const { current, hourly } = currentWeather;

  return (
    <div className="flex flex-col gap-4 mx-5">
      <WeatherCurrentCard {...current} address={address} />
      <WeatherHourlyCarousel listHourly={hourly} />
    </div>
  );
};

export default WeatherCurrent;
