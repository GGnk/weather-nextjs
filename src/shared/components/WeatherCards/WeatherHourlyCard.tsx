import { getWeatherDescription } from '@/shared/utils/getWeatherDescription';
import { DateFormat } from '@/shared/utils/time';
import { formatDate, isSameDay } from 'date-fns';

import type { FC } from 'react';

interface IProps {
  time: string;
  temperature: string;
  humidity: string;
  apparent_temperature: string;
  precipitation: string;
  weather_code: number;
  wind_speed: string;
}

const WeatherHourlyCard: FC<IProps> = (props) => {
  const weatherDescription = getWeatherDescription(props.weather_code);
  const date = formatDate(props.time, DateFormat.DayMonth);
  const day = formatDate(props.time, DateFormat.HourMinute);
  return (
    <div className="flex-shrink-0 p-4 bg-white rounded-lg shadow-md w-44 text-center">
      {!isSameDay(new Date(), new Date(props.time)) && <div className="text-gray-500 text-sm font-bold">{date}</div>}
      <div className="text-gray-500 text-lg font-bold">{day}</div>
      <div className="my-2 flex justify-center items-center">
        <div className="text-yellow-500 text-4xl">{weatherDescription.icon}</div>
      </div>
      <div className="text-gray-800 text-xl">
        <span className="font-bold">{props.temperature}</span>
      </div>
      <div className="text-gray-500">
        <span className="font-bold">{props.apparent_temperature}</span>
        <div>apparent temp </div>
      </div>
      <div className="text-gray-400 mt-2">{weatherDescription.description}</div>
    </div>
  );
};

export default WeatherHourlyCard;
