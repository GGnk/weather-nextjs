'use client';

import { fetchGeoData, GeoResponse } from '../api/geo';
import { create } from 'zustand';

export enum LocationStatus {
  Idle = 'idle',
  Requesting = 'requesting',
  Approved = 'approved',
  Denied = 'denied',
}

interface GeoState {
  coords: GeolocationCoordinates | null;
  address: GeoResponse['address'] | undefined;
  status: LocationStatus;
}
interface GeoActions {
  fetchGeolocation: () => void;
  fetchAddress: (latitude: number, longitude: number) => Promise<void>;
}
type GeoStore = GeoState & GeoActions;

export const useGeoStore = create<GeoStore>((set) => ({
  coords: null,
  address: undefined,
  status: LocationStatus.Idle,
  fetchGeolocation: () => {
    set({ status: LocationStatus.Requesting });
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        set({ coords: geo.coords, status: LocationStatus.Approved });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          set({ status: LocationStatus.Denied });
        }
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

export const selectorGeo = (state: GeoStore) => ({ coords: state.coords, address: state.address });
export const selectorGeoCoords = (state: GeoStore) => ({ coords: state.coords });
export const selectorGeoAddress = (state: GeoStore) => ({ address: state.address });
