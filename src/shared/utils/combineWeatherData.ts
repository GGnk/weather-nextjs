type WeatherData = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  wind_speed_10m_max: number[];
};

type WeatherDay = {
  time: string;
  weather_code: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  wind_speed_10m_max: number;
};

export const combineWeatherData = (data: WeatherData): WeatherDay[] => {
  const { time, weather_code, temperature_2m_max, temperature_2m_min, wind_speed_10m_max } = data;

  if (
    time.length !== weather_code.length ||
    time.length !== temperature_2m_max.length ||
    time.length !== temperature_2m_min.length ||
    time.length !== wind_speed_10m_max.length
  ) {
    throw new Error('[combineWeatherData] All arrays must have the same length');
  }

  return time.map((t, index) => ({
    time: t,
    weather_code: weather_code[index],
    temperature_2m_max: temperature_2m_max[index],
    temperature_2m_min: temperature_2m_min[index],
    wind_speed_10m_max: wind_speed_10m_max[index],
  }));
};
