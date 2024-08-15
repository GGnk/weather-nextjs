export type WeatherGroup = {
  description: string;
  icon: string;
};

type WeatherMapping = {
  [key: number]: WeatherGroup;
};

export const WEATHER_DESCRIPTIONS: WeatherMapping = {
  0: { description: 'Clear sky', icon: '🌞' },
  1: { description: 'Mainly clear', icon: '🌤' },
  2: { description: 'Partly cloudy', icon: '🌥' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫' },
  48: { description: 'Depositing rime fog', icon: '🌫' },
  51: { description: 'Drizzle: Light intensity', icon: '🌧' },
  53: { description: 'Drizzle: Moderate intensity', icon: '🌧' },
  55: { description: 'Drizzle: Dense intensity', icon: '🌧' },
  56: { description: 'Freezing Drizzle: Light intensity', icon: '🌧' },
  57: { description: 'Freezing Drizzle: Dense intensity', icon: '🌧' },
  61: { description: 'Rain: Slight intensity', icon: '🌧' },
  63: { description: 'Rain: Moderate intensity', icon: '🌧' },
  65: { description: 'Rain: Heavy intensity', icon: '🌧' },
  66: { description: 'Freezing Rain: Light intensity', icon: '🌧' },
  67: { description: 'Freezing Rain: Heavy intensity', icon: '🌧' },
  71: { description: 'Snow fall: Slight intensity', icon: '🌨' },
  73: { description: 'Snow fall: Moderate intensity', icon: '🌨' },
  75: { description: 'Snow fall: Heavy intensity', icon: '🌨' },
  77: { description: 'Snow grains', icon: '🌨' },
  80: { description: 'Rain showers: Slight intensity', icon: '🌦' },
  81: { description: 'Rain showers: Moderate intensity', icon: '🌦' },
  82: { description: 'Rain showers: Violent intensity', icon: '🌦' },
  85: { description: 'Snow showers: Slight intensity', icon: '🌨' },
  86: { description: 'Snow showers: Heavy intensity', icon: '🌨' },
  95: { description: 'Thunderstorm: Slight or moderate', icon: '⛈' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈' },
};
