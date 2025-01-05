import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Running deployment checks...");

    // Test database connection
    await prisma.$connect();
    console.log("✓ Database connection successful");

    // Test weather API connection
    const { fetchAndStoreWeatherForecast } = await import(
      "../src/services/weatherService.js"
    );
    await fetchAndStoreWeatherForecast("21012");
    console.log("✓ Weather API connection successful");

    console.log("All checks passed!");
    process.exit(0);
  } catch (error) {
    console.error("Deployment check failed:", error);
    process.exit(1);
  }
}

main();
