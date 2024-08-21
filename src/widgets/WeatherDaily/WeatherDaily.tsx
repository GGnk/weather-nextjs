'use client';

import { WeatherResponseWithDaily } from '@/shared/api/weather';
import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import { useGeolocation } from '@/shared/hooks/geo';
import { useWeather } from '@/shared/hooks/weather';

const WeatherDaily = () => {
  const { coords } = useGeolocation();
  const weatherData = useWeather(coords, 'daily');

  if (!weatherData) return <p>Loading...</p>;
  const dailyWeather = (weatherData as WeatherResponseWithDaily).daily;
  return (
    <div className="mt-2 mx-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-4">
        {dailyWeather.map((data) => {
          return <WeatherDailyCard key={data.time} {...data} />;
        })}
      </div>
    </div>
  );
};

export default WeatherDaily;
