import Image from 'next/image'

const DISCLAIMERS = [
  '[ВЕСЬ ТЕКСТ СВЕРХУ ЯВЛЯЕТСЯ ВЫДУМКОЙ, ТАК ЖЕ ВСЕ ЭТО ПРОИСХОДИТ ТОЛЬКО В ГТА РП, И СГЕНЕРИРОВАНО В НЕЙРОСЕТИ, ВСЕ СОВПАДЕНИЯ НЕ РЕАЛЬНЫ]',
  '[НА САМОМ ДЕЛЕ МЫ БЕСПОКОИМСЯ ЗА КАЖДОГО ЧЕЛОВЕКА ПРИШЕДШЕГО НА КОНЦЕРТ, ПРОДВИГАЯ ТОЛЬКО ДОБРО И ПОЗИТИВ]',
  '[УПОТРЕБЛЕНИЕ АЛКОГОЛЯ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ]',
  '[ТАК ЖЕ ВСЕ ВЫСКАЗЫВАНИЯ ЯВЛЯЮТСЯ ТОЛЬКО ХУДОЖЕСТВЕННЫМ ОБРАЗОМ]',
]

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <Image src="/img/we.jpg" alt="" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/85" />
      </div>

      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow mb-3">01 / О группе</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Кто мы?</h2>

        <div className="glass mt-8 p-6 sm:p-8">
          <p className="text-lg leading-relaxed text-paper/90">
            На каждого в этом городе у нас найдётся компромат. Мы не шепчемся по углам и не шантажируем —
            мы выводим это на сцену и режём звуковым барьером в клочья, вгоняя лезвия прямо тебе в уши.
            Bloody Scissors не устраивают шоу. То, что ты услышишь, — показания под присягой, только вместо
            присяги кровь. Пошла носом? Не беда — мы принимаем кровавые ванны каждый вечер, так что твоя
            царапина для нас как умыться с утра перед тем как пить. Хватит бояться, что тебя узнают. Мы уже
            знаем, кто ты. Приходи и убедись сам.
          </p>
        </div>

        <div className="mt-6 space-y-1">
          {DISCLAIMERS.map((line) => (
            <p key={line} className="font-mono text-[11px] leading-relaxed text-mute/70">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
