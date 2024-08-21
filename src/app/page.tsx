import { WeatherDaily } from '@/widgets/WeatherDaily';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <WeatherDaily />
    </main>
  );
}
