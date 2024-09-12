import { GeoData } from '@/shared/api/geo';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSelectors } from '../createSelectors';
import { requestCurrentGeolocation } from '@/shared/utils/requestCurrentGeolocation';

export enum LocationStatus {
  Idle = 'idle',
  Promt = 'promt',
  Requesting = 'requesting',
  Approved = 'approved',
  Denied = 'denied',
}

interface GeoState {
  coords:
    | (Pick<GeolocationCoordinates, 'latitude' | 'longitude'> & {
        ipAddress?: string | null;
      })
    | undefined;
  address: GeoData['address'] | undefined;
  status: LocationStatus;
}
interface GeoActions {
  requestAndSetGeolocation: () => Promise<GeolocationCoordinates>;
}
type GeoStore = GeoState & GeoActions;

const useGeoStore = create<GeoStore>()(
  devtools(
    persist(
      (set) => ({
        coords: undefined,
        address: undefined,
        status: LocationStatus.Idle,
        requestAndSetGeolocation: async () => {
          try {
            set({ status: LocationStatus.Requesting });
            const coords = await requestCurrentGeolocation();
            set({ status: LocationStatus.Approved });
            return coords;
          } catch (error) {
            set({ status: LocationStatus.Denied });
            throw error;
          }
        },
      }),
      {
        name: 'geo-storage',
        version: 1,
        partialize(state) {
          return {
            coords: state.coords,
            address: state.address,
          };
        },
      },
    ),
    {
      name: 'Weather-GeoStore',
      store: 'GeoStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);
export default createSelectors(useGeoStore);

export const selectorGeo = (state: GeoStore) => ({ coords: state.coords, address: state.address });
