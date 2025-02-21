import m from 'mithril'
import type { TemperatureResponse } from '../shared/types'
import { config } from './config'

const MIN_LOADING_TIME = 3000 // milliseconds
const LOADING_DELAY = 3000 // milliseconds

// Create a state store outside the component
export const store = {
  activeMonth: new Date().getMonth(),
  availableMonths: [] as number[],
  temperatureData: [] as any[],
  lastCompletedRow: '',
  isLoading: false,
  loadingTimer: null as number | null,
  loadingStart: 0,
  showLoading: false,

  setLoading(loading: boolean) {
    if (loading) {
      // Don't set isLoading immediately
      this.loadingTimer = setTimeout(() => {
        this.showLoading = true
        this.loadingStart = Date.now()
        this.isLoading = true
        m.redraw()
      }, LOADING_DELAY) as unknown as number
    } else {
      const timeElapsed = Date.now() - this.loadingStart
      if (timeElapsed < MIN_LOADING_TIME && this.showLoading) {
        setTimeout(() => {
          this.showLoading = false
          this.isLoading = false
          m.redraw()
        }, MIN_LOADING_TIME - timeElapsed)
      } else {
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer)
          this.loadingTimer = null
        }
        this.showLoading = false
        this.isLoading = false
      }
    }
  },

  async init() {
    const savedData = localStorage.getItem('temperatureData')

    if (config.enableLocalStorage) {
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.lastUpdated) {
          const lastUpdate = new Date(data.lastUpdated)
          const today = new Date()
          if (lastUpdate.toDateString() === today.toDateString()) {
            this.setTemperatureData(data.temperatures, data.lastCompletedRow)
            return
          }
        }
      }
    }

    this.setLoading(true)
    try {
      const result = await m.request<TemperatureResponse>({
        method: 'GET',
        url: '/api/temperature-data',
      })

      console.log('API Response:', result)

      this.setTemperatureData(result.temperatures, result.lastCompletedRow)
      if (config.enableLocalStorage) {
        localStorage.setItem(
          'temperatureData',
          JSON.stringify({
            lastUpdated: result.lastUpdated,
            lastCompletedRow: result.lastCompletedRow,
            temperatures: result.temperatures,
          })
        )
      }
    } catch (error) {
      console.error('❌ Failed to load temperature data:', error)
      if (config.enableLocalStorage && savedData) {
        const data = JSON.parse(savedData)
        this.setTemperatureData(data.temperatures, data.lastCompletedRow)
      }
    } finally {
      this.setLoading(false)
    }
  },

  setActiveMonth(month: number) {
    this.activeMonth = month
    m.redraw()
  },

  setAvailableMonths(months: number[]) {
    this.availableMonths = months
    m.redraw()
  },

  setTemperatureData(data: any, lastCompleted?: string) {
    if (!data) return

    this.temperatureData = Array.isArray(data) ? data : []

    // Set lastCompletedRow from parameter or localStorage
    if (lastCompleted) {
      this.lastCompletedRow = lastCompleted
    } else if (config.enableLocalStorage) {
      const savedData = localStorage.getItem('temperatureData')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        this.lastCompletedRow = parsed.lastCompletedRow || ''
      }
    }

    const months = new Set(
      this.temperatureData.map((entry: any) => {
        const date = new Date(entry.date)
        return date.getMonth()
      })
    )
    this.setAvailableMonths(Array.from(months) as number[])
    m.redraw()
  },

  async setLastCompletedRow(date: string) {
    this.lastCompletedRow = date

    try {
      await m.request({
        method: 'POST',
        url: '/api/update-completed-row',
        body: { date },
      })
    } catch (error) {
      console.error('Failed to persist completed row:', error)
    }

    m.redraw()
  },
}
