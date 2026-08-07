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
      <button type="button" className="field-input text-left" onClick={openPicker}>
        {value ? formatDisplay(value) : 'Выбрать дату'}
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="glass w-full max-w-xs p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 font-mono text-xs uppercase tracking-widest2 text-red">Дата мероприятия</div>
            <div className="mb-3 flex items-center justify-between">
              <button type="button" className="flex h-8 w-8 items-center justify-center text-lg text-paper/70 hover:text-red" onClick={() => shiftMonth(-1)} aria-label="Предыдущий месяц">‹</button>
              <button type="button" className="font-display text-sm font-semibold uppercase tracking-wide hover:text-red" onClick={jumpToday}>{MONTHS[viewMonth]} {viewYear}</button>
              <button type="button" className="flex h-8 w-8 items-center justify-center text-lg text-paper/70 hover:text-red" onClick={() => shiftMonth(1)} aria-label="Следующий месяц">›</button>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((w) => <div key={w} className="py-1 text-center font-mono text-[10px] uppercase text-mute">{w}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (d === null) return <div key={`pad-${i}`} className="h-9 w-9" />
                const cellValue = toValue(viewYear, viewMonth, d)
                const isSelected = cellValue === pending
                const isToday = cellValue === todayStr
                return (
                  <button
                    type="button"
                    key={d}
                    className={`flex h-9 w-9 items-center justify-center text-sm transition-colors ${
                      isSelected
                        ? 'bg-red text-ink font-semibold'
                        : isToday
                          ? 'border border-paper/40 text-paper'
                          : 'text-paper/80 hover:bg-red/10'
                    }`}
                    onClick={() => selectDay(d)}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button type="button" className="font-mono text-xs uppercase tracking-widest2 text-mute hover:text-paper" onClick={() => setOpen(false)}>ОТМЕНА</button>
              <button type="button" className="btn !px-4 !py-2 text-xs" onClick={confirm}>ГОТОВО</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
