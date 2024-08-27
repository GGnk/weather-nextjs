import { WeatherHourlyCard } from '@/shared/components/WeatherCards';
import React from 'react';
import { FC } from 'react';
import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface IProps {
  listHourly: {
    time: string;
    temperature: string;
    humidity: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: number;
    wind_speed: string;
  }[];
}

const responsive: ResponsiveType = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30,
  },
};

const WeatherHourlyCarousel: FC<IProps> = ({ listHourly }) => {
  return (
    <div className="flex justify-center mx-auto items-center">
      <Carousel
        ssr
        deviceType="mobile"
        centerMode
        infinite
        responsive={responsive}
        autoPlay={true}
        containerClass="container"
      >
        {listHourly.map((weather) => (
          <WeatherHourlyCard key={weather.time} {...weather} />
        ))}
      </Carousel>
    </div>
  );
};
export default WeatherHourlyCarousel;
