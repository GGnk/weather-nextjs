import { NextResponse } from 'next/server';
import { GeoResponse } from '@/shared/api/geo';
import { GEO_QUERY_METHODS, IGeoAPIResponse } from './types';

const API_KEY = process.env.GEOAPIFY_API_KEY as string;
const API_URL = process.env.GEOAPIFY_API_URL as string;

type ParamType = {
  slug: GEO_QUERY_METHODS;
};
const defaultQuery = {
  format: 'json',
  api_key: API_KEY,
};
const getReverseUrlWithQuery = ({ lat, lon }: { lat: string; lon: string }) => {
  const queryParams = new URLSearchParams({
    ...defaultQuery,
    lat,
    lon,
    type: 'street',
    lang: 'ru',
    limit: '1',
  });
  const baseUrl = `${API_URL}/${GEO_QUERY_METHODS.REVERCE}`;

  return `${baseUrl}?${queryParams.toString()}`;
};

const getSearchUrlWithQuery = (query: string) => {
  const queryParams = new URLSearchParams({
    ...defaultQuery,
    text: query,
    lang: 'ru',
    limit: '3',
  });
  const baseUrl = `${API_URL}/${GEO_QUERY_METHODS.SEARCH}`;

  return `${baseUrl}?${queryParams.toString()}`;
};

export async function GET(request: Request, { params }: { params: ParamType }) {
  const slug = params.slug;
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const search = searchParams.get('q');

  if (!(lat && lon) && !search) {
    throw NextResponse.json({ error: 'Unable to obtain location data', data: null }, { status: 400 });
  }

  const isGeoCoords = slug === 'reverse' && lat && lon;

  let url: string = '';
  if (isGeoCoords) url = getReverseUrlWithQuery({ lat, lon });
  else if (search) url = getSearchUrlWithQuery(search);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const { results } = (await response.json()) as IGeoAPIResponse;
    let data: GeoResponse;

    if (isGeoCoords) {
      data = {
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
    } else {
      data = results.map((item) => ({
        latitude: item.lat,
        longitude: item.lon,
        address: {
          display_name: `${!!item.quarter ? item.quarter + ', ' : ''}${item.city}, ${item.country}`,
          city: item.city,
          country: item.country,
          quarter: item.quarter,
          suburb: item.suburb,
        },
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching geo data', data: error }, { status: 500 });
  }
}
