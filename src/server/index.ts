import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { TemperatureData, TemperatureResponse } from '../shared/types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPERATURE_DATA_FILE = join(__dirname, 'temperature_data.json')


// Initialize with sample data if needed
const defaultData: TemperatureData = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  lastCompletedRow: '',
  temperatures: [
    {
      date: '2025-01-01',
      temp: 32,
      color: 'Blue',
    },
    // Add more sample data as needed
  ],
}

// Ensure temperature data file exists
try {
  readFileSync(TEMPERATURE_DATA_FILE)
} catch (e) {
  writeFileSync(TEMPERATURE_DATA_FILE, JSON.stringify(defaultData, null, 2))
}

const server = Bun.serve({
  port: process.env.PORT || 8080,
  async fetch(req) {
    const url = new URL(req.url)

    // API Routes
    if (url.pathname === '/api/config') {
      const config = {
        WEATHER_API_KEY: process.env.WEATHER_API_KEY,
        LAT: process.env.WEATHER_LAT,
        LON: process.env.WEATHER_LON,
      }

      if (!Object.values(config).every(Boolean)) {
        return new Response('Server configuration incomplete', { status: 500 })
      }

      return Response.json(config)
    }

    if (url.pathname === '/api/temperature-data') {
      const fileExists = existsSync(TEMPERATURE_DATA_FILE)

      if (!fileExists) {
        return new Response('Temperature data not found', { status: 404 })
      }

      const rawContents = readFileSync(TEMPERATURE_DATA_FILE, 'utf-8')
      const data = JSON.parse(rawContents) as TemperatureData

      return Response.json({
        lastUpdated: data.lastUpdated,
        lastCompletedRow: data.lastCompletedRow,
        temperatures: data.temperatures.map((t) => ({
          date: t.date,
          temperature: t.temp,
          color: t.color,
        })),
      } as TemperatureResponse)
    }

    if (url.pathname === '/api/update-completed-row' && req.method === 'POST') {
      try {
        const body = await req.json()
        const data = JSON.parse(readFileSync(TEMPERATURE_DATA_FILE, 'utf-8'))
        data.lastCompletedRow = body.date
        writeFileSync(TEMPERATURE_DATA_FILE, JSON.stringify(data, null, 2))
        return Response.json({ success: true })
      } catch (error) {
        return new Response('Failed to update', { status: 500 })
      }
    }

    // Static file serving
    const filePath = url.pathname === '/' ? '/index.html' : url.pathname
    const file = Bun.file(`public${filePath}`)
    const exists = await file.exists()

    if (!exists) {
      return new Response('Not Found', { status: 404 })
    }

    return new Response(file)
  },
})

console.log(`Server running at http://localhost:${server.port}`)
