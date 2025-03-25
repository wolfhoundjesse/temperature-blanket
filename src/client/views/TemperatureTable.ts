import m from 'mithril'
import type { TemperatureResponse } from '../../shared/types'
import TemperatureData from '../models/TemperatureData'

interface TemperatureTableAttrs {
  data: TemperatureResponse
}

export const TemperatureTable: m.Component<TemperatureTableAttrs> = {
  oninit: TemperatureData.loadData,
  view: function () {
    console.log('TempData', TemperatureData.data)
    return m('div.table-container', [
      m('div.table-header', [
        m('table', [
          m('thead', [
            m('tr', [m('th', 'Date'), m('th', 'High Temp (°F)'), m('th', 'Yarn Color')]),
          ]),
        ]),
      ]),
      m('div.table-body', { style: 'max-height: 600px; overflow-y: auto;' }, [
        m('table', [
          m(
            'tbody',
            TemperatureData.data && TemperatureData.data.temperatures.length > 0
              ? Object.entries(groupedByMonth).flatMap(([month, entries]) => [
                  m(
                    'tr.month-header',
                    {
                      'data-month': month, // Use month name as identifier
                    },
                    [
                      m(
                        'td[colspan=3]',
                        { style: 'background: #f5f5f5; font-weight: bold; text-align: center;' },
                        month
                      ),
                    ]
                  ),
                  ...entries.map((entry) =>
                    m(
                      'tr',
                      {
                        'data-date': entry.date,
                        class: isCompleted(entry.date) ? 'completed-row' : '',
                        // onclick: () => handleRowClick(entry.date),
                        style: 'cursor: pointer',
                      },
                      [m('td', entry.date), m('td', `${entry.temperature}°F`), m('td', entry.color)]
                    )
                  ),
                ])
              : m('tr', [
                  m(
                    'td[colspan=3]',
                    TemperatureData.data && TemperatureData.data.temperatures.length === 0
                      ? 'No temperature data available'
                      : 'Loading temperature data...'
                  ),
                ])
          ),
        ]),
      ]),
    ])
  },
}

const groupedByMonth = TemperatureData.data
  ? TemperatureData.data.temperatures.reduce(
      (acc, entry) => {
        const date = new Date(entry.date)
        const monthKey = date.toLocaleString('default', { month: 'long' })
        if (!acc[monthKey]) acc[monthKey] = []
        acc[monthKey].push(entry)
        return acc
      },
      {} as Record<string, typeof TemperatureData.data.temperatures>
    )
  : {}

const isCompleted = (date: string) => {
  if (!TemperatureData?.data?.lastCompletedRow) return false
  const rowDate = new Date(date)
  const completedDate = new Date(TemperatureData.data.lastCompletedRow)
  return rowDate <= completedDate
}
