import { GEO_QUERY_METHODS } from '@/app/api/geocode/[slug]/types';
import { apiClient } from '../utils/apiClient';

export type GeoData = {
  latitude: number;
  longitude: number;
  address: {
    display_name: string;
    quarter: string;
    suburb: string;
    city: string;
    country: string;
  };
};
export type GeoResponse = GeoData | GeoData[];

type GeoParams = {
  latitude?: number;
  longitude?: number;
  search?: string;
} & ({ latitude: number; longitude: number } | { search: string });

type FetchRequest = ({ latitude, longitude, search }: GeoParams) => Promise<GeoResponse>;
export const fetchGeoData: FetchRequest = async ({ latitude, longitude, search }) => {
  try {
    if (!(latitude && longitude) && !search?.trim()) {
      throw new Error('No coordinates or search query provided');
    }

    const isGeoCoords = !!(latitude && longitude);
    const baseUrl = `/api/geocode/${isGeoCoords ? GEO_QUERY_METHODS.REVERCE : GEO_QUERY_METHODS.SEARCH}`;
    const query = new URLSearchParams({
      ...(isGeoCoords
        ? {
            lat: latitude.toString(),
            lon: longitude.toString(),
          }
        : {
            q: search || '',
          }),
    });

    return await apiClient.get<GeoResponse>(`${baseUrl}?${query.toString()}`);
  } catch (error) {
    throw error;
  }
};
