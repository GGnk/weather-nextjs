import { GeoResponse } from '@/shared/api/geo';
import { GEO_QUERY_METHODS, IGeoAPIResponse } from './types';

interface IReverseParams {
  defaultQuery: Record<string, string>;
  url: string;
  requestUrl: string;
}
export const getSearchUrlWithQuery = async ({ defaultQuery, url, requestUrl }: IReverseParams) => {
  const { searchParams } = new URL(requestUrl);
  const search = searchParams.get('q');

  if (!search?.trim()) throw new Error('[Search] Unable to get location data without search data (empty request)');

  const queryParams = new URLSearchParams({
    ...defaultQuery,
    text: search,
    limit: '3',
  });
  const baseUrl = `${url}/${GEO_QUERY_METHODS.SEARCH}?${queryParams.toString()}`;

  try {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error(`[Search] Response status: ${response.status}`);
    }
    const { results } = (await response.json()) as IGeoAPIResponse;
    const data: GeoResponse = results.map((item) => ({
      latitude: item.lat,
      longitude: item.lon,
      address: {
        display_name: item.formatted,
        city: item.city,
        country: item.country,
        quarter: item.quarter,
        suburb: item.suburb,
      },
    }));

    return data;
  } catch (error) {
    throw new Error('[Search] Error fetching geo data: ' + (error as Error).message);
  }
};
