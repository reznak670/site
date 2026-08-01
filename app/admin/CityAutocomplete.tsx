'use client'

import { useMemo, useState, type KeyboardEvent } from 'react'
import { RUSSIAN_CITIES } from '@/lib/cities'

export default function CityAutocomplete({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase()
    if (!query) return []
    return RUSSIAN_CITIES.filter((c) => c.toLowerCase().includes(query)).slice(0, 8)
  }, [value])

  function select(city: string) {
    onChange(city)
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(suggestions[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="city-autocomplete">
      <input
        className="admin-input"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(0) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder="Начни вводить город..."
        autoComplete="off"
        maxLength={100}
        required
      />
      {open && suggestions.length > 0 && (
        <ul className="city-autocomplete-list">
          {suggestions.map((city, i) => (
            <li
              key={city}
              className={`city-autocomplete-item${i === highlight ? ' city-autocomplete-item--active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); select(city) }}
              onMouseEnter={() => setHighlight(i)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
