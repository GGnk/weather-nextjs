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
  ipAddress?: string | null;
};
export type GeoResponse = GeoData | GeoData[];

type GeoParams = {
  latitude?: number;
  longitude?: number;
  search?: string;
} & ({ latitude: number; longitude: number } | { search: string });

type FetchRequest = (options?: GeoParams) => Promise<GeoResponse>;
export const fetchGeoData: FetchRequest = async (options) => {
  try {
    const isCoords = !!(options?.latitude && options?.longitude);
    const isGeoRequest = isCoords || !options?.search?.trim();

    const baseUrl = `/api/geocode/${isGeoRequest ? GEO_QUERY_METHODS.REVERCE : GEO_QUERY_METHODS.SEARCH}`;
    const query = new URLSearchParams({
      ...(isGeoRequest
        ? isCoords && {
            lat: options.latitude!.toString(),
            lon: options.longitude!.toString(),
          }
        : {
            q: options?.search || '',
          }),
    });

    return await apiClient.get<GeoResponse>(`${baseUrl}?${query.toString()}`);
  } catch (error) {
    throw error;
  }
};
