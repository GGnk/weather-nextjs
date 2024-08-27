'use client';

import { selectorGeoCoords, useGeoStore } from '@/shared/hooks/geo';
import { selectorWeatherFecths, useWeatherStore } from '@/shared/hooks/weather';
import { CurrentBlock } from '@/widgets/CurrentBlock';
import { WeekWeather } from '@/widgets/WeekWeather';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function Home() {
  const { coords } = useGeoStore(selectorGeoCoords);
  const { fetchCurrentWeather } = useWeatherStore(useShallow(selectorWeatherFecths));

  useEffect(() => {
    if (!coords) return;
    fetchCurrentWeather(coords);
  }, [coords, fetchCurrentWeather]);

  return (
    <section className="py-3">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col  gap-3 lg:w-2/3">
          <CurrentBlock />
        </div>

        <div className="flex flex-col justify-between bg-white p-6 rounded-lg shadow lg:w-1/3">
          <WeekWeather />
        </div>
      </div>
    </section>
  );
}
