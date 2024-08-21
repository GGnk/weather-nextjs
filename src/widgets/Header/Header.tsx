'use client';

import { WEATHER_OPTIONS } from '@/shared/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathName = usePathname();
  const links = [
    {
      name: 'Current',
      href: `/${WEATHER_OPTIONS.CURRENT}`,
      isActive: pathName === `/${WEATHER_OPTIONS.CURRENT}`,
    },
    {
      name: 'Daily',
      href: `/${WEATHER_OPTIONS.DAILY}`,
      isActive: pathName === `/${WEATHER_OPTIONS.DAILY}`,
    },
  ];

  const linkElements = links.map((link) => (
    <Link
      key={link.href}
      className={`${link.isActive ? 'bg-end-rgb text-white' : 'bg-start-rgb text-bg-end-rgb'} h-12 min-w-24 text-center content-center`}
      href={link.href}
    >
      {link.name}
    </Link>
  ));
  return (
    <header className="h-20 flex gap-5 bg-white">
      <div className="content-center ml-5">
        <Link href="/">
          <h1>Weather Forecast</h1>
        </Link>
      </div>
      <div className="flex gap-3 items-center">{linkElements}</div>
    </header>
  );
}
