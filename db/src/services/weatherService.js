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
    const apiKey = process.env.OPENWEATHER_API_KEY;
    // Using current weather endpoint instead of forecast since we want today
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    // Store in database
    const weatherRecord = await prisma.weatherForecast.create({
      data: {
        location,
        highTemp: response.data.main.temp_max,
        date: new Date(),
      },
    });

    await prisma.$disconnect();
    return weatherRecord;
  } catch (error) {
    console.error("Error fetching/storing weather forecast:", error);
    await prisma.$disconnect();
    throw error;
  }
}
