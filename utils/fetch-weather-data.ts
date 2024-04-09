import { WeatherType } from "../components/weather";

export const fetchLatLng = async (location: string) => {
  const params = new URLSearchParams({
    name: location,
  });

  console.log(`↪️ Fetching GeoCode for ${location}`);

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  ).catch((error) => {
    console.error("Error while fetching GeoCode:", error);
    throw new Error("Location not found");
  });

  const data = await response.json();
  const firstResult = data.results[0];

  return {
    latitude: firstResult.latitude,
    longitude: firstResult.longitude,
    timezone: firstResult.timezone,
  };
};

export const fetchWeatherData = async (location: string) => {
  const { latitude, longitude, timezone } = await fetchLatLng(location);

  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    timezone: timezone,
    forecast_days: "1",
    forecast_hours: "24",
    hourly: "temperature_2m,weathercode",
  });

  console.log(`↪️ Fetching Weather Data for [${latitude}, ${longitude}]`);

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  ).catch((error) => {
    console.error("Error while fetching Weather Data:", error);
    throw new Error("Weather data not found");
  });

  const data = await response.json();
  const weatherData = data.hourly.time.map(
    (timestamp: string, index: number) => {
      return {
        time: new Date(timestamp),
        temperature: data.hourly.temperature_2m[index],
        icon: mapWeatherCodeToType(data.hourly.weathercode[index]),
      };
    }
  );

  return weatherData;
};

// +------------+----------------------------------------------------+
// | Code       | Description                                        |
// +------------+----------------------------------------------------+
// | 0          | Clear sky                                          |
// | 1, 2, 3    | Mainly clear, partly cloudy, and overcast          |
// | 45, 48     | Fog and depositing rime fog                        |
// | 51, 53, 55 | Drizzle: Light, moderate, and dense intensity      |
// | 56, 57     | Freezing Drizzle: Light and dense intensity        |
// | 61, 63, 65 | Rain: Slight, moderate and heavy intensity         |
// | 66, 67     | Freezing Rain: Light and heavy intensity           |
// | 71, 73, 75 | Snow fall: Slight, moderate, and heavy intensity   |
// | 77         | Snow grains                                        |
// | 80, 81, 82 | Rain showers: Slight, moderate, and violent        |
// | 85, 86     | Snow showers slight and heavy                      |
// | 95 *       | Thunderstorm: Slight or moderate                   |
// | 96, 99 *   | Thunderstorm with slight and heavy hail            |
// +------------+----------------------------------------------------+
// (*) Thunderstorm forecast with hail is only available in Central Europe

const mapWeatherCodeToType = (code: number) => {
  switch (code) {
    case 0:
      return WeatherType.CLEAR;
    case 1:
    case 2:
    case 3:
      return WeatherType.PARTLY_CLOUDY;
    case 45:
    case 48:
      return WeatherType.FOGGY;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
      return WeatherType.RAINY;
    case 66:
    case 67:
    case 71:
    case 73:
    case 75:
      return WeatherType.SNOWY;
    case 80:
    case 81:
    case 82:
    case 95:
    case 96:
    case 99:
      return WeatherType.STORMY;
    default:
      return WeatherType.CLOUDY;
  }
};
