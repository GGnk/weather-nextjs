'use client';

import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import { selectorGeo, useGeoStore } from '@/entities/geolocation';
import { selectorDailyWeather, selectorWeatherFecths, useWeatherStore } from '@/entities/weather';
import { useEffect } from 'react';

const WeatherDaily = () => {
  const { coords, address } = useGeoStore(selectorGeo);
  const { dailyWeather } = useWeatherStore(selectorDailyWeather);
  const { fetchDailyWeather } = useWeatherStore(selectorWeatherFecths);

  useEffect(() => {
    if (!(coords && address)) return;

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
