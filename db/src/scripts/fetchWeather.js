import { fetchAndStoreWeatherForecast } from "../services/weatherService.js";

async function main() {
  console.log("Starting weather fetch script...");
  try {
    const result = await fetchAndStoreWeatherForecast("21012");
    console.log("Weather forecast fetched and stored successfully:", result);
  } catch (error) {
    console.error("Failed to fetch weather forecast:", error);
    process.exit(1);
  }
}

console.log("Script initialized at:", new Date().toISOString());
main();
