'use client';
import { WeatherResponseWithCurrent } from '@/shared/api/weather';
import { WeatherCurrentCard } from '@/shared/components/WeatherCards';

import { WeatherHourlyCarousel } from '@/shared/components/WeatherHourlyCarousel';
import { useGeolocation } from '@/shared/hooks/geo';
import { useWeather } from '@/shared/hooks/weather';

const WeatherCurrent = () => {
  const { coords, address } = useGeolocation();
  const weatherData = useWeather(coords);

  if (!weatherData) return <p>Loading...</p>;
  const { current, hourly } = weatherData as WeatherResponseWithCurrent;
  return (
    <div className="flex flex-col gap-4 mx-5">
      <WeatherCurrentCard {...current} address={address} />
      <div className="w-full justify-between">
        <WeatherHourlyCarousel listHourly={hourly} />
      </div>
    </div>
  );
};

export default WeatherCurrent;
