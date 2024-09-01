'use client';

import type { FC } from 'react';
import type { WeatherResponseWithCurrent } from '@/shared/api/weather';
import { WeatherHourlyCard } from '@/shared/components/WeatherCards';
import { getWeatherDescription } from '@/shared/utils/getWeatherDescription';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/scss';
import 'swiper/scss/autoplay';
import type { GeoData } from '@/shared/api/geo';

interface IProps {
  weatherData: WeatherResponseWithCurrent;
  addressData?: GeoData['address'];
}

const CurrentHourlyBlock: FC<IProps> = ({ weatherData: { current, hourly }, addressData }) => {
  const weatherDesc = getWeatherDescription(current.weather_code);

  return (
    <div className="current_hourly_block">
      <div className="current_hourly_block__left">
        <span className="text-8xl mx-auto">{weatherDesc.icon}</span>
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-xl text-center">{addressData?.display_name}</h2>
          <p className="mt-2">{weatherDesc.description}</p>
          <span className="text-4xl">{current.temperature}</span>
        </div>
      </div>

      <div className="current_hourly_block__right">
        <Swiper
          modules={[Autoplay]}
          autoplay
          loop
          className="h-full"
          spaceBetween={10}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
            },
            768: {
              slidesPerView: 2.5,
            },
            1024: {
              slidesPerView: 2.3,
            },
            1344: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
          }}
        >
          {hourly.map((weather) => (
            <SwiperSlide key={weather.time}>
              <WeatherHourlyCard {...weather} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CurrentHourlyBlock;
