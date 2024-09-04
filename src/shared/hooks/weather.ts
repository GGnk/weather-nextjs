'use client';

import type { WeatherResponseWithCurrent, WeatherResponseWithDaily } from '@/shared/api/weather';
import { fetchWeatherData } from '../api/weather';
import { create } from 'zustand';
import { WEATHER_OPTIONS } from '../constants';
import axios from 'axios';

interface WeatherState {
  currentWeather: WeatherResponseWithCurrent | null;
  dailyWeather: WeatherResponseWithDaily | null;
  descriptionWeather: {
    text: string | null;
    request_time?: string;
  };
  isLoadingCurrent: boolean;
  isLoadingDaily: boolean;
  isLoadingDescription: boolean;
}
interface WeatherActions {
  setLoadingCurrent: (isLoadingCurrent: boolean) => void;
  setLoadingDaily: (isLoadingDaily: boolean) => void;
  setLoadingDescription: (isLoadingDescription: boolean) => void;
  fetchCurrentWeather: (
    coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>,
    isCheckRequestTime?: boolean,
  ) => Promise<void>;
  fetchDailyWeather: (
    coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>,
    isCheckRequestTime?: boolean,
  ) => Promise<void>;
  fetchDescriptionWeather: (
    data: {
      coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
      locationAdress: string;
    },
    isCheckRequestTime?: boolean,
  ) => Promise<void>;
}
type WeatherStore = WeatherState & WeatherActions;

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

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  dailyWeather: null,
  descriptionWeather: {
    text: null,
  },
  isLoadingCurrent: false,
  isLoadingDaily: false,
  isLoadingDescription: false,
  setLoadingDescription: (isLoadingDescription) => set({ isLoadingDescription }),
  setLoadingCurrent: (isLoadingCurrent) => set({ isLoadingCurrent }),
  setLoadingDaily: (isLoadingDaily) => set({ isLoadingDaily }),
  fetchCurrentWeather: async (coords, isCheckRequestTime = true) => {
    const request_time = get().currentWeather?.request_time;
    try {
      set({ isLoadingCurrent: true });
      await executeIfStale(
        request_time,
        async () => {
          const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.CURRENT);
          console.log('[fetchCurrentWeather] result: ', result);
          const data = result as WeatherResponseWithCurrent;
          set({ currentWeather: data });
        },
        isCheckRequestTime,
      );
    } catch (error) {
      console.log('[fetchCurrentWeather] error: ', error);
    } finally {
      set({ isLoadingCurrent: false });
    }
  },
  fetchDailyWeather: async (coords, isCheckRequestTime = true) => {
    const request_time = get().dailyWeather?.request_time;
    try {
      set({ isLoadingDaily: true });
      await executeIfStale(
        request_time,
        async () => {
          const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.DAILY);
          console.log('[fetchDailyWeather] result: ', result);
          const data = result as WeatherResponseWithDaily;
          set({ dailyWeather: data });
        },
        isCheckRequestTime,
      );
    } catch (error) {
      console.log('[fetchDailyWeather] error: ', error);
    } finally {
      set({ isLoadingDaily: false });
    }
  },
  fetchDescriptionWeather: async (data, isCheckRequestTime = true) => {
    const request_time = get().descriptionWeather?.request_time;
    try {
      set({ isLoadingDescription: true });
      await executeIfStale(
        request_time,
        async () => {
          const response = await axios.post('api/weather/description', data);
          console.log('[fetchDescriptionWeather] result: ', response.data);
          set({ descriptionWeather: response.data });
        },
        isCheckRequestTime,
      );
    } catch (error) {
      console.log('[fetchDescriptionWeather] error: ', error);
    } finally {
      set({ isLoadingDescription: false });
    }
  },
}));

export const selectorWeatherFecths = (state: WeatherStore) => ({
  fetchCurrentWeather: state.fetchCurrentWeather,
  fetchDailyWeather: state.fetchDailyWeather,
  fetchDescriptionWeather: state.fetchDescriptionWeather,
});
export const selectorCurrentWeather = (state: WeatherStore) => ({
  currentWeather: state.currentWeather,
  isLoading: state.isLoadingCurrent,
  setLoading: state.setLoadingCurrent,
});
export const selectorDailyWeather = (state: WeatherStore) => ({
  dailyWeather: state.dailyWeather,
  isLoading: state.isLoadingDaily,
  setLoading: state.setLoadingDaily,
});
export const selectorDescriptionWeather = (state: WeatherStore) => ({
  descriptionWeather: state.descriptionWeather,
  isLoadingDescription: state.isLoadingDescription,
  setLoadingDescription: state.setLoadingDescription,
  fetchDescriptionWeather: state.fetchDescriptionWeather,
});
