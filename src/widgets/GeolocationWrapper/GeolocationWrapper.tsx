import { useGeoStore, LocationStatus } from '@/entities/geolocation';
import { useWeatherStore, selectorWeatherFecths } from '@/entities/weather';
import React, { PropsWithChildren, useCallback, useEffect } from 'react';
import { VscWorkspaceUnknown, VscLoading, VscWorkspaceUntrusted } from 'react-icons/vsc';
import { useShallow } from 'zustand/react/shallow';

const GeolocationWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { status, getCurrentGeolocation, fetchAddress, coords, address } = useGeoStore(
    useShallow((state) => ({
      status: state.status,
      getCurrentGeolocation: state.getCurrentGeolocation,
      fetchAddress: state.fetchAddress,
      coords: state.coords,
      address: state.address,
    })),
  );

  const { fetchCurrentWeather, fetchDailyWeather, fetchDescriptionWeather } = useWeatherStore(selectorWeatherFecths);

  const getWeatherData = useCallback(
    async (coords?: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>) => {
      fetchAddress(coords).then(async (geo) => {
        if (!geo) return;

        const currentCoords = {
          latitude: geo.latitude,
          longitude: geo.longitude,
        };

        await fetchDescriptionWeather({
          coords: currentCoords,
          locationAdress: geo.address.display_name,
        });

        await fetchCurrentWeather(currentCoords);
        await fetchDailyWeather(currentCoords);
      });
    },
    [fetchAddress, fetchCurrentWeather, fetchDailyWeather, fetchDescriptionWeather],
  );

  useEffect(() => {
    if (address || status === LocationStatus.Requesting || status === LocationStatus.Denied) return;

    getWeatherData(coords);
  }, [address, coords, getWeatherData, status]);

  const Icon =
    status === LocationStatus.Idle
      ? VscWorkspaceUnknown
      : status === LocationStatus.Requesting
        ? VscLoading
        : VscWorkspaceUntrusted;

  const handleClick = () => {
    getCurrentGeolocation(getWeatherData);
  };
  return (
    <>
      {coords?.ipAddress && status !== LocationStatus.Approved && (
        <div className="w-full mx-auto p-3 bg-start-rgb rounded-md">
          <div className={`flex gap-3 items-center text-bg-end-rgb`}>
            <Icon className={`h-8 w-8 flex-shrink-0 ${status === LocationStatus.Requesting ? 'animate-spin' : ''}`} />
            {status === LocationStatus.Idle && (
              <div>
                <p>Текущая геолокация определена по IP адресу: {coords?.ipAddress}</p>
                <button className="bg-end-rgb text-white p-2 rounded-md" onClick={handleClick}>
                  Запросить мою геолокацию
                </button>
              </div>
            )}
            {status === LocationStatus.Requesting && <p>Запрашиваем разрешение на использование геолокации...</p>}
            {status === LocationStatus.Denied && (
              <div>
                <h2 className="text-lg">Вы отклонили доступ к геолокации.</h2>
                <p>Чтобы использовать эту функцию, включите доступ к геолокации в настройках браузера.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {children}
    </>
  );
};

export default GeolocationWrapper;
