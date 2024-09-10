import { GeoResponse } from '@/shared/api/geo';
import { GEO_QUERY_METHODS, IGeoAPIResponse } from './types';
import { CoordsViaIp } from './ipAddress';

interface IReverseParams {
  defaultQuery: Record<string, string>;
  url: string;
  coords: CoordsViaIp;
}
export const getReverseUrlWithQuery = async ({ defaultQuery, url, coords }: IReverseParams) => {
  const queryParams = new URLSearchParams({
    ...defaultQuery,
    lat: `${coords.lat}`,
    lon: `${coords.lon}`,
    limit: '1',
  });
  const baseUrl = `${url}/${GEO_QUERY_METHODS.REVERCE}?${queryParams.toString()}`;

  try {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error(`[Reverse] Response status: ${response.status}`);
    }
    const { results } = (await response.json()) as IGeoAPIResponse;
    const data: GeoResponse = {
      latitude: results[0].lat,
      longitude: results[0].lon,
      address: {
        display_name: `${!!results[0].quarter ? results[0].quarter + ', ' : ''}${results[0].city}, ${results[0].country}`,
        city: results[0].city,
        country: results[0].country,
        quarter: results[0].quarter,
        suburb: results[0].suburb,
      },
      ipAddress: coords.ipAddress,
    };

    return data;
  } catch (error) {
    throw new Error('[Reverse] Error fetching geo data: ' + (error as Error).message);
  }
};
