import m from 'mithril'
import { createMonthData, MonthPicker, monthPickerStyles, MONTHS } from './components/MonthPicker'
import { TemperatureTable } from './views/TemperatureTable'
import { store } from './store'
import { config } from './config'

const App: m.Component = {
  view: function () {
    return m(TemperatureTable)
  },
}

m.mount(document.body, App)
