import { GeoResponse } from '@/shared/api/geo';
import { WeatherResponseWithCurrent } from '@/shared/api/weather';
import { getWeatherDescription } from '@/shared/utils/getWeatherDescription';
import { DateFormat, formatDate } from '@/shared/utils/time';
import { FC } from 'react';

interface IProps
  extends Pick<
    WeatherResponseWithCurrent['current'],
    'time' | 'temperature' | 'humidity' | 'apparent_temperature' | 'is_day' | 'weather_code' | 'pressure' | 'wind_speed'
  > {
  address?: GeoResponse['address'];
}
const WeatherCurrentCard: FC<IProps> = (props) => {
  const weatherDesc = getWeatherDescription(props.weather_code);
  const textCity = `Погода в ${props.address?.city}, ${props.address?.country}`;
  const isCityEnable = !!props.address?.city;

  return (
    <div className="min-w-80 max-w-lg mx-auto bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <div>
          {isCityEnable ? (
            <h2 className="text-xl font-bold">{textCity}</h2>
          ) : (
            <div className="h-8 bg-slate-300 animate-pulse rounded"></div>
          )}

          <p className="text-gray-600">Сейчас {formatDate(props.time, DateFormat.HourMinute)}.</p>
        </div>
        <span className="text-7xl">{weatherDesc.icon}</span>
      </div>
      <div className="flex items-center mt-4">
        <span className="text-5xl font-bold text-yellow-500">{props.temperature}</span>
        <div className="ml-4">
          <p className="text-xl">{weatherDesc.description}</p>
          <p className="text-gray-600">Ощущается как {props.apparent_temperature}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm">💨</span>
          <span className="text-gray-600">{props.wind_speed}</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm">💧</span>
          <span className="text-gray-600">{props.humidity}</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm">🕐</span>
          <span className="text-gray-600">{props.pressure}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCurrentCard;
