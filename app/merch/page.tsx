import type { Metadata } from 'next'
import { getMerch } from '@/lib/store'
import { ScissorsIcon, BagIcon } from '../icons'
import MerchGrid from './MerchGrid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Bloody Scissors — Мерч',
  description: 'Official merch магазин группы Bloody Scissors. Одежда и атрибутика.',
}

export default async function MerchPage() {
  const items = await getMerch()

  return (
    <div className="merch-shell">
      <link rel="stylesheet" href="/styles.css" />
      <link rel="stylesheet" href="/admin.css" />
      <link rel="stylesheet" href="/merch.css" />

      <header className="merch-nav">
        <div className="merch-nav-inner">
          <a href="/" className="merch-logo">
            <ScissorsIcon size="26px" />
            BLOODY SCISSORS
          </a>
          <a href="/" className="btn merch-back-btn">← НА САЙТ</a>
        </div>
      </header>

      <main className="merch-main">
        <h1 className="merch-title">МЕРЧ</h1>
        <p className="merch-subtitle">Одежда и атрибутика банды.</p>

        {items.length === 0 ? (
          <div className="merch-empty glass-panel">
            <BagIcon size="50px" />
            <p>Товаров пока нет. Загляни позже — мы уже точим лезвия для нового дропа.</p>
          </div>
        ) : (
          <MerchGrid items={items} />
        )}
      </main>
    </div>
  )
}
