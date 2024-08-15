import { WeatherForecast } from '@/widgets/WeatherDisplay';

export default function Current() {
  return (
    <main className="flex min-h-screen flex-col">
      <WeatherForecast />
    </main>
  );
}
