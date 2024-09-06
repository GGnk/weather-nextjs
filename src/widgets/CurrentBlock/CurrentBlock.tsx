'use client';

import { useGeoStore } from '@/entities/geolocation';
import { selectorCurrentWeather, useWeatherStore } from '@/entities/weather';
import CurrentHighlightsBlock from './CurrentHighlightsBlock';
import CurrentHourlyBlock from './CurrentHourlyBlock';
import { useShallow } from 'zustand/react/shallow';
import SkeletonCurrentBlock from './SkeletonCurrentBlock';

const CurrentBlock = () => {
  const address = useGeoStore.use.address();
  const { currentWeather, isLoading } = useWeatherStore(useShallow(selectorCurrentWeather));

  if (isLoading) return <SkeletonCurrentBlock />;
  if (!currentWeather) return null;

  return (
    <>
      <CurrentHourlyBlock weatherData={currentWeather} addressData={address} />
      <CurrentHighlightsBlock currentData={currentWeather.current} />
    </>
  );
};

export default CurrentBlock;
