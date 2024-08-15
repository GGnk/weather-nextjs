import type { FC } from 'react';

const WeatherCurrentCard: FC = () => {
  return (
    <div className="min-w-96 max-w-lg mx-auto bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Погода в Тбилиси</h2>
          <p className="text-gray-600">Сейчас 14:06. Вчера в это время +31°</p>
        </div>
        <span className="text-7xl">🌞</span>
      </div>
      <div className="flex items-center mt-4">
        <span className="text-5xl font-bold text-yellow-500">+30°</span>
        <div className="ml-4">
          <p className="text-xl">Ясно</p>
          <p className="text-gray-600">Ощущается как +25°</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm">💨</span>
          <span className="text-gray-600">11,0 м/с, С</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm">💧</span>
          <span className="text-gray-600">35%</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm">🕐</span>
          <span className="text-gray-600">720 мм рт. ст.</span>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        {[
          { time: '14:00', temp: '+30°' },
          { time: '15:00', temp: '+31°' },
          { time: '16:00', temp: '+31°' },
          { time: '17:00', temp: '+30°' },
          { time: '18:00', temp: '+29°' },
          { time: '19:00', temp: '+28°' },
          { time: '20:00', temp: '+26°' },
          { time: '20:01', temp: 'Закат' },
        ].map((hour, index) => (
          <div key={index} className="text-center">
            <p className="text-gray-600">{hour.time}</p>
            <p className="font-bold">{hour.temp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCurrentCard;
