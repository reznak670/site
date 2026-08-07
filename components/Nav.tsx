'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  BagIcon,
  CalendarIcon,
  FilmIcon,
  FlameIcon,
  HomeIcon,
  MailIcon,
  MenuIcon,
  MusicNoteIcon,
  SkullIcon,
  VideoIcon,
  CloseIcon,
} from '@/app/icons'

const LINKS = [
  { id: 'hero', label: 'Главная', icon: HomeIcon },
  { id: 'about', label: 'Кто мы', icon: FlameIcon },
  { id: 'members', label: 'Состав', icon: SkullIcon },
  { id: 'tracks', label: 'Треки', icon: MusicNoteIcon },
  { id: 'shorts', label: 'Шортсы', icon: FilmIcon },
  { id: 'clip', label: 'Клип', icon: VideoIcon },
  { id: 'concerts', label: 'Концерты', icon: CalendarIcon },
  { id: 'contacts', label: 'Контакты', icon: MailIcon },
]

export default function Nav() {
  const pathname = usePathname()
  const [active, setActive] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((el) => observer.observe(el))

    const sentinel = document.getElementById('hero')
    const scrollObserver = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 }
    )
    if (sentinel) scrollObserver.observe(sentinel)

    return () => {
      observer.disconnect()
      scrollObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-red/15 bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#hero" className="flex items-center" aria-label="Bloody Scissors">
            <Image src="/img/logo.png" alt="Bloody Scissors" width={220} height={220} priority className="h-20 w-auto object-contain sm:h-24" />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                  active === link.id ? 'text-red' : 'text-paper/65 hover:text-paper'
                }`}
              >
                <link.icon size="14px" />
                {link.label}
              </a>
            ))}
            <a
              href="/merch"
              className="cut-sm ml-2 flex items-center gap-1.5 border border-red/60 bg-red/10 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-red hover:text-ink"
            >
              <BagIcon size="14px" />
              Мерч
            </a>
          </nav>

          <button
            type="button"
            className="cut-sm flex h-10 w-10 items-center justify-center border border-line lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
          >
            {open ? <CloseIcon size="18px" /> : <MenuIcon size="18px" />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-ink transition-opacity duration-200 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="scanline-overlay flex h-full flex-col items-center justify-center gap-2 px-6">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 font-display text-xl font-semibold uppercase tracking-wide ${
                active === link.id ? 'text-red' : 'text-paper/85'
              }`}
            >
              <link.icon size="18px" />
              {link.label}
            </a>
          ))}
          <a
            href="/merch"
            onClick={() => setOpen(false)}
            className="cut mt-4 flex items-center gap-2 border border-red/70 bg-red/10 px-6 py-3 font-display text-lg font-semibold uppercase tracking-wide"
          >
            <BagIcon size="18px" />
            Мерч
          </a>
        </div>
      </div>
    </>
  )
}
