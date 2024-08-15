import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import weatherData from './__mock__.json';
import { combineWeatherData } from '@/shared/utils/combineWeatherData';

const WeatherForecast = () => {
  const dailyWeather = combineWeatherData(weatherData.daily);
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center gap-1">
        {dailyWeather.map((data) => {
          return <WeatherDailyCard key={data.time} {...data} />;
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
