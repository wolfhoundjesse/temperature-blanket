import m from 'mithril'
import { createMonthData, MonthPicker, monthPickerStyles, MONTHS } from './components/MonthPicker'
import { TemperatureTable } from './components/TemperatureTable'
import { store } from './store'
import { config } from './config'

// Add styles to the document
const style = document.createElement('style')
style.textContent = monthPickerStyles
document.head.appendChild(style)

const App: m.Component = {
  oninit() {
    store.init()
  },
  view() {
    const monthData = createMonthData(store.availableMonths, store.activeMonth)

    const handleMonthSelect = (monthIndex: number) => {
      store.setActiveMonth(monthIndex)
      scrollToMonth(monthIndex)
    }

    return m('div.content', [
      m('div.header-container', [
        m('h1', '2025 Temperature Blanket'),
        store.temperatureData.length > 0 &&
          m(MonthPicker, {
            months: monthData,
            variant: 'grid',
            onMonthSelect: handleMonthSelect,
          }),
      ]),
      m(TemperatureTable, { data: store.temperatureData }),
    ])
  },
}

// Helper function to scroll to a month
function scrollToMonth(monthIndex: number) {
  const monthHeaders = document.querySelectorAll('.month-header')
  monthHeaders.forEach((header) => {
    const headerText = header.textContent || ''
    if (headerText.includes(MONTHS[monthIndex])) {
      header.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// Register service worker if enabled
if (config.enableServiceWorker) {
  navigator.serviceWorker?.register('/sw.js').catch(console.error)
}

// Mount the application
m.mount(document.body, App)
