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
        ipAddress?: string | null;
      })
    | undefined;
  address: GeoData['address'] | undefined;
  status: LocationStatus;
}
interface GeoActions {
  getCurrentGeolocation: (calback?: (coords: GeolocationCoordinates) => void) => void;
  fetchAddress: (coords?: { latitude: number; longitude: number }) => Promise<GeoData | undefined>;
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
        getCurrentGeolocation: (callback) => {
          if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
              if (result.state === 'granted' || result.state === 'prompt') {
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

                    callback?.(geo.coords);
                  },
                  (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                      set({ status: LocationStatus.Denied });
                    }
                    console.error(error);
                  },
                );
              } else if (result.state === 'denied') {
                useGeoStore.setState({ status: LocationStatus.Denied });
              }
            });
          } else {
            useGeoStore.setState({ status: LocationStatus.Denied });
          }
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
                ipAddress: result.ipAddress,
              },
            });
            return result;
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
