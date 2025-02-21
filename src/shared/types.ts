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
