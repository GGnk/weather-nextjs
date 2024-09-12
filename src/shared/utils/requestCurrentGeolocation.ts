export const requestCurrentGeolocation = () => {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation is not supported by the browser'));
  }

  return new Promise<GeolocationCoordinates>((resolve, reject) => {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        switch (permissionStatus.state) {
          case 'denied':
            reject(new Error('Geolocation access denied'));
            break;
          default:
            navigator.geolocation.getCurrentPosition(
              (geo) => {
                return resolve(geo.coords);
              },
              (error) => {
                return reject(error);
              },
            );
            break;
        }
      })
      .catch((error) => {
        console.error('Error requesting geolocation permission:', error);
        reject(error);
      });
  });
};
