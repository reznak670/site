'use client'

import { useRef, useState } from 'react'
import { CrossIcon, DownloadIcon, PlayIcon, ScissorsIcon } from '@/app/icons'

export default function Clip() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function start() {
    setPlaying(true)
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}))
  }

  return (
    <section id="clip" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5">
        <p className="eyebrow mb-3 flex items-center gap-1.5"><CrossIcon size="15px" />05 / Клип</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Клип</h2>
        <p className="panel mt-8 p-6 text-paper/85">
          Главный визуальный удар группы. Смотри на полном экране, звук выкручивай до предела.
        </p>

        <div className="glass group relative mt-8 aspect-video overflow-hidden">
          <video
            ref={videoRef}
            className="h-full w-full bg-black object-cover"
            src="/video/megaclip.mp4"
            controls={playing}
            playsInline
            preload="metadata"
            poster="/img/poster.jpg"
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          {!playing && (
            <button
              type="button"
              onClick={start}
              aria-label="Смотреть клип"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-ink via-ink/30 to-ink/60 transition-colors duration-300 hover:from-ink/95"
            >
              <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-red/40 bg-ink/60 px-3 py-1 backdrop-blur-sm">
                <ScissorsIcon size="11px" />
                Эксклюзив
              </span>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red text-ink shadow-glow transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                <PlayIcon size="26px" />
              </span>
              <span className="font-display text-lg font-bold uppercase tracking-wide text-paper sm:text-xl">
                Bloody Scissors — Megaclip
              </span>
            </button>
          )}
        </div>

        <div className="cut mt-4 flex items-center justify-between gap-4 border border-line px-5 py-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide sm:text-base">
            Bloody Scissors — Megaclip
          </h3>
          <a href="/video/megaclip.mp4" download className="btn-ghost !px-4 !py-2 text-xs">
            <DownloadIcon size="14px" />
            Скачать
          </a>
        </div>

        <p className="mt-10 text-center font-display text-lg font-semibold uppercase tracking-wide text-paper">
          Смотри до конца — будет больно
        </p>
      </div>
    </section>
  )
}
