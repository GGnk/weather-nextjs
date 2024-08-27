'use client';

import type { WeatherResponseWithCurrent, WeatherResponseWithDaily } from '@/shared/api/weather';
import { fetchWeatherData } from '../api/weather';
import { create } from 'zustand';
import { WEATHER_OPTIONS } from '../constants';

interface WeatherState {
  currentWeather: WeatherResponseWithCurrent | null;
  dailyWeather: WeatherResponseWithDaily | null;
  fetchCurrentWeather: (coords: GeolocationCoordinates) => void;
  fetchDailyWeather: (coords: GeolocationCoordinates) => void;
}

const CACHE_DURATION = 1 * 60 * 1000;

const executeIfStale = (request_time: string | undefined, callback: () => void) => {
  if (request_time) {
    const now = new Date();
    const lastRequestTime = new Date(request_time);
    const timeDifference = now.getTime() - lastRequestTime.getTime();

    if (timeDifference < CACHE_DURATION) return;
  }

  callback();
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: null,
  dailyWeather: null,
  fetchCurrentWeather: (coords) => {
    const request_time = get().currentWeather?.request_time;
    executeIfStale(request_time, async () => {
      const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.CURRENT);
      console.log('[fetchCurrentWeather] result: ', result);
      set({ currentWeather: result as WeatherResponseWithCurrent });
    });
  },
  fetchDailyWeather: (coords) => {
    const request_time = get().dailyWeather?.request_time;
    executeIfStale(request_time, async () => {
      const result = await fetchWeatherData(coords.latitude, coords.longitude, WEATHER_OPTIONS.DAILY);
      console.log('[fetchDailyWeather] result: ', result);
      set({ dailyWeather: result as WeatherResponseWithDaily });
    });
  },
}));

export const selectorWeatherFecths = (state: WeatherState) => ({
  fetchCurrentWeather: state.fetchCurrentWeather,
  fetchDailyWeather: state.fetchDailyWeather,
});
export const selectorCurrentWeather = (state: WeatherState) => ({ currentWeather: state.currentWeather });
export const selectorDailyWeather = (state: WeatherState) => ({ dailyWeather: state.dailyWeather });
