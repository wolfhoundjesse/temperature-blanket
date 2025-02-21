import m from 'mithril'

export interface MonthData {
  label: string
  index: number
  isAvailable: boolean
  isActive: boolean
}

interface MonthPickerAttrs {
  months: MonthData[]
  variant: 'vertical' | 'grid'
  onMonthSelect: (monthIndex: number) => void
}

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const MONTH_ABBR = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]

export const MonthPicker: m.Component<MonthPickerAttrs> = {
  view({ attrs: { months, variant, onMonthSelect } }) {
    const containerClass = variant === 'vertical' ? 'month-picker-vertical' : 'month-picker-grid'

    const handleMonthClick = (month: MonthData) => {
      onMonthSelect(month.index)
      // Find and scroll to month header
      const monthName = MONTHS[month.index]
      const monthHeader = document.querySelector(`tr[data-month="${monthName}"]`)
      const container = document.querySelector('.table-body')
      if (monthHeader && container) {
        // If it's January, scroll to top
        if (month.index === 0) {
          container.scrollTop = 0
        } else {
          container.scrollTop = (monthHeader as HTMLElement).offsetTop
        }
      }
    }

    const monthButton = (month: MonthData) => {
      const buttonClasses = ['month-button', month.isActive ? 'active' : '']
        .filter(Boolean)
        .join(' ')

      const label = variant === 'grid' ? MONTH_ABBR[month.index] : month.label

      return m(
        'button',
        {
          class: buttonClasses,
          disabled: !month.isAvailable,
          onclick: () => handleMonthClick(month),
        },
        label
      )
    }

    return m(
      'div',
      { class: containerClass },
      months.map((month) => monthButton(month))
    )
  },
}

// Helper function to create month data
export const createMonthData = (availableMonths: number[], activeMonth: number): MonthData[] => {
  return MONTHS.map((label, index) => ({
    label,
    index,
    isAvailable: availableMonths.includes(index),
    isActive: index === activeMonth,
  }))
}

// Styles for the month pickers
export const monthPickerStyles = `
  .content {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .table-container {
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    overflow: hidden;
  }

  .table-header table,
  .table-body table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-header th,
  .table-body td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .table-header th {
    background: #4CAF50;
    color: white;
    font-weight: 600;
  }

  .table-body {
    overflow-y: auto;
  }

  .month-picker-grid {
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    width: 150px;
    margin-top: 12px;
  }

  .month-picker-grid .month-button {
    padding: 8px 4px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: center;
    color: #666;
    font-size: 0.9em;
  }

  .month-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .month-button.active {
    background: #e8f5e9;
    color: #4CAF50;
    font-weight: bold;
  }
`
