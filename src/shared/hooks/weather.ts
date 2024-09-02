'use client';

import type { WeatherResponseWithCurrent, WeatherResponseWithDaily } from '@/shared/api/weather';
import { fetchWeatherData } from '../api/weather';
import { create } from 'zustand';
import { WEATHER_OPTIONS } from '../constants';

interface WeatherState {
  currentWeather: WeatherResponseWithCurrent | null;
  dailyWeather: WeatherResponseWithDaily | null;
  isLoadingCurrent: boolean;
  isLoadingDaily: boolean;
}
interface WeatherActions {
  setLoadingCurrent: (isLoadingCurrent: boolean) => void;
  setLoadingDaily: (isLoadingDaily: boolean) => void;
  fetchCurrentWeather: (coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>) => Promise<void>;
  fetchDailyWeather: (coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>) => Promise<void>;
}
type WeatherStore = WeatherState & WeatherActions;

const CACHE_DURATION = 1 * 60 * 1000;

const executeIfStale = async (request_time: string | undefined, callback: () => Promise<void>) => {
  if (request_time) {
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
  isLoadingCurrent: false,
  isLoadingDaily: false,
  setLoadingCurrent: (isLoadingCurrent: boolean) => set({ isLoadingCurrent }),
  setLoadingDaily: (isLoadingDaily: boolean) => set({ isLoadingDaily }),
  fetchCurrentWeather: async (coords) => {
    const request_time = get().currentWeather?.request_time;
    try {
      set({ isLoadingCurrent: true });
      await executeIfStale(request_time, async () => {
        const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.CURRENT);
        console.log('[fetchCurrentWeather] result: ', result);
        const data = result as WeatherResponseWithCurrent;
        set({ currentWeather: data });
      });
    } catch (error) {
      console.log('[fetchCurrentWeather] error: ', error);
    } finally {
      set({ isLoadingCurrent: false });
    }
  },
  fetchDailyWeather: async (coords) => {
    const request_time = get().dailyWeather?.request_time;
    try {
      set({ isLoadingDaily: true });
      await executeIfStale(request_time, async () => {
        const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.DAILY);
        console.log('[fetchDailyWeather] result: ', result);
        const data = result as WeatherResponseWithDaily;
        set({ dailyWeather: data });
      });
    } catch (error) {
      console.log('[fetchDailyWeather] error: ', error);
    } finally {
      set({ isLoadingDaily: false });
    }
  },
}));

export const selectorWeatherFecths = (state: WeatherStore) => ({
  fetchCurrentWeather: state.fetchCurrentWeather,
  fetchDailyWeather: state.fetchDailyWeather,
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
