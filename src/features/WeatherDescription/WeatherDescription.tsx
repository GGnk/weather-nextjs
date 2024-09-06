import { Typewriter } from '@/shared/components/Typewriter';
import { useGeoStore, selectorGeo } from '@/entities/geolocation';
import { useWeatherStore, selectorDescriptionWeather } from '@/entities/weather';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import SkeletonDescriptionWeather from './SkeletonWeekWeather';

const WeatherDescription = () => {
  const { coords, address } = useGeoStore(selectorGeo);
  const { descriptionWeather, fetchDescriptionWeather, isLoadingDescription } = useWeatherStore(
    useShallow(selectorDescriptionWeather),
  );

  useEffect(() => {
    if (!(coords && address?.display_name)) return;

    fetchDescriptionWeather({
      coords,
      locationAdress: address?.display_name,
    });
  }, [address?.display_name, coords, descriptionWeather, fetchDescriptionWeather]);

  if (isLoadingDescription) return <SkeletonDescriptionWeather />;
  if (!descriptionWeather.text) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow ">
      <div>
        <h2 className="text-lg font-semibold mb-4">Weather Description</h2>
      </div>
      <Typewriter text={descriptionWeather.text} />
    </div>
  );
};

export default WeatherDescription;
