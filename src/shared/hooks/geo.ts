'use client';

import { useState, useEffect } from 'react';
import { fetchGeoData, GeoResponse } from '../api/geo';

export const useGeolocation = () => {
  const [coords, setСoords] = useState<GeolocationCoordinates | null>(null);
  const [address, setAddress] = useState<GeoResponse['address'] | undefined>();

  useEffect(() => {
    if (coords) return;

    navigator.geolocation.getCurrentPosition(
      (geo) => {
        setСoords(geo.coords);
      },
      (error) => {
        console.error(error);
      },
    );
  }, [coords]);

  useEffect(() => {
    if (address || !coords) return;
    fetchGeoData(coords.latitude, coords.longitude).then((result) => {
      console.log('[fetchGeoData] result: ', result);
      setAddress(result.address);
    });
  }, [coords, address]);

  return { coords, address };
};
