'use client';

import { selectorGeoAddress, useGeoStore } from '@/shared/hooks/geo';
import { selectorCurrentWeather, useWeatherStore } from '@/shared/hooks/weather';
import CurrentHighlightsBlock from './CurrentHighlightsBlock';
import CurrentHourlyBlock from './CurrentHourlyBlock';
import { useShallow } from 'zustand/react/shallow';

const CurrentBlock = () => {
  const { address } = useGeoStore(selectorGeoAddress);
  const { currentWeather } = useWeatherStore(useShallow(selectorCurrentWeather));

  if (!currentWeather) return <p>Loading...</p>;
  return (
    <>
      <CurrentHourlyBlock weatherData={currentWeather} addressData={address} />
      <CurrentHighlightsBlock currentData={currentWeather.current} />
    </>
  );
};

export default CurrentBlock;
