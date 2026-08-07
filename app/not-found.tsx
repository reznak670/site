import { SkullIcon } from './icons'

export default function NotFound() {
  return (
    <div className="scanline-overlay flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1
        data-text="404"
        className="glitch flex items-center gap-3 font-display text-7xl font-bold text-red drop-shadow-[0_0_30px_rgba(212,16,42,0.5)]"
      >
        <SkullIcon size="0.9em" /> 404
      </h1>
      <p className="text-lg text-paper">Этой страницы не существует</p>
      <p className="font-mono text-sm text-mute">Как и твоих шансов выжить на нашем концерте</p>
      <a href="/" className="btn mt-4">
        ← Вернуться на базу
      </a>
    </div>
  )
}
