'use client';

import { selectorGeoAddress, useGeoStore } from '@/shared/hooks/geo';
import { selectorCurrentWeather, useWeatherStore } from '@/shared/hooks/weather';
import CurrentHighlightsBlock from './CurrentHighlightsBlock';
import CurrentHourlyBlock from './CurrentHourlyBlock';
import { useShallow } from 'zustand/react/shallow';
import SkeletonCurrentBlock from './SkeletonCurrentBlock';

const CurrentBlock = () => {
  const { address } = useGeoStore(useShallow(selectorGeoAddress));
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
