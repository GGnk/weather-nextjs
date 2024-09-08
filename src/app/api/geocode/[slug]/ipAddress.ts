import { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';
const localIp = process.env.LOCAL_IP;

export type CoordsViaIp = {
  clientIp: string | null;
  lat: number;
  lon: number;
};

export const getCoordsViaIp = async (request: NextRequest): Promise<CoordsViaIp> => {
  const headersList = request.headers;
  const clientIp =
    (isDev
      ? localIp
      : headersList.get('x-forwarded-for') ||
        headersList.get('x-vercel-forwarded-for') ||
        headersList.get('x-real-ip')) || null;

  const queryParams = new URLSearchParams({
    fields: 'status,message,lat,lon',
  });
  const baseUrl = `http://ip-api.com/json/${clientIp}?${queryParams.toString()}`;

  try {
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error(`[ipAddress] Response status: ${response.status}`);
    }
    const { status, message, lat, lon } = (await response.json()) as {
      status: 'success' | 'fail';
      message?: string;
      lat: number;
      lon: number;
    };

    if (status === 'fail') {
      throw new Error(`[ipAddress] Third party service response: ${message}; Status: ${status}`);
    }

    return { clientIp, lat, lon };
  } catch (error) {
    throw new Error('[ipAddress] Error fetching geo data: ' + (error as Error).message);
  }
};
