'use client';

import { GeolocationWrapper } from '@/widgets/GeolocationWrapper';
import { WeatherCurrent } from '@/widgets/WeatherCurrent';

export default function Current() {
  return (
    <GeolocationWrapper>
      <WeatherCurrent />
    </GeolocationWrapper>
  );
}
