'use client';

import axios from 'axios';

export interface GeoResponse {
  latitude: string;
  longitude: string;
  display_name: string;
  address: {
    neighbourhood: string;
    quarter: string;
    suburb: string;
    city: string;
    postcode: string;
    country: string;
    country_code: string;
  };
}

export const fetchGeoData = async (latitude?: number, longitude?: number, search?: string): Promise<GeoResponse> => {
  const baseUrl = '/api/geocode';
  const isGeoCoords = !!(latitude && longitude);

  let query;

  if (isGeoCoords) {
    query = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  } else {
    query = new URLSearchParams({
      q: search || '',
    });
  }

  try {
    const url = `${baseUrl}?${query.toString()}`;
    const response = await axios.get<GeoResponse>(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during request:', error.message);
      throw new Error('Error fetching geo data');
    } else {
      console.error('Unknown error:', error);
      throw new Error('Unknown error');
    }
  }
};
