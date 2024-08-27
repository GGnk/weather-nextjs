import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/widgets/Header';

import './globals.scss';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather with NextJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} max-w-screen-2xl mx-auto px-4`}>
        <Header />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
