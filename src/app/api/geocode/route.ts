import { NextResponse } from 'next/server';
import axios from 'axios';
import { GeoResponse } from '@/shared/api/geo';

interface IGeoApiResponse {
  place_id: 187967159;
  licence: string;
  osm_type: string;
  osm_id: 59134844;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    neighbourhood: string;
    quarter: string;
    suburb: string;
    city: string;
    'ISO3166-2-lvl4': string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: string[];
}
const API_KEY = process.env.GEO_API_KEY as string;
const API_URL = process.env.GEO_API_URL as string;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get('latitude') || '';
  const lon = searchParams.get('longitude') || '';
  const isGeoCoords = !!(lat && lon);

  let query;
  let baseUrl;

  if (isGeoCoords) {
    query = new URLSearchParams({
      lat,
      lon,
      api_key: API_KEY,
    });

    baseUrl = `${API_URL}/reverse`;
  } else {
    query = new URLSearchParams({
      q: searchParams.get('q') || '',
      api_key: API_KEY,
    });

    baseUrl = `${API_URL}/search`;
  }

  const url = `${baseUrl}?${query.toString()}`;
  try {
    const response = await axios.get<IGeoApiResponse>(url);
    const result: GeoResponse = {
      latitude: response.data.lat,
      longitude: response.data.lon,
      display_name: response.data.display_name,
      address: response.data.address,
    };
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching weather data' }, { status: 500 });
  }
}
