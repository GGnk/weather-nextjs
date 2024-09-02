'use client';

import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import { useGeoStore, selectorGeo } from '@/shared/hooks/geo';
import { selectorDailyWeather, selectorWeatherFecths, useWeatherStore } from '@/shared/hooks/weather';
import { useEffect } from 'react';

import { useShallow } from 'zustand/react/shallow';

const WeatherDaily = () => {
  const { coords, address } = useGeoStore(useShallow(selectorGeo));
  const { dailyWeather } = useWeatherStore(useShallow(selectorDailyWeather));
  const { fetchDailyWeather } = useWeatherStore(useShallow(selectorWeatherFecths));

  useEffect(() => {
    if (!coords) return;
    if (address) return;

    fetchDailyWeather(coords);
  }, [address, coords, fetchDailyWeather]);

  if (!dailyWeather) return <p>Loading...</p>;

  return (
    <div className="mt-2 mx-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-4">
        {dailyWeather.daily.map((data) => {
          return <WeatherDailyCard key={data.time} {...data} />;
        })}
      </div>
    </div>
  );
};

export default WeatherDaily;
