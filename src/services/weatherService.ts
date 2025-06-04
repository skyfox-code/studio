
export interface WeatherData {
  temperature: number;
  humidity: number;
}

// Default to Vienna, Austria
const DEFAULT_LATITUDE = 48.2082;
const DEFAULT_LONGITUDE = 16.3738;

export async function fetchCurrentWeather(
  latitude: number = DEFAULT_LATITUDE,
  longitude: number = DEFAULT_LONGITUDE
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&timezone=Europe/Vienna`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.reason || errorMessage;
      } catch (e) {
        // Failed to parse error JSON, stick with status code
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();

    if (data && data.current && typeof data.current.temperature_2m === 'number' && typeof data.current.relative_humidity_2m === 'number') {
      return {
        temperature: parseFloat(data.current.temperature_2m.toFixed(1)),
        humidity: Math.round(data.current.relative_humidity_2m),
      };
    } else {
      throw new Error('Invalid data format received from Open-Meteo API.');
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    if (error instanceof Error) {
        throw new Error(`${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching weather data.');
  }
}
