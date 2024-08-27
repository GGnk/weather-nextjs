import type { WeatherResponseWithCurrent } from '@/shared/api/weather';
import type { FC } from 'react';

interface IProps {
  currentData: WeatherResponseWithCurrent['current'];
}

const CurrentHighlightsBlock: FC<IProps> = ({ currentData }) => {
  return (
    <div className="bg-white p-6 rounded-b-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Today&apos;s Highlights</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p>Feel Like</p>
          <span className="text-3xl">{currentData.apparent_temperature}</span>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p>Pressure</p>
          <span className="text-3xl">{currentData.pressure}</span>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p>Wind speed</p>
          <span className="text-3xl">{currentData.wind_speed}</span>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p>Humidity</p>
          <span className="text-3xl">{currentData.humidity}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentHighlightsBlock;
