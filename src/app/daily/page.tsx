'use client';

import { GeolocationWrapper } from '@/widgets/GeolocationWrapper';
import { WeatherDaily } from '@/widgets/WeatherDaily';

export default function Current() {
  return (
    <GeolocationWrapper>
      <WeatherDaily />
    </GeolocationWrapper>
  );
}
