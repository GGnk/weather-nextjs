export interface WeatherApiQueryParameters {
  /** Latitude in WGS84 coordinates. Required. */
  latitude: number;

  /** Longitude in WGS84 coordinates. Required. */
  longitude: number;

  /** Elevation in meters, or set to "nan" to disable downscaling. Optional. */
  elevation?: number;

  /** List of weather variables for hourly data. Optional. */
  hourly?: string[];

  /** List of daily weather variables. Optional. */
  daily?: string[];

  /** List of weather variables for current conditions. Optional. */
  current?: string[];

  /** Temperature unit. Optional. */
  temperature_unit?: 'celsius' | 'fahrenheit';

  /** Wind speed unit. Optional. */
  wind_speed_unit?: 'kmh' | 'ms' | 'mph' | 'kn';

  /** Precipitation unit. Optional. */
  precipitation_unit?: 'mm' | 'inch';

  /** Time format. Optional. */
  timeformat?: 'iso8601' | 'unixtime';

  /** Timezone, can be "GMT", "auto", or any valid timezone string. Optional. */
  timezone?: string;

  /** Number of past days to include (0-92). Optional. */
  past_days?: number;

  /** Number of forecast days to include (0-16). Optional. */
  forecast_days?: number;

  /** Number of forecast hours to include. Optional. */
  forecast_hours?: number;

  /** Start date (yyyy-mm-dd). Optional. */
  start_date?: string;

  /** End date (yyyy-mm-dd). Optional. */
  end_date?: string;

  /** Start hour (yyyy-mm-ddThh:mm). Optional. */
  start_hour?: string;

  /** End hour (yyyy-mm-ddThh:mm). Optional. */
  end_hour?: string;

  /** Start time for 15-minutely data (yyyy-mm-ddThh:mm). Optional. */
  start_minutely_15?: string;

  /** End time for 15-minutely data (yyyy-mm-ddThh:mm). Optional. */
  end_minutely_15?: string;

  /** List of weather models to use. Optional. */
  models?: string[];

  /** Grid-cell selection preference. Optional. */
  cell_selection?: 'land' | 'sea' | 'nearest';

  /** API key for commercial use. Optional. */
  apikey?: string;
}

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
