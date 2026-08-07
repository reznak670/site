import type { Metadata } from 'next'
import { getMerch } from '@/lib/store'
import { BagIcon, CrossIcon, ScissorsIcon } from '../icons'
import { CartProvider } from '@/components/merch/CartProvider'
import ProductGrid from '@/components/merch/ProductGrid'
import Cart from '@/components/merch/Cart'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Bloody Scissors — Мерч',
  description: 'Official merch магазин группы Bloody Scissors. Одежда и атрибутика.',
}

export default async function MerchPage() {
  const items = await getMerch()

  return (
    <CartProvider>
      <div className="min-h-screen pt-16">
        <header className="border-b border-line">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <a href="/" className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
              <span className="text-red"><ScissorsIcon size="22px" /></span>
              BLOODY SCISSORS
            </a>
            <a href="/" className="btn-ghost !px-4 !py-2 text-xs">
              ← На сайт
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-16">
          <p className="eyebrow mb-3 flex items-center gap-1.5"><CrossIcon size="15px" />Магазин</p>
          <h1 className="font-horror text-4xl uppercase tracking-wide sm:text-5xl">Мерч</h1>
          <p className="mt-2 text-paper/70">Одежда и атрибутика банды.</p>

          {items.length === 0 ? (
            <div className="glass mt-12 flex flex-col items-center gap-3 p-16 text-center text-mute">
              <BagIcon size="42px" />
              <p>Товаров пока нет. Загляни позже — мы уже точим лезвия для нового дропа.</p>
            </div>
          ) : (
            <div className="mt-12">
              <ProductGrid items={items} />
            </div>
          )}
        </main>

        <Cart />
      </div>
    </CartProvider>
  )
}
