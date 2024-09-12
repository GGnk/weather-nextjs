import { Typewriter } from '@/shared/components/Typewriter';
import { useWeatherStore, selectorDescriptionWeather } from '@/entities/weather';
import { useShallow } from 'zustand/react/shallow';
import SkeletonDescriptionWeather from './SkeletonWeekWeather';

const WeatherDescription = () => {
  const { descriptionWeather, isLoadingDescription } = useWeatherStore(useShallow(selectorDescriptionWeather));

  if (isLoadingDescription) return <SkeletonDescriptionWeather />;
  if (!descriptionWeather.text) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow ">
      <div>
        <h2 className="text-lg font-semibold mb-4">Weather Description</h2>
      </div>
      <Typewriter text={descriptionWeather.text} speed={15} />
    </div>
  );
};

export default WeatherDescription;
