import axios from 'axios';

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature: string;
    humidity: string;
    apparent_temperature: string;
    is_day: number;
    weather_code: number;
    pressure: string;
    wind_speed: string;
  };
  hourly: {
    time: string;
    temperature: string;
    humidity: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: number;
    wind_speed: string;
  }[];
}

export const fetchWeatherCurrentData = async (latitude: number, longitude: number): Promise<WeatherResponse> => {
  const baseUrl = '/api/weather/current';
  const query = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  try {
    const url = `${baseUrl}?${query.toString()}`;
    const response = await axios.get<WeatherResponse>(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during request:', error.message);
      throw new Error('Error fetching weather data');
    } else {
      console.error('Unknown error:', error);
      throw new Error('Unknown error');
    }
  }
};
