'use client';

import { selectorGeoCoords, useGeoStore } from '@/shared/hooks/geo';
import { selectorWeatherFecths, useWeatherStore } from '@/shared/hooks/weather';
import { SkeletonCurrentBlock } from '@/widgets/CurrentBlock';

import { GeolocationWrapper } from '@/widgets/GeolocationWrapper';
import { SkeletonWeekWeather } from '@/widgets/WeekWeather';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const CurrentBlock = dynamic(() => import('@/widgets/CurrentBlock').then((item) => item.CurrentBlock), {
  loading: SkeletonCurrentBlock,
});
const WeekWeather = dynamic(() => import('@/widgets/WeekWeather').then((item) => item.WeekWeather), {
  loading: SkeletonWeekWeather,
});

export default function Home() {
  const { coords } = useGeoStore(useShallow(selectorGeoCoords));
  const { fetchCurrentWeather, fetchDailyWeather } = useWeatherStore(useShallow(selectorWeatherFecths));

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

          <div className="lg:w-1/3">
            <WeekWeather />
          </div>
        </div>
      </section>
    </GeolocationWrapper>
  );
}
