import { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';
const localIp = process.env.LOCAL_IP;

const isIP = (ip: string | null): boolean => {
  if (!ip) return false;
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

const getServerIPAddress = async () => {
  const response = await fetch('https://api.ipify.org/?format=json');
  const data = (await response.json()) as { ip: string };
  return data.ip;
};

export const getIpAddress = async (request: NextRequest) => {
  const headersList = request.headers;
  const clientIp =
    (isDev
      ? localIp
      : headersList.get('x-forwarded-for') ||
        headersList.get('x-vercel-forwarded-for') ||
        headersList.get('x-real-ip')) || null;

  if (isIP(clientIp)) return clientIp!;

  return await getServerIPAddress();
};

export type CoordsViaIp = {
  ipAddress: string | null;
  lat: number;
  lon: number;
};

export const getCoordsViaIp = async (request: NextRequest): Promise<CoordsViaIp> => {
  const ipAddress = await getIpAddress(request);

  const queryParams = new URLSearchParams({
    fields: 'status,message,lat,lon',
  });
  const baseUrl = `http://ip-api.com/json/${ipAddress}?${queryParams.toString()}`;

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

    return { ipAddress, lat, lon };
  } catch (error) {
    throw new Error('[ipAddress] Error fetching geo data: ' + (error as Error).message);
  }
};
