import { useGeoStore, LocationStatus, initializeLocation, requestAndUpdateGeoAddress } from '@/entities/geolocation';
import React, { PropsWithChildren, useEffect } from 'react';
import { VscWorkspaceUnknown, VscLoading, VscWorkspaceUntrusted } from 'react-icons/vsc';
import { useShallow } from 'zustand/react/shallow';

const GeolocationWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { status, coords } = useGeoStore(
    useShallow((state) => ({
      status: state.status,
      coords: state.coords,
    })),
  );

  useEffect(() => {
    initializeLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Icon =
    status === LocationStatus.Idle
      ? VscWorkspaceUnknown
      : status === LocationStatus.Requesting
        ? VscLoading
        : VscWorkspaceUntrusted;

  return (
    <>
      {coords?.ipAddress && status !== LocationStatus.Approved && (
        <div className="w-full mx-auto p-3 bg-start-rgb rounded-md">
          <div className={`flex gap-3 items-center text-bg-end-rgb`}>
            <Icon className={`h-8 w-8 flex-shrink-0 ${status === LocationStatus.Requesting ? 'animate-spin' : ''}`} />
            {(status === LocationStatus.Idle || status === LocationStatus.Promt) && (
              <div>
                <p>Текущая геолокация определена по IP адресу: {coords?.ipAddress}</p>
                <button className="bg-end-rgb text-white p-2 rounded-md" onClick={requestAndUpdateGeoAddress}>
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
