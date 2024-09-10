import { NextRequest, NextResponse } from 'next/server';
import { GeoResponse } from '@/shared/api/geo';
import { GEO_QUERY_METHODS } from './types';
import { getReverseUrlWithQuery } from './reverse';
import { getSearchUrlWithQuery } from './search';
import { CoordsViaIp, getCoordsViaIp } from './ipAddress';

const API_KEY = process.env.GEOAPIFY_API_KEY as string;
const API_URL = process.env.GEOAPIFY_API_URL as string;

type ParamType = {
  slug: GEO_QUERY_METHODS;
};

export async function GET(request: NextRequest, { params }: { params: ParamType }) {
  const slug = params.slug;

  try {
    const params = {
      defaultQuery: {
        format: 'json',
        api_key: API_KEY,
        type: 'city',
        lang: 'ru',
      },
      url: API_URL,
      requestUrl: request.url,
    };
    let data: GeoResponse;
    if (slug === GEO_QUERY_METHODS.REVERCE) {
      const { searchParams } = new URL(params.requestUrl);
      const lat = Number(searchParams.get('lat'));
      const lon = Number(searchParams.get('lon'));
      let coords: CoordsViaIp = { ipAddress: null, lat, lon };
      if (!(lat && lon)) {
        coords = await getCoordsViaIp(request);
      }

      data = await getReverseUrlWithQuery({ ...params, coords });
    } else {
      data = await getSearchUrlWithQuery(params);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error GEO API', data: error }, { status: 500 });
  }
}
