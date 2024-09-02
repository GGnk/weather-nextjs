import { GeoResponse } from '@/shared/api/geo';
import { GEO_QUERY_METHODS, IGeoAPIResponse } from './types';

interface IReverseParams {
  defaultQuery: Record<string, string>;
  url: string;
  requestUrl: string;
}
export const getReverseUrlWithQuery = async ({ defaultQuery, url, requestUrl }: IReverseParams) => {
  const { searchParams } = new URL(requestUrl);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  if (!(lat && lon))
    throw new Error('[Reverse] Unable to get location data without all coordinates (latitude and longitude)');

  const queryParams = new URLSearchParams({
    ...defaultQuery,
    lat,
    lon,
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
    };

    return data;
  } catch (error) {
    throw new Error('[Reverse] Error fetching geo data: ' + (error as Error).message);
  }
};
