import m from 'mithril'
import type { TemperatureResponse } from '../../shared/types'

interface TemperatureModel {
  data: TemperatureResponse | null
  loadData: () => Promise<void>
}

const TemperatureData: TemperatureModel = {
  data: null,
  loadData: async (): Promise<void> => {
    try {
      const result = await m.request<TemperatureResponse>({
        method: 'GET',
        url: '/api/temperature-data',
      })
      TemperatureData.data = result
      m.redraw()
      console.log('data loaded', TemperatureData.data)
    } catch (error) {
      console.error('Failed to load temperature data:', error)
    }
  },
}

export default TemperatureData
