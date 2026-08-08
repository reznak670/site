'use client'

import { useEffect, useRef, useState } from 'react'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))
const ITEM_HEIGHT = 40

function closest(options: string[], raw: string) {
  if (options.includes(raw)) return raw
  const n = Number(raw)
  if (Number.isNaN(n)) return options[0]
  return options.reduce((best, cur) => (Math.abs(Number(cur) - n) < Math.abs(Number(best) - n) ? cur : best), options[0])
}

function Wheel({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const settleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = Math.max(0, options.indexOf(value)) * ITEM_HEIGHT
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function settle() {
    const el = ref.current
    if (!el) return
    const idx = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT)))
    el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' })
    onChange(options[idx])
  }

  function handleScroll() {
    if (settleRef.current) clearTimeout(settleRef.current)
    settleRef.current = setTimeout(settle, 120)
  }

  function selectIndex(i: number) {
    ref.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' })
    onChange(options[i])
  }

  return (
    <div
      className="no-scrollbar h-[120px] w-16 snap-y snap-mandatory overflow-y-auto text-center"
      ref={ref}
      onScroll={handleScroll}
    >
      <div style={{ height: ITEM_HEIGHT }} aria-hidden />
      {options.map((opt, i) => (
        <div
          key={opt}
          className={`flex snap-center items-center justify-center font-mono text-lg transition-colors ${
            opt === value ? 'text-red-bright font-semibold' : 'text-paper/40'
          }`}
          style={{ height: ITEM_HEIGHT }}
          onClick={() => selectIndex(i)}
        >
          {opt}
        </div>
      ))}
      <div style={{ height: ITEM_HEIGHT }} aria-hidden />
    </div>
  )
}

export default function TimePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState('19')
  const [minute, setMinute] = useState('00')

  function openPicker() {
    const [h, m] = value ? value.split(':') : ['19', '00']
    setHour(closest(HOURS, h || '19'))
    setMinute(closest(MINUTES, m || '00'))
    setOpen(true)
  }

  function confirm() {
    onChange(`${hour}:${minute}`)
    setOpen(false)
  }

  return (
    <>
      <button type="button" className="field-input text-left" onClick={openPicker}>
        {value || 'Выбрать время'}
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="glass w-full max-w-xs p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 font-mono text-xs uppercase tracking-widest2 text-red">Время начала (местное)</div>
            <div className="relative flex items-center justify-center gap-2">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 border-y border-red/40 bg-red/5" aria-hidden />
              <Wheel options={HOURS} value={hour} onChange={setHour} />
              <div className="font-display text-xl text-paper/60">:</div>
              <Wheel options={MINUTES} value={minute} onChange={setMinute} />
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
