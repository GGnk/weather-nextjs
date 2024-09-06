import { fetchGeoData, GeoData } from '@/shared/api/geo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSelectors } from '../createSelectors';

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
  getCurrentGeolocation: () => void;
  fetchAddress: (coords: { latitude: number; longitude: number }) => Promise<GeoData['address'] | undefined>;
}
type GeoStore = GeoState & GeoActions;

const useGeoStore = create<GeoStore>()(
  persist(
    (set) => ({
      coords: null,
      address: undefined,
      status: LocationStatus.Idle,
      getCurrentGeolocation: () => {
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
);
export default createSelectors(useGeoStore);

export const selectorGeo = (state: GeoStore) => ({ coords: state.coords, address: state.address });
