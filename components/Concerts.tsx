import Image from 'next/image'
import { CalendarIcon, CrossIcon } from '@/app/icons'
import type { Concert } from '@/lib/store'

const MONTHS = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК']

function ConcertCard({ concert }: { concert: Concert }) {
  const [, month, day] = concert.date.split('-')
  const monthLabel = MONTHS[Number(month) - 1] || ''

  return (
    <div className="cut group relative overflow-hidden border border-line transition-colors hover:border-red/40">
      <div className="relative aspect-[4/5]">
        {concert.poster ? (
          <Image
            src={concert.poster}
            alt={concert.venue}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-raised text-mute">
            <CalendarIcon size="36px" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

        <div className="cut-sm absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center bg-red text-ink">
          <span className="font-display text-xl font-bold leading-none">{day}</span>
          <span className="font-mono text-[10px] uppercase leading-none">{monthLabel}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-xl font-bold uppercase leading-tight">{concert.venue}</h3>
          <p className="text-sm text-paper/75">
            {concert.city}
            {/* Время хранится как есть, без пересчёта поясов: это местное время площадки. */}
            {concert.time ? ` · ${concert.time} по местному времени` : ''}
          </p>
          {concert.desc && <p className="mt-2 text-sm text-paper/60">{concert.desc}</p>}
          {concert.ticketUrl && (
            <a
              href={concert.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4 !px-5 !py-2 text-xs"
            >
              Билеты
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Concerts({ concerts }: { concerts: Concert[] }) {
  return (
    <section id="concerts" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-3 flex items-center gap-1.5"><CrossIcon size="15px" />06 / Туры</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Концерты</h2>
        <p className="panel mt-8 max-w-2xl p-6 text-paper/85">
          Ближайшие выступления. Следи за анонсами — новые даты появляются здесь.
        </p>

        {concerts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 border border-dashed border-line py-16 text-mute">
            <CalendarIcon size="32px" />
            <span className="font-mono text-xs uppercase tracking-widest2">Пока нет запланированных концертов</span>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {concerts.map((c) => (
              <ConcertCard key={c.id} concert={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
