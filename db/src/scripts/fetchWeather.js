import { fetchAndStoreWeatherForecast } from "../services/weatherService.js";

async function main() {
  try {
    await fetchAndStoreWeatherForecast("London"); // Replace with your location
    console.log("Weather forecast fetched and stored successfully");
  } catch (error) {
    console.error("Failed to fetch weather forecast:", error);
    process.exit(1);
  }
}

main();
