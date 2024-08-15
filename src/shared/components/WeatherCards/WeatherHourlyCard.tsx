import { getWeatherDescription } from '@/shared/utils/getWeatherDescription';
import type { FC } from 'react';

interface IProps {
  time: string;
  weather_code: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  wind_speed_10m_max: number;
}

const WeatherHourlyCard: FC<IProps> = (data) => {
  const weatherDescription = getWeatherDescription(data.weather_code);
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col bg-white rounded p-4 w-full max-w-xs">
        <div className="font-bold text-xl">Sydney</div>
        <div className="text-sm text-gray-500">{data.time}</div>
        <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
          <svg
            className="w-32 h-32"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            ></path>
          </svg>
        </div>
        <div className="flex flex-row items-center justify-center mt-6">
          <div className="font-medium text-6xl">24°</div>
          <div className="flex flex-col items-center ml-6">
            <div>Cloudy</div>
            <div className="mt-1">
              <span className="text-sm">
                <i className="far fa-long-arrow-up"></i>
              </span>
              <span className="text-sm font-light text-gray-500">{data.temperature_2m_max}°C</span>
            </div>
            <div>
              <span className="text-sm">
                <i className="far fa-long-arrow-down"></i>
              </span>
              <span className="text-sm font-light text-gray-500">{data.temperature_2m_min}°C</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Wind</div>
            <div className="text-sm text-gray-500">{data.wind_speed_10m_max}k/h</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Humidity</div>
            <div className="text-sm text-gray-500">68%</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-medium text-sm">Visibility</div>
            <div className="text-sm text-gray-500">10km</div>
          </div>
        </div>
        <div className="flex justify-center mt-6">{weatherDescription.description}</div>
      </div>
    </div>
  );
};

export default WeatherHourlyCard;
