import { WeatherDailyCard } from '@/shared/components/WeatherCards';
import weatherData from './__mock__.json';
import { combineWeatherData } from '@/shared/utils/combineWeatherData';

const WeatherForecast = () => {
  const dailyWeather = combineWeatherData(weatherData.daily);
  return (
    <div className="mt-2 mx-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-4">
        {dailyWeather.map((data) => {
          return <WeatherDailyCard key={data.time} {...data} />;
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
