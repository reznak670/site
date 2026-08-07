import { CrossIcon, TelegramIcon, VkIcon } from '@/app/icons'

export default function Contacts() {
  return (
    <section id="contacts" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="eyebrow mb-3 flex items-center justify-center gap-1.5"><CrossIcon size="15px" />07 / Связь</p>
        <h2 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">На связи</h2>
        <p className="panel mx-auto mt-8 max-w-xl p-6 text-paper/85">
          Подписывайся на нас в соцсетях. Будь в курсе новых концертов, треков и кровавых анонсов.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="https://vk.com/scissorssband"
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex flex-col items-center gap-2 p-8 transition-colors hover:border-red/50"
          >
            <span className="text-red"><VkIcon size="32px" /></span>
            <span className="font-display text-lg font-semibold uppercase tracking-wide">Vkontakte</span>
            <span className="font-mono text-xs text-mute">@scissorssband</span>
          </a>
          <a
            href="https://t.me/scissorsbandd"
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex flex-col items-center gap-2 p-8 transition-colors hover:border-red/50"
          >
            <span className="text-red"><TelegramIcon size="32px" /></span>
            <span className="font-display text-lg font-semibold uppercase tracking-wide">Telegram</span>
            <span className="font-mono text-xs text-mute">@scissorsbandd</span>
          </a>
        </div>

        <div className="mt-16">
          <p className="font-display text-xl font-bold uppercase tracking-wide text-paper">
            Хватит трепаться — дуй на концерт!
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest2 text-red">КОЗААА</p>
        </div>
      </div>
    </section>
  )
}
