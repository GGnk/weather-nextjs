import { getWeatherDescription } from '@/shared/utils/getWeatherDescription';
import { format } from 'date-fns/format';
import type { FC } from 'react';

interface IProps {
  time: string;
  weather_code: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  wind_speed_10m_max: number;
}

const WeatherDailyCard: FC<IProps> = (data) => {
  const weatherDescription = getWeatherDescription(data.weather_code);
  const dateTime = format(new Date(data.time), 'dd MMMM yyyy');
  const day = format(new Date(data.time), 'EEEE');
  return (
    <div className="flex items-center justify-center min-w-60 max-w-64">
      <div className="flex flex-col bg-white rounded p-4 w-full max-w-xs">
        <div className="font-bold text-xl">{day}</div>
        <div className="text-sm text-gray-500">{dateTime}</div>
        <div className="mt-4 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
          {weatherDescription.icon}
        </div>
        <div className="flex flex-row items-center justify-center mt-2">
          <div className="flex flex-col items-center">
            <div className="flex justify-center text-center">{weatherDescription.description}</div>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-4 items-center">
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Wind</div>
            <div className="text-sm text-gray-500">{data.wind_speed_10m_max}k/h</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Min Temp</div>
            <div className="text-sm text-gray-500">{data.temperature_2m_min}°C</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Max Temp</div>
            <div className="text-sm text-gray-500">{data.temperature_2m_max}°C</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDailyCard;
