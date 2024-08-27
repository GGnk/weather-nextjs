'use client';

import { useEffect } from 'react';
import { fetchGeoData, GeoResponse } from '../api/geo';
import { create } from 'zustand';

interface GeoContextType {
  coords: GeolocationCoordinates | null;
  address: GeoResponse['address'] | undefined;
  fetchGeolocation: () => void;
  fetchAddress: (latitude: number, longitude: number) => void;
}

export const useGeoStore = create<GeoContextType>((set) => ({
  coords: null,
  address: undefined,
  fetchGeolocation: () => {
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        set({ coords: geo.coords });
      },
      (error) => {
        console.error(error);
      },
    );
  },
  fetchAddress: async (latitude, longitude) => {
    try {
      const result = await fetchGeoData(latitude, longitude);
      console.log('[fetchGeoData] result: ', result);
      set({ address: result.address });
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  },
}));

export const selectorGeo = (state: GeoContextType) => ({ coords: state.coords, address: state.address });
export const selectorGeoCoords = (state: GeoContextType) => ({ coords: state.coords });
export const selectorGeoAddress = (state: GeoContextType) => ({ address: state.address });

export const useStartGeolocation = () => {
  const { coords, address, fetchGeolocation, fetchAddress } = useGeoStore();

  useEffect(() => {
    if (!coords) {
      fetchGeolocation();
    }
  }, [coords, fetchGeolocation]);

  useEffect(() => {
    if (coords && !address) {
      fetchAddress(coords.latitude, coords.longitude);
    }
  }, [coords, address, fetchAddress]);
};
