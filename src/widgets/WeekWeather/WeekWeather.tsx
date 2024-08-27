import { TiWeatherPartlySunny } from 'react-icons/ti';

const WeekWeather = () => {
  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Next 5 days</h2>
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex justify-between items-center bg-blue-50 p-2">
            <div className="flex gap-2 items-end">
              <TiWeatherPartlySunny className="h-12 w-12" />
              <div>
                <h3>Monday</h3>
                <p className="text-sm text-gray-500">Cloudy. High: 11° Low: 18°</p>
              </div>
            </div>

            <span className="text-lg">7°</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-2">
            <div className="flex gap-2 items-end">
              <TiWeatherPartlySunny className="h-12 w-12" />
              <div>
                <h3>Thuesday</h3>
                <p className="text-sm text-gray-500">Cloudy. High: 11° Low: 18°</p>
              </div>
            </div>

            <span className="text-lg">7°</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-2">
            <div className="flex gap-2 items-end">
              <TiWeatherPartlySunny className="h-12 w-12" />
              <div>
                <h3>Wensday</h3>
                <p className="text-sm text-gray-500">Cloudy. High: 11° Low: 18°</p>
              </div>
            </div>

            <span className="text-lg">7°</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-2">
            <div className="flex gap-2 items-end">
              <TiWeatherPartlySunny className="h-12 w-12" />
              <div>
                <h3>Thursday</h3>
                <p className="text-sm text-gray-500">Cloudy. High: 11° Low: 18°</p>
              </div>
            </div>

            <span className="text-lg">7°</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-2">
            <div className="flex gap-2 items-end">
              <TiWeatherPartlySunny className="h-12 w-12" />
              <div>
                <h3>Friday</h3>
                <p className="text-sm text-gray-500">Cloudy. High: 11° Low: 18°</p>
              </div>
            </div>

            <span className="text-lg">7°</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4">See More</button>
    </div>
  );
};

export default WeekWeather;
