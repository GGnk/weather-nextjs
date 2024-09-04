'use client';

import { fetchGeoData, GeoData } from '../api/geo';
import { create } from 'zustand';

export enum LocationStatus {
  Idle = 'idle',
  Requesting = 'requesting',
  Approved = 'approved',
  Denied = 'denied',
}

interface GeoState {
  coords: GeolocationCoordinates | null;
  address: GeoData['address'] | undefined;
  status: LocationStatus;
}
interface GeoActions {
  fetchGeolocation: () => void;
  fetchAddress: (coords: { latitude: number; longitude: number }) => Promise<GeoData['address'] | undefined>;
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
  fetchAddress: async (coords) => {
    try {
      const result = (await fetchGeoData(coords)) as GeoData;
      console.log('[fetchGeoData] result: ', result);
      set({ address: result.address });
      return result.address;
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  },
}));

export const selectorGeo = (state: GeoStore) => ({ coords: state.coords, address: state.address });
export const selectorGeoCoords = (state: GeoStore) => ({ coords: state.coords });
export const selectorGeoAddress = (state: GeoStore) => ({ address: state.address });
export const selectorFetchAddress = (state: GeoStore) => ({ fetchAddress: state.fetchAddress });
