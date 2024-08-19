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
};

export interface IWeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Omit<UnitsType, 'precipitation'>;
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
  hourly_units: Omit<UnitsType, 'interval' | 'is_day' | 'pressure_msl'>;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}
