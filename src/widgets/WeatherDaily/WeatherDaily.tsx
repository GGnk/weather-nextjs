'use client';

import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import { useGeoStore } from '@/entities/geolocation';
import { selectorDailyWeather, selectorWeatherFecths, useWeatherStore } from '@/entities/weather';
import { useEffect } from 'react';

const WeatherDaily = () => {
  const coords = useGeoStore.use.coords();
  const { dailyWeather } = useWeatherStore(selectorDailyWeather);
  const { fetchDailyWeather } = useWeatherStore(selectorWeatherFecths);

  useEffect(() => {
    if (!coords) return;

    fetchDailyWeather(coords);
  }, [coords, fetchDailyWeather]);

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
