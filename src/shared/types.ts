export interface Temperature {
  date: string
  temp: number
  color: string
}

export interface TemperatureData {
  version: number
  lastUpdated: string
  lastCompletedRow: string
  temperatures: Temperature[]
}

export interface TemperatureResponse {
  lastUpdated: string
  lastCompletedRow: string
  temperatures: Array<{
    date: string
    temperature: number
    color: string
  }>
}

// OpenWeatherMap API Types
export interface WeatherResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  daily: DailyWeather[]
}

export interface DailyWeather {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  summary: string
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  clouds: number
  pop: number
  uvi: number
  rain?: number // Optional since it only appears when there's rain
}

export type DailyTemp = DailyWeather['temp']
export type DailyMaxTemp = Pick<DailyTemp, 'max'>
