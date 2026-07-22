'use client'

import { useState, type FormEvent } from 'react'
import { BagIcon, CardIcon, CheckIcon } from '../icons'
import type { MerchItem } from '@/lib/store'

type Step = 'form' | 'payment' | 'success'
type FormState = { fio: string; phone: string; postalCode: string; email: string }

const EMPTY_FORM: FormState = { fio: '', phone: '', postalCode: '', email: '' }

const PHONE_RE = /^[0-9+()\-\s]{5,20}$/
const POSTAL_RE = /^[0-9]{4,10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MerchGrid({ items }: { items: MerchItem[] }) {
  const [activeItem, setActiveItem] = useState<MerchItem | null>(null)
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function openOrder(item: MerchItem) {
    setActiveItem(item)
    setStep('form')
    setForm(EMPTY_FORM)
    setError('')
    document.body.style.overflow = 'hidden'
  }

  function closeOrder() {
    setActiveItem(null)
    document.body.style.overflow = ''
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
    setStep('payment')
  }

  async function handlePay() {
    if (!activeItem) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: activeItem.id,
          itemName: activeItem.name,
          itemPrice: activeItem.price,
          ...form,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Не удалось оформить заказ')
        return
      }
      setStep('success')
    } catch {
      setError('Ошибка сети, попробуйте ещё раз')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="merch-grid">
        {items.map((item) => (
          <div className="merch-card glass-panel" key={item.id}>
            <div
              className="merch-card-media"
              style={item.image ? { backgroundImage: `url('${item.image}')` } : undefined}
            >
              {!item.image && <BagIcon size="40px" />}
            </div>
            <div className="merch-card-body">
              <h3 className="merch-card-name">{item.name}</h3>
              {item.desc && <p className="merch-card-desc">{item.desc}</p>}
              <div className="merch-card-footer">
                <span className="merch-card-price">{item.price}</span>
                <button type="button" className="btn merch-order-btn" onClick={() => openOrder(item)}>
                  ЗАКАЗАТЬ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeItem && (
        <div className="order-modal">
          <div className="order-modal-backdrop" onClick={closeOrder} />
          <div className="order-modal-panel glass-panel">
            <button type="button" className="btn order-modal-close" onClick={closeOrder} aria-label="Закрыть">×</button>

            <div className="order-modal-item">
              <div
                className="order-modal-item-thumb"
                style={activeItem.image ? { backgroundImage: `url('${activeItem.image}')` } : undefined}
              >
                {!activeItem.image && <BagIcon size="24px" />}
              </div>
              <div>
                <div className="order-modal-item-name">{activeItem.name}</div>
                <div className="order-modal-item-price">{activeItem.price}</div>
              </div>
            </div>

            {step === 'form' && (
              <form className="order-form" onSubmit={handleFormSubmit}>
                <h3 className="order-step-title">ОФОРМЛЕНИЕ ЗАКАЗА</h3>
                {error && <div className="admin-msg admin-msg--error">{error}</div>}
                <div className="admin-field">
                  <label className="admin-label">ФИО</label>
                  <input className="admin-input" value={form.fio} onChange={(e) => setForm((f) => ({ ...f, fio: e.target.value }))} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Номер телефона</label>
                  <input className="admin-input" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+7 900 000-00-00" required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Почтовый индекс</label>
                  <input className="admin-input" value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} placeholder="628400" required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Электронная почта</label>
                  <input className="admin-input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                </div>
                <button type="submit" className="btn">ДАЛЕЕ → ОПЛАТА</button>
              </form>
            )}

            {step === 'payment' && (
              <div className="order-form">
                <h3 className="order-step-title"><CardIcon size="0.9em" /> ОПЛАТА</h3>
                {error && <div className="admin-msg admin-msg--error">{error}</div>}
                <p className="order-payment-hint">
                  Онлайн-оплата скоро появится. Сейчас заказ оформляется без предоплаты — мы свяжемся с тобой, чтобы договориться об оплате.
                </p>
                <button type="button" className="btn" onClick={handlePay} disabled={submitting}>
                  {submitting ? 'ОФОРМЛЯЮ...' : 'ОПЛАТИТЬ'}
                </button>
                <button type="button" className="order-back-link" onClick={() => setStep('form')}>← Назад</button>
              </div>
            )}

            {step === 'success' && (
              <div className="order-success">
                <CheckIcon size="50px" />
                <h3 className="order-step-title">ЗАКАЗ ОФОРМЛЕН</h3>
                <p>Мы получили твои данные и скоро свяжемся для подтверждения и оплаты. КОЗААА!</p>
                <button type="button" className="btn" onClick={closeOrder}>ЗАКРЫТЬ</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
