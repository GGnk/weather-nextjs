export enum GEO_QUERY_METHODS {
  REVERCE = 'reverse',
  SEARCH = 'search',
}

export interface IGeoAPIResponse {
  results: Result[];
  query: Query;
}

export interface Query {
  lat: number;
  lon: number;
  plus_code: string;
}

export interface Result {
  datasource: Datasource;
  name: string;
  country: string;
  country_code: string;
  city: string;
  postcode: string;
  suburb: string;
  quarter: string;
  street: string;
  lon: number;
  lat: number;
  distance: number;
  result_type: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  timezone: Timezone;
  plus_code: string;
  rank: Rank;
  place_id: string;
  bbox: Bbox;
}

export interface Bbox {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
}

export interface Datasource {
  sourcename: string;
  attribution: string;
  license: string;
  url: string;
}

export interface Rank {
  importance: number;
  popularity: number;
}

export interface Timezone {
  name: string;
  offset_STD: string;
  offset_STD_seconds: number;
  offset_DST: string;
  offset_DST_seconds: number;
}
