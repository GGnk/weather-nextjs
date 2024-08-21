type UnitsType = {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: 1 | 2;
  weather_code: string;
  pressure_msl: string;
  wind_speed_10m: string;
  precipitation: string;

  temperature_2m_min: string;
  temperature_2m_max: string;
  wind_speed_10m_max: string;
};

interface IWeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
}

export type WeatherApiResponseWithCurrent = IWeatherApiResponse & {
  current_units: Pick<
    UnitsType,
    | 'time'
    | 'interval'
    | 'temperature_2m'
    | 'relative_humidity_2m'
    | 'apparent_temperature'
    | 'is_day'
    | 'weather_code'
    | 'pressure_msl'
    | 'wind_speed_10m'
  >;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: 1 | 2;
    weather_code: number;
    pressure_msl: number;
    wind_speed_10m: number;
  };
  hourly_units: Pick<
    UnitsType,
    | 'time'
    | 'temperature_2m'
    | 'relative_humidity_2m'
    | 'apparent_temperature'
    | 'precipitation'
    | 'weather_code'
    | 'wind_speed_10m'
  >;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
};

export type WeatherApiResponseWithDaily = IWeatherApiResponse & {
  daily_units: Pick<
    UnitsType,
    'time' | 'temperature_2m_min' | 'temperature_2m_max' | 'weather_code' | 'wind_speed_10m_max'
  >;
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
    wind_speed_10m_max: number[];
  };
};

export type WeatherApiResponse = WeatherApiResponseWithCurrent | WeatherApiResponseWithDaily;
