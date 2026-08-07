'use client'

import { useState, type FormEvent } from 'react'
import { BagIcon, CheckIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from '@/app/icons'
import { useCart } from './CartProvider'

type Step = 'cart' | 'form' | 'success'
type FormState = { fio: string; phone: string; postalCode: string; email: string }

const EMPTY_FORM: FormState = { fio: '', phone: '', postalCode: '', email: '' }

const PHONE_RE = /^[0-9+()\-\s]{5,20}$/
const POSTAL_RE = /^[0-9]{4,10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Cart() {
  const { items, totalCount, setQty, removeItem, clear } = useCart()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('cart')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function openCart() {
    setStep('cart')
    setError('')
    setOpen(true)
    document.body.style.overflow = 'hidden'
  }

  function close() {
    setOpen(false)
    document.body.style.overflow = ''
  }

  function goToForm() {
    if (items.length === 0) return
    setForm(EMPTY_FORM)
    setError('')
    setStep('form')
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.fio.trim() || !form.phone.trim() || !form.postalCode.trim() || !form.email.trim()) {
      setError('Заполните все поля')
      return
    }
    if (!PHONE_RE.test(form.phone.trim())) {
      setError('Проверьте номер телефона')
      return
    }
    if (!POSTAL_RE.test(form.postalCode.trim())) {
      setError('Проверьте почтовый индекс')
      return
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError('Проверьте почту')
      return
    }
    submitOrder()
  }

  async function submitOrder() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ itemId: i.id, itemName: i.name, itemPrice: i.price, qty: i.qty })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Не удалось оформить заказ')
        return
      }
      clear()
      setStep('success')
    } catch {
      setError('Ошибка сети, попробуйте ещё раз')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openCart}
        className="btn fixed bottom-5 right-5 z-40 !rounded-none shadow-glow"
        aria-label="Корзина"
      >
        <BagIcon size="16px" />
        Корзина{totalCount > 0 ? ` (${totalCount})` : ''}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={close} />
          <div className="glass absolute inset-x-4 bottom-4 top-auto max-h-[85vh] overflow-y-auto p-6 sm:inset-x-auto sm:right-6 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-y-1/2">
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-mute hover:text-paper"
            >
              <CloseIcon size="16px" />
            </button>

            {step === 'cart' && (
              <>
                <h3 className="font-display text-xl font-bold uppercase">Корзина</h3>
                {items.length === 0 ? (
                  <p className="mt-6 text-sm text-mute">Пока пусто. Выбери что-нибудь из мерча.</p>
                ) : (
                  <div className="mt-6 flex flex-col gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 border-b border-line pb-4">
                        <div
                          className="h-14 w-14 flex-none bg-ink-raised bg-cover bg-center"
                          style={item.image ? { backgroundImage: `url('${item.image}')` } : undefined}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold uppercase">{item.name}</p>
                          <p className="font-mono text-xs text-paper">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Меньше"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center border border-line text-paper/80 hover:border-red hover:text-red"
                          >
                            <MinusIcon size="11px" />
                          </button>
                          <span className="min-w-[1.5ch] text-center font-mono text-sm">{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Больше"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center border border-line text-paper/80 hover:border-red hover:text-red"
                          >
                            <PlusIcon size="11px" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Удалить"
                          onClick={() => removeItem(item.id)}
                          className="text-mute hover:text-red"
                        >
                          <TrashIcon size="14px" />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="btn mt-2" onClick={goToForm}>
                      Оформить заявку
                    </button>
                  </div>
                )}
              </>
            )}

            {step === 'form' && (
              <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                <h3 className="font-display text-xl font-bold uppercase">Оформление заявки</h3>
                {error && <div className="cut-sm border border-red/50 bg-red/10 px-4 py-2 text-sm text-red">{error}</div>}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest2 text-mute">ФИО</label>
                  <input className="field-input" value={form.fio} onChange={(e) => setForm((f) => ({ ...f, fio: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest2 text-mute">Телефон</label>
                  <input className="field-input" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+7 900 000-00-00" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest2 text-mute">Почтовый индекс</label>
                  <input className="field-input" value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} placeholder="628400" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest2 text-mute">Email</label>
                  <input className="field-input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                </div>
                <p className="text-xs text-paper/60">
                  Онлайн-оплата пока не подключена — мы свяжемся с тобой, чтобы согласовать оплату и доставку.
                </p>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'ОТПРАВЛЯЮ...' : 'ОТПРАВИТЬ ЗАЯВКУ'}
                </button>
                <button type="button" onClick={() => setStep('cart')} className="font-mono text-xs uppercase tracking-widest2 text-mute hover:text-paper">
                  ← Назад в корзину
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="text-paper"><CheckIcon size="48px" /></span>
                <h3 className="font-display text-xl font-bold uppercase">Заявка отправлена</h3>
                <p className="text-sm text-paper/75">Мы получили твои данные и скоро свяжемся для подтверждения и оплаты. КОЗААА!</p>
                <button type="button" className="btn mt-2" onClick={close}>
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
