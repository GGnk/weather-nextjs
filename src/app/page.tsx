'use client';

import { WeatherDescription } from '@/features/WeatherDescription';
import { selectorGeo, useGeoStore } from '@/entities/geolocation';
import { fetchCurrentWeather, fetchDailyWeather, fetchDescriptionWeather } from '@/entities/weather';
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
  const { coords, address } = useGeoStore(selectorGeo);

  useEffect(() => {
    if (!(coords && address)) return;

    const fetchData = async () => {
      await Promise.all([
        fetchCurrentWeather(coords),
        fetchDailyWeather(coords),
        fetchDescriptionWeather({
          coords,
          locationAdress: address.display_name,
        }),
      ]);
    };
    fetchData();
  }, [address, coords]);

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
