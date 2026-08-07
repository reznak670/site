'use client'

import { BagIcon, MinusIcon, PlusIcon } from '@/app/icons'
import type { MerchItem } from '@/lib/store'
import { useCart } from './CartProvider'

export default function ProductGrid({ items }: { items: MerchItem[] }) {
  const { items: cartItems, addItem, setQty } = useCart()

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const inCart = cartItems.find((i) => i.id === item.id)
        return (
          <div key={item.id} className="cut glass flex flex-col overflow-hidden">
            <div
              className="relative aspect-square bg-ink-raised bg-cover bg-center"
              style={item.image ? { backgroundImage: `url('${item.image}')` } : undefined}
            >
              {!item.image && (
                <div className="flex h-full w-full items-center justify-center text-mute">
                  <BagIcon size="40px" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-display text-lg font-bold uppercase leading-tight">{item.name}</h3>
              {item.desc && <p className="line-clamp-2 text-sm text-paper/60">{item.desc}</p>}
              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                <span className="font-mono text-base text-paper">{item.price}</span>
                {inCart ? (
                  <div className="cut-sm flex items-center gap-3 border border-red/50 px-2 py-1.5">
                    <button
                      type="button"
                      aria-label="Меньше"
                      onClick={() => setQty(item.id, inCart.qty - 1)}
                      className="flex h-6 w-6 items-center justify-center text-paper/80 hover:text-red"
                    >
                      <MinusIcon size="12px" />
                    </button>
                    <span className="min-w-[1.5ch] text-center font-mono text-sm">{inCart.qty}</span>
                    <button
                      type="button"
                      aria-label="Больше"
                      onClick={() => setQty(item.id, inCart.qty + 1)}
                      className="flex h-6 w-6 items-center justify-center text-paper/80 hover:text-red"
                    >
                      <PlusIcon size="12px" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn !px-4 !py-2 text-xs"
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                  >
                    В корзину
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
