'use client';

import { WEATHER_OPTIONS } from '@/shared/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosSearch } from 'react-icons/io';
import { IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';
import { MdOutlineNotificationsActive } from 'react-icons/md';

const Header = () => {
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
      className={`${link.isActive ? 'bg-end-rgb text-white' : 'border-b-2 text-black'} h-12 min-w-24 text-center content-center`}
      href={link.href}
    >
      {link.name}
    </Link>
  ));
  return (
    <header className="header">
      <div className="header_block">
        <div className="text-gray-500 text-sm">
          <Link href="/" className="flex flex-col gap-1 items-center">
            <div className="flex items-center">
              <IoLocationOutline className="w-6 h-6" />
              <h1 className="text-xl">Weather Forecast</h1>
            </div>
            <div className="flex gap-2">
              <Image src="next.svg" alt="nextjs" width={50} height={20} />
              &
              <Image src="vercel.svg" alt="vercel" width={50} height={20} />
            </div>
          </Link>
        </div>
        <div className="md:flex gap-3 items-center hidden">{linkElements}</div>
        <div className="search-block">
          <div className="form-group">
            <input type="search" id="searchInput" name="search" autoComplete="off" placeholder="Search here..." />
          </div>
          <button type="submit" className="search-btn" aria-label="Search">
            <IoIosSearch />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="text-2xl" aria-label="Calendar">
            <IoCalendarOutline />
          </button>
          <button className="text-2xl" aria-label="Notifcation">
            <MdOutlineNotificationsActive />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
