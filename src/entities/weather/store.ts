'use client';

import type { WeatherResponseWithCurrent, WeatherResponseWithDaily } from '@/shared/api/weather';
import { create } from 'zustand';
import { createSelectors } from '../createSelectors';
import { devtools, persist } from 'zustand/middleware';

interface WeatherStore {
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

const useWeatherStore = create<WeatherStore>()(
  devtools(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (set) => ({
        currentWeather: null,
        dailyWeather: null,
        descriptionWeather: {
          text: null,
        },
        isLoadingCurrent: false,
        isLoadingDaily: false,
        isLoadingDescription: false,
      }),
      {
        name: 'weather-storage',
        version: 1,
        partialize(state) {
          return {
            currentWeather: state.currentWeather,
            dailyWeather: state.dailyWeather,
            descriptionWeather: state.descriptionWeather,
          };
        },
      },
    ),
    {
      name: 'Weather-Store',
      store: 'WeatherStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

export default createSelectors(useWeatherStore);

export const selectorCurrentWeather = (state: WeatherStore) => ({
  currentWeather: state.currentWeather,
  isLoading: state.isLoadingCurrent,
});
export const selectorDailyWeather = (state: WeatherStore) => ({
  dailyWeather: state.dailyWeather,
  isLoading: state.isLoadingDaily,
});
export const selectorDescriptionWeather = (state: WeatherStore) => ({
  descriptionWeather: state.descriptionWeather,
  isLoadingDescription: state.isLoadingDescription,
});
