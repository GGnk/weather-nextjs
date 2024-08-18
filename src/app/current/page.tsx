'use client';

import { useEffect, useState } from 'react';
import { WeatherCurrentCard } from '@/shared/components/WeatherCards';
import { fetchWeatherCurrentData, WeatherResponse } from '@/shared/api/weather';
import { fetchGeoData, GeoResponse } from '@/shared/api/geo';

export default function Current() {
  const [coords, setСoords] = useState<GeolocationCoordinates | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
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
    if (weatherData || !coords) return;

    fetchWeatherCurrentData(coords.latitude, coords.longitude).then((result) => {
      console.log('[fetchWeatherCurrentData] result: ', result);
      setWeatherData(result);
    });
  }, [coords, weatherData]);

  useEffect(() => {
    if (address || !coords) return;
    fetchGeoData(coords.latitude, coords.longitude).then((result) => {
      console.log('[fetchGeoData] result: ', result);
      setAddress(result.address);
    });
  }, [coords, address]);

  if (!weatherData) return <p>Loading...</p>;
  return (
    <main className="flex min-h-screen flex-col">
      <WeatherCurrentCard {...weatherData.current} address={address} />
    </main>
  );
}
