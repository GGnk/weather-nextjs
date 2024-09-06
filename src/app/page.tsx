'use client';

import { WeatherDescription } from '@/features/WeatherDescription';
import { useGeoStore } from '@/entities/geolocation';
import { selectorWeatherFecths, useWeatherStore } from '@/entities/weather';
import { SkeletonCurrentBlock } from '@/widgets/CurrentBlock';

import { GeolocationWrapper } from '@/widgets/GeolocationWrapper';
import { SkeletonWeekWeather } from '@/widgets/WeekWeather';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const CurrentBlock = dynamic(() => import('@/widgets/CurrentBlock').then((item) => item.CurrentBlock), {
  loading: SkeletonCurrentBlock,
});
const WeekWeather = dynamic(() => import('@/widgets/WeekWeather').then((item) => item.WeekWeather), {
  loading: SkeletonWeekWeather,
});

export default function Home() {
  const coords = useGeoStore.use.coords();
  const { fetchCurrentWeather, fetchDailyWeather } = useWeatherStore(selectorWeatherFecths);

  useEffect(() => {
    if (!coords) return;

    const fetchData = async () => {
      await Promise.all([fetchCurrentWeather(coords), fetchDailyWeather(coords)]);
    };
    fetchData();
  }, [coords, fetchCurrentWeather, fetchDailyWeather]);

  return (
    <GeolocationWrapper>
      <section className="py-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col gap-3 lg:w-2/3">
            <CurrentBlock />
          </div>

          <div className="lg:w-1/3 flex flex-col gap-3">
            <WeatherDescription />
            <WeekWeather />
          </div>
        </div>
      </section>
    </GeolocationWrapper>
  );
}
