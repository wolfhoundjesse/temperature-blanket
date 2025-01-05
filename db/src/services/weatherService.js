import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add connection handling
prisma
  .$connect()
  .then(() => console.log("Database connected successfully"))
  .catch((e) => console.error("Database connection failed:", e));

export async function fetchAndStoreWeatherForecast(location) {
  try {
    console.log(`Fetching weather data for location: ${location}`);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    console.log("Weather API response:", {
      temp_max: response.data.main.temp_max,
      location: response.data.name,
      timestamp: new Date(),
    });

    // Store in database
    console.log("Attempting to store in database...");
    const weatherRecord = await prisma.weatherForecast.create({
      data: {
        location,
        highTemp: response.data.main.temp_max,
        date: new Date(),
      },
    });
    console.log("Successfully stored weather record:", weatherRecord);

    await prisma.$disconnect();
    return weatherRecord;
  } catch (error) {
    console.error("Detailed error information:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    await prisma.$disconnect();
    throw error;
  }
}
