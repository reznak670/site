'use client'

import { SkullIcon, RefreshIcon } from './icons'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="scanline-overlay flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1
        data-text="500"
        className="glitch flex items-center gap-3 font-display text-6xl font-bold text-red drop-shadow-[0_0_30px_rgba(212,16,42,0.5)]"
      >
        <SkullIcon size="0.9em" /> 500
      </h1>
      <p className="text-lg text-paper">Всё пошло наперекосяк</p>
      <p className="font-mono text-sm text-mute">Как барабанщик на 10-й минуте слэма</p>
      <button type="button" onClick={reset} className="btn mt-4">
        <RefreshIcon size="14px" /> Попробовать ещё раз
      </button>
    </div>
  )
}
