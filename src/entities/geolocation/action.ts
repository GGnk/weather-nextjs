import { fetchGeoData, GeoData } from '@/shared/api/geo';
import { useGeoStore } from '.';

export const updateGeoAddress = async (coords?: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>) => {
  try {
    const result = (await fetchGeoData(coords)) as GeoData;
    console.log('[fetchGeoData] result: ', result);

    useGeoStore.setState({
      address: result.address,
      coords: {
        latitude: result.latitude,
        longitude: result.longitude,
        ipAddress: result.ipAddress,
      },
    });
  } catch (error) {
    console.error('Error fetching address:', error);
  }
};

export const requestAndUpdateGeoAddress = async () => {
  const requestAndSetGeolocation = useGeoStore.getState().requestAndSetGeolocation;
  try {
    const currentCoords = await requestAndSetGeolocation();
    await updateGeoAddress(currentCoords);
  } catch (error) {
    console.error('Error getting geolocation:', error);
  }
};

export const initializeLocation = async () => {
  const { coords, address } = useGeoStore.getState();
  if (coords && address) return;

  await updateGeoAddress();
  await requestAndUpdateGeoAddress();
};
