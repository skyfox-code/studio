
export interface WeatherData {
  temperature: number;
  humidity: number;
  fetchedLocationName: string;
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

async function geocodeCity(cityName: string): Promise<{ latitude: number; longitude: number; name: string } | null> {
  if (!cityName || cityName.trim() === "") {
    throw new Error("City name cannot be empty.");
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API error! status: ${response.status}`);
    }
    const data: GeocodingResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const bestMatch = data.results[0];
      let displayName = bestMatch.name;
      if (bestMatch.admin1) displayName += `, ${bestMatch.admin1}`;
      if (bestMatch.country_code) displayName += `, ${bestMatch.country_code}`;
      
      return {
        latitude: bestMatch.latitude,
        longitude: bestMatch.longitude,
        name: displayName, // Use the name returned by geocoding API for clarity
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to geocode '${cityName}': ${error.message}`);
    }
    throw new Error(`An unknown error occurred while geocoding '${cityName}'.`);
  }
}

export async function fetchCurrentWeather(locationName: string): Promise<WeatherData> {
  const geoData = await geocodeCity(locationName);

  if (!geoData) {
    throw new Error(`Could not find location: ${locationName}. Please try a different name or be more specific.`);
  }

  const { latitude, longitude, name: fetchedCityName } = geoData;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&timezone=auto`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      let errorMessage = `Weather API error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.reason || errorMessage;
      } catch (e) {
        // Failed to parse error JSON
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();

    if (data && data.current && typeof data.current.temperature_2m === 'number' && typeof data.current.relative_humidity_2m === 'number') {
      return {
        temperature: parseFloat(data.current.temperature_2m.toFixed(1)),
        humidity: Math.round(data.current.relative_humidity_2m),
        fetchedLocationName: fetchedCityName,
      };
    } else {
      throw new Error('Invalid data format received from Open-Meteo weather API.');
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    if (error instanceof Error) {
        throw new Error(`${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching weather data.');
  }
}
