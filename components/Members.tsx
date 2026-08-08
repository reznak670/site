import Image from 'next/image'
import { CrossIcon } from '@/app/icons'

type Member = {
  index: string
  name: string
  role: string
  bio: string
  quote: string
  photo?: string
}

const MEMBERS: Member[] = [
  { index: '01', name: 'АРТУР', role: 'Вокал', photo: '/img/artur.jpg', bio: 'Глотка Сургута. Самый лучший вокалист андеграунда. Его голос вырывается из преисподней, раздирая тишину на куски.', quote: '«Мой голос — твоё кровотечение»' },
  { index: '02', name: 'ДАМИР', role: 'Бас-гитара', photo: '/img/damir.jpg', bio: 'Низкочастотный убийца. В своём деле ему нет равных. Его бас выворачивает внутренности и рушит фундамент.', quote: '«Твой позвоночник резонирует»' },
  { index: '03', name: 'ГОША', role: 'Соло-гитара', photo: '/img/gosha.jpg', bio: 'Лезвие #1. Соло — контрольный выстрел в голову. Вдвоём с Костей они смертоносный дуэт.', quote: '«Два грифа — двойное кровопускание»' },
  { index: '04', name: 'КОСТЯ', role: 'Ритм-гитара', photo: '/img/kostya.jpg', bio: 'Лезвие #2. Гитарные рифы разрывают сцену. Плетёт звуковую паутину, из которой не выбраться.', quote: '«Рифф — удар хлыстом»' },
]

const MEMBERS_2: Member[] = [
  { index: '06', name: 'ГЛЕБ', role: 'Барабаны', photo: '/img/gleb.jpg', bio: 'Один из самых быстрых барабанщиков Сургутской сцены. Палочки исчезают из виду.', quote: '«Скорость убивает тишину»' },
  { index: '07', name: 'ВЛАД', role: 'Вокал', photo: '/img/vlad.jpg', bio: 'Голос фобии. Лидер группы Phobia. Холодный ужас, проникающий в подкорку.', quote: '«У страха есть голос»' },
]

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="cut group relative aspect-[3/4] overflow-hidden border border-line transition-colors duration-300 hover:border-red/50">
      {member.photo && (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Подложка только под подпись: верх карточки оставляем открытым, чтобы
          рисунок было видно, а имя с ролью не тонули в его светлых местах. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
      {/* max-h-full: подпись прижата к низу карточки, и без ограничения длинная
          биография выталкивала имя с ролью за верхний край. */}
      <div className="absolute inset-x-0 bottom-0 max-h-full overflow-hidden p-3 sm:p-5">
        <span className="eyebrow">{member.index}</span>
        <h3 className="font-display text-lg font-bold uppercase leading-none sm:text-2xl">{member.name}</h3>
        <p className="mt-1 text-xs font-medium text-red-bright sm:text-sm">{member.role}</p>
        {/* Биография раскрывается по наведению, а на тач-экранах наведения нет —
            там она только занимала место и ломала вёрстку карточки. */}
        <p className="mt-2 hidden text-sm leading-snug text-paper/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
          {member.bio}
        </p>
        <p className="mt-1.5 font-mono text-[10px] italic leading-snug text-mute sm:mt-2 sm:text-xs">
          {member.quote}
        </p>
      </div>
    </div>
  )
}

export default function Members() {
  return (
    <section id="members" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow mb-3 flex items-center gap-1.5"><CrossIcon size="15px" />02 / Состав</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Состав</h2>
        <p className="panel mt-8 max-w-2xl p-6 text-paper/85">
          Каждый из нас — острое лезвие, вонзающееся в твои уши. Мы — хирургический инструмент по
          расчленению тишины. Знакомься с теми, кто заставит твою кровь кипеть.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MEMBERS.map((m) => <MemberCard key={m.index} member={m} />)}
          {MEMBERS_2.map((m) => <MemberCard key={m.index} member={m} />)}
        </div>

        <div className="mt-14 text-center">
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-paper">
            Шесть лезвий — одна кровавая баня
          </p>
        </div>
      </div>
    </section>
  )
}
