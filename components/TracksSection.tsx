'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CrossIcon, DownloadIcon, DropIcon, PauseIcon, PlayIcon, CloseIcon } from '@/app/icons'
import type { Track } from '@/lib/store'

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TracksSection({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentTrack = tracks.find((t) => t.id === currentId) || null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.src = currentTrack.src
    audio.play().catch(() => {})
    setPlaying(true)
    setCurrent(0)
    setDuration(0)
  }, [currentId]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleTrack(track: Track) {
    if (currentId === track.id) {
      const audio = audioRef.current
      if (!audio) return
      if (playing) {
        audio.pause()
        setPlaying(false)
      } else {
        audio.play().catch(() => {})
        setPlaying(true)
      }
      return
    }
    setCurrentId(track.id)
  }

  function closePlayer() {
    audioRef.current?.pause()
    setCurrentId(null)
    setPlaying(false)
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
  }

  return (
    <section id="tracks" className="relative py-24 sm:py-32">
      {/* Гигантские ножницы со сцены — фон секции. Снимок очень яркий (розовый
          свет), поэтому глушим прозрачностью и градиентом, иначе список треков
          на нём не читается. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image src="/img/scissors.jpg" alt="" fill sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/45 to-ink" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5">
        <p className="eyebrow mb-3 flex items-center gap-1.5"><CrossIcon size="15px" />03 / Дискография</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Треки</h2>
        <p className="panel mt-8 p-6 text-paper/85">
          Наше оружие массового поражения. Врубай на полную, и пусть соседи вызывают ОМОН.
        </p>

        <div className="cut mt-8 divide-y divide-line overflow-hidden border border-line">
          {tracks.map((track, i) => {
            const isActive = currentId === track.id
            return (
              <div
                key={track.id}
                className={`flex items-center gap-4 px-4 py-4 transition-colors sm:px-6 ${
                  isActive ? 'bg-red/10' : 'hover:bg-ink-raised/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTrack(track)}
                  aria-label={isActive && playing ? 'Пауза' : 'Играть'}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-red hover:text-red"
                >
                  {isActive && playing ? <PauseIcon size="15px" /> : <PlayIcon size="15px" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className={`font-display text-lg font-semibold uppercase ${isActive ? 'text-red-bright' : 'text-paper'}`}>
                      {track.name}
                    </h3>
                  </div>
                </div>

                <span className="hidden font-mono text-xs text-mute sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <a
                  href={track.src}
                  download
                  aria-label="Скачать трек"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-mute transition-colors hover:text-paper"
                >
                  <DownloadIcon size="16px" />
                </a>
              </div>
            )
          })}

          {tracks.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-14 text-mute">
              <DropIcon size="30px" />
              <p className="font-mono text-xs uppercase tracking-widest2">Треки скоро появятся</p>
            </div>
          )}
        </div>

        <p className="mt-10 text-center font-display text-lg font-semibold uppercase tracking-wide text-paper">
          Врубай на полную — разрушай тишину
        </p>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />

      {currentTrack && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-red/20 bg-ink/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => toggleTrack(currentTrack)}
              aria-label={playing ? 'Пауза' : 'Играть'}
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red text-ink"
            >
              {playing ? <PauseIcon size="15px" /> : <PlayIcon size="15px" />}
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold uppercase">{currentTrack.name}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="font-mono text-[10px] text-mute">{formatTime(current)}</span>
                <div
                  className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-line"
                  onClick={seek}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-red"
                    style={{ width: `${duration ? (current / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-mute">{formatTime(duration)}</span>
              </div>
            </div>

            <a
              href={currentTrack.src}
              download
              aria-label="Скачать трек"
              className="hidden h-9 w-9 flex-none items-center justify-center rounded-full text-mute transition-colors hover:text-paper sm:flex"
            >
              <DownloadIcon size="16px" />
            </a>
            <button
              type="button"
              onClick={closePlayer}
              aria-label="Остановить"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-mute transition-colors hover:text-paper"
            >
              <CloseIcon size="16px" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
