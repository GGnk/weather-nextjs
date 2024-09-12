import {
  fetchWeatherData,
  fetchWeatherDescription,
  WeatherResponseWithCurrent,
  WeatherResponseWithDaily,
} from '@/shared/api/weather';
import { WEATHER_OPTIONS } from '@/shared/constants';
import { useGeoStore } from '../geolocation';
import { useWeatherStore } from '.';

const CACHE_DURATION = 1 * 60 * 1000;

const executeIfStale = async (
  request_time: string | undefined,
  callback: () => Promise<void>,
  isCheckRequestTime: boolean,
) => {
  if (isCheckRequestTime && request_time) {
    const now = new Date();
    const lastRequestTime = new Date(request_time);
    const timeDifference = now.getTime() - lastRequestTime.getTime();

    if (timeDifference < CACHE_DURATION) return;
  }

  await callback();
};

export const fetchCurrentWeather = async (
  coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>,
  isCheckRequestTime: boolean = true,
) => {
  const { currentWeather, isLoadingCurrent } = useWeatherStore.getState();
  if (isLoadingCurrent) return;

  let request_time;
  const latitude = currentWeather?.latitude;
  const longitude = currentWeather?.longitude;
  if (coords.latitude === latitude && coords.longitude === longitude) {
    request_time = currentWeather?.request_time;
  }

  try {
    useWeatherStore.setState({ isLoadingCurrent: true });
    await executeIfStale(
      request_time,
      async () => {
        const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.CURRENT);
        console.log('[fetchCurrentWeather] result: ', result);
        const data = result as WeatherResponseWithCurrent;
        useWeatherStore.setState({ currentWeather: data });

        useGeoStore.setState(
          {
            coords: {
              ...useGeoStore.getState().coords,
              latitude: data.latitude,
              longitude: data.longitude,
            },
          },
          false,
        );
      },
      isCheckRequestTime,
    );
  } catch (error) {
    console.log('[fetchCurrentWeather] error: ', error);
  } finally {
    useWeatherStore.setState({ isLoadingCurrent: false });
  }
};

export const fetchDailyWeather = async (
  coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>,
  isCheckRequestTime: boolean = true,
) => {
  const { dailyWeather, isLoadingDaily } = useWeatherStore.getState();
  if (isLoadingDaily) return;

  let request_time;
  const latitude = dailyWeather?.latitude;
  const longitude = dailyWeather?.longitude;
  if (coords.latitude === latitude && coords.longitude === longitude) {
    request_time = dailyWeather?.request_time;
  }

  try {
    useWeatherStore.setState({ isLoadingDaily: true });
    await executeIfStale(
      request_time,
      async () => {
        const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.DAILY);
        console.log('[fetchDailyWeather] result: ', result);
        const data = result as WeatherResponseWithDaily;
        useWeatherStore.setState({ dailyWeather: data });

        useGeoStore.setState(
          {
            coords: {
              ...useGeoStore.getState().coords,
              latitude: data.latitude,
              longitude: data.longitude,
            },
          },
          false,
        );
      },
      isCheckRequestTime,
    );
  } catch (error) {
    console.log('[fetchDailyWeather] error: ', error);
  } finally {
    useWeatherStore.setState({ isLoadingDaily: false });
  }
};

export const fetchDescriptionWeather = async (
  data: {
    coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
    locationAdress: string;
  },
  isCheckRequestTime: boolean = true,
) => {
  const { descriptionWeather, isLoadingDescription } = useWeatherStore.getState();
  if (isLoadingDescription) return;

  const request_time = descriptionWeather?.request_time;
  try {
    useWeatherStore.setState({ isLoadingDescription: true });
    await executeIfStale(
      request_time,
      async () => {
        const result = await fetchWeatherDescription(data);
        console.log('[fetchDescriptionWeather] result: ', result);
        useWeatherStore.setState({ descriptionWeather: result });
      },
      isCheckRequestTime,
    );
  } catch (error) {
    console.log('[fetchDescriptionWeather] error: ', error);
  } finally {
    useWeatherStore.setState({ isLoadingDescription: false });
  }
};
