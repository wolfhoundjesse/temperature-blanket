import fs from 'fs/promises'
import path from 'path'
import type { Temperature, TemperatureData, WeatherResponse } from '../shared/types'
import { config } from 'dotenv'

config()

const OPENWEATHER_API_KEY = process.env.WEATHER_API_KEY
const LATITUDE = process.env.WEATHER_LAT || 39.0321
const LONGITUDE = process.env.WEATHER_LON || -76.5027

const colorRanges = [
  { min: 100, max: Infinity, color: 'Bright Orange' },
  { min: 89, max: 100, color: 'Yellow' },
  { min: 78, max: 88, color: 'Pink' },
  { min: 67, max: 77, color: 'Turqoise' },
  { min: 54, max: 66, color: 'Purple' },
  { min: 44, max: 53, color: 'Light Pink' },
  { min: 33, max: 43, color: 'Dark Green' },
  { min: 21, max: 32, color: 'Light Purple' },
  { min: 1, max: 20, color: 'Blue' },
  { min: -Infinity, max: 0, color: 'Light Blue' },
]

function getYarnColor(temperature: number): string {
  const range = colorRanges.find((range) => temperature >= range.min && temperature <= range.max)
  return range ? range.color : 'N/A'
}

async function updateTemperatureData() {
  try {
    // Fetch weather data with proper typing
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${OPENWEATHER_API_KEY}&units=imperial&exclude=minutely,hourly,alerts,current`
    )
    const weatherData = (await response.json()) as WeatherResponse

    // Get today's weather (first item in daily array)
    const todayWeather = weatherData.daily[0]

    // Read existing data
    const dataPath = path.join(__dirname, 'temperature_data.json')
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    const existingData: TemperatureData = JSON.parse(fileContent)

    // Create new entry using max temperature for the day
    const today = new Date()
    const temp = Math.round(todayWeather.temp.max)
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear().toString().slice(-2)}`

    const newEntry: Temperature = {
      date: formattedDate,
      temp: temp,
      color: getYarnColor(temp),
    }

    // Add new entry if it doesn't exist for today
    if (!existingData.temperatures.some((entry) => entry.date === newEntry.date)) {
      existingData.temperatures.push(newEntry)
      existingData.lastUpdated = today.toISOString()

      // Write updated data back to file
      await fs.writeFile(dataPath, JSON.stringify(existingData, null, 2))
      console.log(`Temperature data updated for ${newEntry.date}`)
    } else {
      console.log(`Temperature data already exists for ${newEntry.date}`)
    }
  } catch (error) {
    console.error('Error updating temperature data:', error)
  }
}

export { updateTemperatureData }

// Add this at the bottom of the file to execute when run directly
if (require.main === module) {
  updateTemperatureData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}
