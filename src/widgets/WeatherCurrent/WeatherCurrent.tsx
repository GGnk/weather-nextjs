'use client';

import { useEffect, useState } from 'react';
import { WeatherCurrentCard } from '@/shared/components/WeatherCards';
import { fetchWeatherCurrentData, WeatherResponse } from '@/shared/api/weather';
import { fetchGeoData, GeoResponse } from '@/shared/api/geo';
import { WeatherHourlyCarousel } from '@/shared/components/WeatherHourlyCarousel';

const WeatherCurrent = () => {
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
    <div className="flex flex-col gap-4 mx-5">
      <WeatherCurrentCard {...weatherData.current} address={address} />
      <div className="w-full justify-between">
        <WeatherHourlyCarousel listHourly={weatherData.hourly} />
      </div>
    </div>
  );
};

export default WeatherCurrent;
