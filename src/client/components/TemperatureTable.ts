import m from 'mithril'
import { store } from '../store'

interface TemperatureTableAttrs {
  data: Array<{
    date: string
    temperature: number
    color: string
  }>
}

export const TemperatureTable: m.Component<TemperatureTableAttrs> = {
  oncreate(vnode) {
    // Wait for next tick to ensure data is loaded
    setTimeout(() => {
      console.log('oncreate called, lastCompletedRow:', store.lastCompletedRow)
      if (store.lastCompletedRow) {
        setTimeout(() => {
          console.log('timeout callback executing')
          const completedRow = document.querySelector(`tr[data-date="${store.lastCompletedRow}"]`)
          const container = document.querySelector('.table-body')
          console.log('elements found:', { completedRow, container })

          if (completedRow && container) {
            const rowTop = (completedRow as HTMLElement).offsetTop
            const containerHeight = container.clientHeight
            const scrollPosition = rowTop - containerHeight / 2

            console.log({
              lastCompletedRow: store.lastCompletedRow,
              rowTop,
              containerHeight,
              scrollPosition,
            })

            container.scrollTop = scrollPosition
          }
        }, 100)
      }
    }, 0)
  },

  view({ attrs: { data } }) {
    // Function to check if a row is completed
    const isCompleted = (date: string) => {
      if (!store.lastCompletedRow) return false
      const rowDate = new Date(date)
      const completedDate = new Date(store.lastCompletedRow)
      return rowDate <= completedDate
    }

    const handleRowClick = (date: string) => {
      store.setLastCompletedRow(date)
    }

    const groupedByMonth = data.reduce(
      (acc, entry) => {
        const date = new Date(entry.date)
        const monthKey = date.toLocaleString('default', { month: 'long' })
        if (!acc[monthKey]) acc[monthKey] = []
        acc[monthKey].push(entry)
        return acc
      },
      {} as Record<string, typeof data>
    )

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
            data && data.length > 0
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
                        onclick: () => handleRowClick(entry.date),
                        style: 'cursor: pointer',
                      },
                      [m('td', entry.date), m('td', `${entry.temperature}°F`), m('td', entry.color)]
                    )
                  ),
                ])
              : m('tr', [
                  m(
                    'td[colspan=3]',
                    store.showLoading
                      ? 'Loading temperature data...'
                      : 'No temperature data available'
                  ),
                ])
          ),
        ]),
      ]),
    ])
  },
}
