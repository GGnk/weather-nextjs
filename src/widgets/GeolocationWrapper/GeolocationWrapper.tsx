import { useGeoStore, LocationStatus } from '@/entities/geolocation';
import React, { PropsWithChildren, useEffect } from 'react';
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

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          getCurrentGeolocation();
        } else if (result.state === 'denied') {
          useGeoStore.setState({ status: LocationStatus.Denied });
        }
      });
    }
  }, [getCurrentGeolocation]);

  useEffect(() => {
    if (address || status === LocationStatus.Requesting) return;

    if (status === LocationStatus.Denied) {
      fetchAddress(coords);
      return;
    }

    fetchAddress();
  }, [address, coords, fetchAddress, status]);

  const Icon =
    status === LocationStatus.Idle
      ? VscWorkspaceUnknown
      : status === LocationStatus.Requesting
        ? VscLoading
        : VscWorkspaceUntrusted;

  const isShowGeoRequest =
    status === LocationStatus.Idle || status === LocationStatus.Requesting || status === LocationStatus.Denied;
  return (
    <>
      {isShowGeoRequest && (
        <div className="w-full mx-auto p-3 bg-start-rgb rounded-md">
          <div className={`flex gap-3 items-center text-bg-end-rgb`}>
            <Icon className={`h-8 w-8 flex-shrink-0 ${status === LocationStatus.Requesting ? 'animate-spin' : ''}`} />
            {coords?.clientIp && status === LocationStatus.Idle && (
              <div>
                <p>Текущая геолокация определена по вашему IP адресу: {coords?.clientIp}</p>
                <button className="bg-end-rgb text-white p-2 rounded-md" onClick={getCurrentGeolocation}>
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
