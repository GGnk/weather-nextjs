import { fetchGeoData, GeoData } from '@/shared/api/geo';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSelectors } from '../createSelectors';

export enum LocationStatus {
  Idle = 'idle',
  Requesting = 'requesting',
  Approved = 'approved',
  Denied = 'denied',
}

interface GeoState {
  coords:
    | (Pick<GeolocationCoordinates, 'latitude' | 'longitude'> & {
        clientIp?: string | null;
      })
    | undefined;
  address: GeoData['address'] | undefined;
  status: LocationStatus;
}
interface GeoActions {
  getCurrentGeolocation: () => void;
  fetchAddress: (coords?: { latitude: number; longitude: number }) => Promise<GeoData['address'] | undefined>;
}
type GeoStore = GeoState & GeoActions;

const isDev = process.env.NODE_ENV === 'development';

const useGeoStore = create<GeoStore>()(
  devtools(
    persist(
      (set) => ({
        coords: undefined,
        address: undefined,
        status: LocationStatus.Idle,
        getCurrentGeolocation: () => {
          set({ status: LocationStatus.Requesting });
          navigator.geolocation.getCurrentPosition(
            (geo) => {
              set({
                coords: {
                  latitude: geo.coords.latitude,
                  longitude: geo.coords.longitude,
                },
                status: LocationStatus.Approved,
              });
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

            set({
              address: result.address,
              coords: {
                latitude: result.latitude,
                longitude: result.longitude,
                clientIp: result.clientIp,
              },
            });
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
    {
      name: 'Weather-GeoStore',
      store: 'GeoStore',
      enabled: isDev,
    },
  ),
);
export default createSelectors(useGeoStore);

export const selectorGeo = (state: GeoStore) => ({ coords: state.coords, address: state.address });
