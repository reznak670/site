'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, CloseIcon, CrossIcon, MuteIcon, PlayIcon, ScissorsIcon, SoundIcon } from '@/app/icons'

type Short = { id: number; src: string }

const SHORTS: Short[] = [
  { id: 0, src: '/video/zhest.mp4' },
  { id: 1, src: '/video/krovavaya.mp4' },
  { id: 2, src: '/video/proshloe.mp4' },
  { id: 3, src: '/video/rr.mp4' },
]

// Превью берётся из самого ролика: фрагмент #t=0.1 заставляет браузер
// отмотать на 0.1 секунды и отрисовать этот кадр. Без него превью пустое —
// нулевой кадр многие браузеры (в первую очередь Safari) не рисуют.
function previewSrc(src: string): string {
  return `${src}#t=0.1`
}

function ShortThumb({ short, index, onOpen }: { short: Short; index: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Шортс ${index + 1}`}
      className="cut snap-item relative aspect-[9/16] w-[62vw] flex-none overflow-hidden border border-line text-left transition-colors hover:border-red/50 sm:w-56"
    >
      <video
        src={previewSrc(short.src)}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 text-red"><PlayIcon size="22px" /></span>
    </button>
  )
}

function StorySlide({ short, active, muted }: { short: Short; active: boolean; muted: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active])

  return (
    <div className="relative h-[100svh] w-full flex-none snap-start">
      {/* preload="metadata" вместо none — иначе до старта воспроизведения
          слайд остаётся чёрным прямоугольником вместо кадра из ролика. */}
      <video
        ref={ref}
        src={previewSrc(short.src)}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
    </div>
  )
}

export default function Shorts() {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  function openViewer(index: number) {
    setActiveIndex(index)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: activeIndex * window.innerHeight })
    })
    return () => {
      document.body.style.overflow = ''
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollTop / window.innerHeight)
    setActiveIndex(Math.min(SHORTS.length - 1, Math.max(0, idx)))
  }

  function goTo(delta: number) {
    const next = Math.min(SHORTS.length - 1, Math.max(0, activeIndex + delta))
    scrollRef.current?.scrollTo({ top: next * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section id="shorts" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-3 flex items-center gap-1.5"><CrossIcon size="15px" />04 / Видео</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Шортсы</h2>
        <p className="panel mt-8 max-w-2xl p-6 text-paper/85">
          Кровавые моменты с концертов и репетиций. Выбери видео и погрузись в ад.
        </p>

        <div className="no-scrollbar snap-row mt-8 flex gap-4 overflow-x-auto pb-2">
          {SHORTS.map((s, i) => (
            <ShortThumb key={s.id} short={s} index={i} onOpen={() => openViewer(i)} />
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-mute">
          <ScissorsIcon size="12px" />
          Тяни ленту рукой · жми, чтобы листать как в тиктоке
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ink">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto"
          >
            {SHORTS.map((s, i) => (
              <StorySlide key={s.id} short={s} active={open && activeIndex === i} muted={muted} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur"
            >
              <CloseIcon size="16px" />
            </button>
            <span className="pointer-events-auto rounded-full bg-ink/60 px-3 py-1 font-mono text-xs text-paper backdrop-blur">
              {activeIndex + 1} / {SHORTS.length}
            </span>
            <button
              type="button"
              onClick={() => setMuted((v) => !v)}
              aria-label="Звук"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur"
            >
              {muted ? <MuteIcon size="16px" /> : <SoundIcon size="16px" />}
            </button>
          </div>

          <div className="absolute bottom-6 right-4 hidden flex-col gap-3 sm:flex">
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Предыдущий"
              className="flex h-10 w-10 rotate-180 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur"
            >
              <ChevronDownIcon size="16px" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Следующий"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur"
            >
              <ChevronDownIcon size="16px" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
