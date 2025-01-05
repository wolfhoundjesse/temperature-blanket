import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchAndStoreWeatherForecast(location) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    // Get tomorrow's forecast (OpenWeatherMap returns forecasts in 3-hour intervals)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Noon tomorrow

    const tomorrowForecast = response.data.list.find((forecast) => {
      const forecastDate = new Date(forecast.dt * 1000);
      return forecastDate.getDate() === tomorrow.getDate();
    });

    if (!tomorrowForecast) {
      throw new Error("Could not find tomorrow's forecast");
    }

    // Store in database
    const weatherRecord = await prisma.weatherForecast.create({
      data: {
        location,
        highTemp: tomorrowForecast.main.temp_max,
        date: tomorrow,
      },
    });

    return weatherRecord;
  } catch (error) {
    console.error("Error fetching/storing weather forecast:", error);
    throw error;
  }
}
