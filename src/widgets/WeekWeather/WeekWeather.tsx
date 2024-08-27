import { WEATHER_OPTIONS } from '@/shared/constants';
import { useWeatherStore, selectorDailyWeather } from '@/shared/hooks/weather';
import { getWeatherDescription } from '@/shared/utils/getWeatherDescription';
import { DateFormat, formatDate } from '@/shared/utils/time';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

const WeekWeather = () => {
  const { dailyWeather } = useWeatherStore(useShallow(selectorDailyWeather));

  if (!dailyWeather) return null;
  const { daily } = dailyWeather;

  const days = daily.slice(0, 6).map((day) => {
    const weatherDescription = getWeatherDescription(day.weather_code);
    return (
      <div key={day.time} className="flex justify-between items-end bg-blue-50 p-2">
        <div className="flex gap-2">
          <span className="text-2xl w-8">{weatherDescription.icon}</span>
          <div>
            <h3>{formatDate(day.time, DateFormat.FullDayName)}</h3>
            <p className="text-sm text-gray-500">{weatherDescription.description}</p>
          </div>
        </div>

        <span className="text-xs">
          High: {day.temperature_2m_max} Low: {day.temperature_2m_min}
        </span>
      </div>
    );
  });
  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Next {days.length} days</h2>
        <div className="flex flex-col gap-4 justify-between">{days}</div>
      </div>

      <Link href={WEATHER_OPTIONS.DAILY} legacyBehavior>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4">See More</button>
      </Link>
    </div>
  );
};

export default WeekWeather;
