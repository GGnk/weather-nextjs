import { useGeoStore, LocationStatus } from '@/shared/hooks/geo';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { VscWorkspaceUnknown, VscLoading, VscWorkspaceUntrusted } from 'react-icons/vsc';
import { useShallow } from 'zustand/react/shallow';

const GeolocationWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { status, fetchGeolocation, fetchAddress, coords } = useGeoStore(
    useShallow((state) => ({
      status: state.status,
      fetchGeolocation: state.fetchGeolocation,
      fetchAddress: state.fetchAddress,
      coords: state.coords,
    })),
  );
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    if (coords) {
      setCheckingPermission(false);
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          fetchGeolocation();
        } else if (result.state === 'denied') {
          useGeoStore.setState({ status: LocationStatus.Denied });
        }
        setCheckingPermission(false);
      });
    } else {
      setCheckingPermission(false);
    }
  }, [coords, fetchGeolocation]);

  useEffect(() => {
    if (coords) {
      fetchAddress(coords.latitude, coords.longitude);
      return;
    }
  }, [coords, fetchAddress]);

  if (checkingPermission || status === LocationStatus.Approved || coords) {
    return children;
  }

  const Icon =
    status === LocationStatus.Idle
      ? VscWorkspaceUnknown
      : status === LocationStatus.Requesting
        ? VscLoading
        : VscWorkspaceUntrusted;

  return (
    <div className="md:w-4/5 lg:w-1/3 mx-auto p-3 bg-start-rgb rounded-md">
      <div className={`flex gap-3 items-center text-bg-end-rgb`}>
        <Icon className={`h-8 w-8 flex-shrink-0 ${status === LocationStatus.Requesting ? 'animate-spin' : ''}`} />
        {status === LocationStatus.Idle && (
          <div>
            <p>Нажмите, чтобы запросить разрешение на геолокацию.</p>
            <button className="bg-end-rgb text-white p-2 rounded-md" onClick={fetchGeolocation}>
              Запросить геолокацию
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
  );
};

export default GeolocationWrapper;
