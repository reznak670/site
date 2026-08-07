'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDownIcon, CrossIcon } from '@/app/icons'

function formatTimestamp(totalSeconds: number) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function ViewfinderCorners() {
  const base = 'absolute h-6 w-6 border-paper/50 sm:h-8 sm:w-8'
  return (
    <>
      <span className={`${base} left-4 top-20 border-l-2 border-t-2 sm:left-6 sm:top-24`} aria-hidden />
      <span className={`${base} right-4 top-20 border-r-2 border-t-2 sm:right-6 sm:top-24`} aria-hidden />
      <span className={`${base} bottom-20 left-4 border-b-2 border-l-2 sm:bottom-24 sm:left-6`} aria-hidden />
      <span className={`${base} bottom-20 right-4 border-b-2 border-r-2 sm:bottom-24 sm:right-6`} aria-hidden />
    </>
  )
}

export default function Hero() {
  // Desktop gets the autoplay background video; mobile gets a static poster so
  // phones never pull down a multi-MB mp4 just to load the hero section.
  const [showVideo, setShowVideo] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setShowVideo(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setShowVideo(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/img/poster.jpg"
        >
          <source src="/video/concert.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image src="/img/poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      <div className="scanline-overlay absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/60 to-ink" />

      {/* VHS tracking mistrack — mostly invisible, jumps briefly and rarely. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/3 z-10 h-6 origin-center bg-gradient-to-r from-transparent via-paper/70 to-transparent opacity-0 animate-tracking"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-2/3 z-10 h-4 origin-center bg-gradient-to-r from-transparent via-red/70 to-transparent opacity-0 animate-tracking"
        style={{ animationDelay: '2.3s' }}
        aria-hidden
      />

      <ViewfinderCorners />

      <div className="pointer-events-none absolute left-5 top-20 z-10 flex items-center gap-2 sm:left-8 sm:top-24">
        <span className="h-2 w-2 rounded-full bg-red animate-blink" aria-hidden />
        <span className="font-mono text-xs uppercase tracking-widest2 text-paper/80">REC</span>
        <span className="font-mono text-xs text-paper/60">{formatTimestamp(elapsed)}</span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 text-center">
        <h1
          data-text="BLOODY SCISSORS"
          className="glitch font-horror text-[13vw] uppercase leading-[0.85] tracking-tight text-paper drop-shadow-[0_0_40px_rgba(212,16,42,0.55)] sm:text-7xl md:text-8xl lg:text-9xl"
        >
          <span className="text-red">B</span>LOODY <span className="text-red">S</span>CISSORS
        </h1>
        <p className="mt-6 flex items-center gap-3 font-mono text-sm uppercase tracking-widest2 text-red sm:text-base">
          <CrossIcon size="1.2em" />
          Сургутский ньюметал
          <CrossIcon size="1.2em" />
        </p>
      </div>

      <a
        href="#about"
        aria-label="Листать дальше"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-paper/70"
      >
        <ChevronDownIcon size="28px" />
      </a>
    </section>
  )
}
