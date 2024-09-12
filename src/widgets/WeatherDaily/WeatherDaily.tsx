'use client';

import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import { selectorGeo, useGeoStore } from '@/entities/geolocation';
import { fetchDailyWeather, selectorDailyWeather, useWeatherStore } from '@/entities/weather';
import { useEffect } from 'react';

const WeatherDaily = () => {
  const { coords, address } = useGeoStore(selectorGeo);
  const { dailyWeather } = useWeatherStore(selectorDailyWeather);

  useEffect(() => {
    if (!(coords && address)) return;

    fetchDailyWeather(coords);
  }, [address, coords]);

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
