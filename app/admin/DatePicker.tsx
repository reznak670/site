'use client'

import { useState } from 'react'

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const WEEKDAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toValue(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

function parseValue(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return { y, m: m - 1, d }
}

function formatDisplay(value: string) {
  const parsed = parseValue(value)
  if (!parsed) return ''
  return `${pad(parsed.d)}.${pad(parsed.m + 1)}.${parsed.y}`
}

export default function DatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const today = new Date()
  const todayStr = toValue(today.getFullYear(), today.getMonth(), today.getDate())
  const initial = parseValue(value)
  const [viewYear, setViewYear] = useState(initial?.y ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial?.m ?? today.getMonth())
  const [pending, setPending] = useState(value || todayStr)

  function openPicker() {
    const parsed = parseValue(value)
    setViewYear(parsed?.y ?? today.getFullYear())
    setViewMonth(parsed?.m ?? today.getMonth())
    setPending(value || todayStr)
    setOpen(true)
  }

  function shiftMonth(delta: number) {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    setViewMonth(m)
    setViewYear(y)
  }

  function selectDay(d: number) {
    setPending(toValue(viewYear, viewMonth, d))
  }

  function jumpToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setPending(todayStr)
  }

  function confirm() {
    onChange(pending)
    setOpen(false)
  }

  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <>
      <button type="button" className="admin-input date-picker-trigger" onClick={openPicker}>
        {value ? formatDisplay(value) : 'Выбрать дату'}
      </button>
      {open && (
        <div className="time-picker-overlay" onClick={() => setOpen(false)}>
          <div className="date-picker-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="time-picker-header">Дата мероприятия</div>
            <div className="date-picker-header">
              <button type="button" className="date-picker-nav" onClick={() => shiftMonth(-1)} aria-label="Предыдущий месяц">‹</button>
              <button type="button" className="date-picker-title date-picker-title--today" onClick={jumpToday}>{MONTHS[viewMonth]} {viewYear}</button>
              <button type="button" className="date-picker-nav" onClick={() => shiftMonth(1)} aria-label="Следующий месяц">›</button>
            </div>
            <div className="date-picker-weekdays">
              {WEEKDAYS.map((w) => <div key={w} className="date-picker-weekday">{w}</div>)}
            </div>
            <div className="date-picker-grid">
              {cells.map((d, i) => {
                if (d === null) return <div key={`pad-${i}`} className="date-picker-cell date-picker-cell--empty" />
                const cellValue = toValue(viewYear, viewMonth, d)
                const isSelected = cellValue === pending
                const isToday = cellValue === todayStr
                return (
                  <button
                    type="button"
                    key={d}
                    className={`date-picker-cell${isSelected ? ' date-picker-cell--selected' : ''}${isToday && !isSelected ? ' date-picker-cell--today' : ''}`}
                    onClick={() => selectDay(d)}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            <div className="time-picker-actions">
              <button type="button" className="time-picker-cancel" onClick={() => setOpen(false)}>ОТМЕНА</button>
              <button type="button" className="btn" onClick={confirm}>ГОТОВО</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
