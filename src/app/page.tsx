import { WeatherForecast } from '@/widgets/WeatherDisplay';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <WeatherForecast />
    </main>
  );
}
