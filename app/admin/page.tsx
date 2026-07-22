'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { SkullIcon, LockIcon, TrashIcon, MusicNoteIcon, BagIcon, BellIcon } from '../icons'
import type { Track, MerchItem, Order } from '@/lib/store'

const BADGE_OPTIONS = [
  { value: 'best', label: 'ЛУЧШИЙ' },
  { value: 'brutal', label: 'БРУТАЛЬНЫЙ' },
  { value: 'dark', label: 'МРАЧНЫЙ' },
  { value: 'meh', label: 'СЛАБЕЕ' },
  { value: 'new', label: 'НОВЫЙ РЕЛИЗ' },
  { value: 'first', label: 'ПЕРВЫЙ РЕЛИЗ' },
]

type Msg = { type: 'error' | 'success'; text: string } | null

function StyleLinks() {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" />
      <link rel="stylesheet" href="/admin.css" />
    </>
  )
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [tracks, setTracks] = useState<Track[]>([])
  const [merch, setMerch] = useState<MerchItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const [trackForm, setTrackForm] = useState({ name: '', desc: '', badgeVariant: 'new' })
  const [trackFile, setTrackFile] = useState<File | null>(null)
  const [trackMsg, setTrackMsg] = useState<Msg>(null)
  const [trackSubmitting, setTrackSubmitting] = useState(false)

  const [merchForm, setMerchForm] = useState({ name: '', desc: '', price: '' })
  const [merchFile, setMerchFile] = useState<File | null>(null)
  const [merchMsg, setMerchMsg] = useState<Msg>(null)
  const [merchSubmitting, setMerchSubmitting] = useState(false)

  const loadOrders = useCallback(async () => {
    const res = await fetch('/api/orders')
    if (res.ok) setOrders((await res.json()).orders || [])
  }, [])

  const loadData = useCallback(async () => {
    const [tRes, mRes, oRes] = await Promise.all([fetch('/api/tracks'), fetch('/api/merch'), fetch('/api/orders')])
    if (tRes.ok) setTracks((await tRes.json()).tracks || [])
    if (mRes.ok) setMerch((await mRes.json()).merch || [])
    if (oRes.ok) setOrders((await oRes.json()).orders || [])
  }, [])

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((data) => {
        setAuthed(Boolean(data.ok))
        setChecking(false)
        if (data.ok) loadData()
      })
      .catch(() => setChecking(false))
  }, [loadData])

  // Пока панель открыта, подтягиваем новые заказы без перезагрузки страницы —
  // это и есть "уведомление" о заказе, см. пуш-колокольчик в шапке.
  useEffect(() => {
    if (!authed) return
    const interval = setInterval(loadOrders, 15000)
    return () => clearInterval(interval)
  }, [authed, loadOrders])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setLoginError(data.error || 'Ошибка входа')
        return
      }
      setAuthed(true)
      setPassword('')
      loadData()
    } catch {
      setLoginError('Ошибка сети')
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setAuthed(false)
  }

  async function handleAddTrack(e: FormEvent) {
    e.preventDefault()
    setTrackMsg(null)
    if (!trackForm.name.trim() || !trackFile) {
      setTrackMsg({ type: 'error', text: 'Укажите название и выберите аудиофайл' })
      return
    }
    setTrackSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('name', trackForm.name)
      fd.set('desc', trackForm.desc)
      fd.set('badgeVariant', trackForm.badgeVariant)
      fd.set('badge', BADGE_OPTIONS.find((b) => b.value === trackForm.badgeVariant)?.label || 'НОВЫЙ')
      fd.set('file', trackFile)
      const res = await fetch('/api/tracks', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setTrackMsg({ type: 'error', text: data.error || 'Ошибка добавления' })
        return
      }
      setTracks((prev) => [...prev, data.track])
      setTrackForm({ name: '', desc: '', badgeVariant: 'new' })
      setTrackFile(null)
      const fileInput = document.getElementById('track-file-input') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      setTrackMsg({ type: 'success', text: 'Трек добавлен' })
    } catch {
      setTrackMsg({ type: 'error', text: 'Ошибка сети' })
    } finally {
      setTrackSubmitting(false)
    }
  }

  async function handleDeleteTrack(id: string) {
    if (!confirm('Удалить трек?')) return
    await fetch('/api/tracks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setTracks((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleAddMerch(e: FormEvent) {
    e.preventDefault()
    setMerchMsg(null)
    if (!merchForm.name.trim() || !merchForm.price.trim()) {
      setMerchMsg({ type: 'error', text: 'Укажите название и цену' })
      return
    }
    setMerchSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('name', merchForm.name)
      fd.set('desc', merchForm.desc)
      fd.set('price', merchForm.price)
      if (merchFile) fd.set('file', merchFile)
      const res = await fetch('/api/merch', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setMerchMsg({ type: 'error', text: data.error || 'Ошибка добавления' })
        return
      }
      setMerch((prev) => [...prev, data.item])
      setMerchForm({ name: '', desc: '', price: '' })
      setMerchFile(null)
      const fileInput = document.getElementById('merch-file-input') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      setMerchMsg({ type: 'success', text: 'Товар добавлен' })
    } catch {
      setMerchMsg({ type: 'error', text: 'Ошибка сети' })
    } finally {
      setMerchSubmitting(false)
    }
  }

  async function handleDeleteMerch(id: string) {
    if (!confirm('Удалить товар?')) return
    await fetch('/api/merch', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setMerch((prev) => prev.filter((i) => i.id !== id))
  }

  async function handleMarkOrderSeen(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, seen: true } : o)))
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('Удалить заказ?')) return
    await fetch('/api/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const unseenOrders = orders.filter((o) => !o.seen).length

  if (checking) {
    return (
      <div className="admin-shell">
        <StyleLinks />
        <div className="admin-loading">ЗАГРУЗКА...</div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="admin-shell">
        <StyleLinks />
        <div className="admin-login-wrap">
          <form className="admin-login-panel glass-panel admin-login-form" onSubmit={handleLogin}>
            <LockIcon size="50px" />
            <h1 className="admin-login-title">ВХОД В АДМИНКУ</h1>
            {loginError && <div className="admin-msg admin-msg--error">{loginError}</div>}
            <div className="admin-field">
              <label className="admin-label" htmlFor="admin-password">Пароль</label>
              <input
                id="admin-password"
                type="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit" className="btn" disabled={loggingIn}>
              {loggingIn ? 'ВХОЖУ...' : 'ВОЙТИ'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <StyleLinks />
      <header className="admin-topbar">
        <div className="admin-brand">
          <SkullIcon size="24px" />
          BLOODY SCISSORS — АДМИНКА
          <span className="admin-bell-wrap">
            <BellIcon size="20px" />
            {unseenOrders > 0 && <span className="admin-bell-badge">{unseenOrders}</span>}
          </span>
        </div>
        <div className="admin-actions">
          <a href="/" className="btn">НА САЙТ</a>
          <a href="/merch" className="btn">МАГАЗИН</a>
          <button className="btn" onClick={handleLogout}>ВЫЙТИ</button>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-section admin-section--orders">
          <h2 className="admin-section-title"><BellIcon size="0.9em" /> ЗАКАЗЫ{unseenOrders > 0 ? ` (${unseenOrders} новых)` : ''}</h2>
          <p className="admin-section-hint">Заказы из магазина «Мерч» — контактные данные покупателя для связи и оплаты.</p>

          <div className="admin-list admin-list--orders">
            {orders.length === 0 && <div className="admin-empty">Пока нет заказов</div>}
            {orders.map((o) => (
              <div className={`admin-order-item${o.seen ? '' : ' admin-order-item--unseen'}`} key={o.id}>
                <div className="admin-order-top">
                  <div>
                    <div className="admin-order-item-title">{o.itemName}</div>
                    <div className="admin-order-item-price">{o.itemPrice}</div>
                  </div>
                  <div className="admin-order-time">{new Date(o.createdAt).toLocaleString('ru-RU')}</div>
                </div>
                <div className="admin-order-fields">
                  <div><b>ФИО:</b> {o.fio}</div>
                  <div><b>Телефон:</b> {o.phone}</div>
                  <div><b>Индекс:</b> {o.postalCode}</div>
                  <div><b>Почта:</b> {o.email}</div>
                </div>
                <div className="admin-order-actions">
                  {!o.seen && <button className="btn" onClick={() => handleMarkOrderSeen(o.id)}>ПРОЧИТАНО</button>}
                  <button className="admin-item-delete" onClick={() => handleDeleteOrder(o.id)} aria-label="Удалить">
                    <TrashIcon size="14px" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="admin-grid">
          <section className="admin-section">
            <h2 className="admin-section-title"><MusicNoteIcon size="0.9em" /> ТРЕКИ</h2>
            <p className="admin-section-hint">Добавленные треки сразу появляются в разделе «Треки» на главной.</p>

            <form className="admin-form" onSubmit={handleAddTrack}>
              {trackMsg && <div className={`admin-msg admin-msg--${trackMsg.type}`}>{trackMsg.text}</div>}
              <div className="admin-field">
                <label className="admin-label">Название</label>
                <input className="admin-input" value={trackForm.name} onChange={(e) => setTrackForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Описание</label>
                <textarea className="admin-textarea" value={trackForm.desc} onChange={(e) => setTrackForm((f) => ({ ...f, desc: e.target.value }))} maxLength={400} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Бейдж</label>
                <select className="admin-select" value={trackForm.badgeVariant} onChange={(e) => setTrackForm((f) => ({ ...f, badgeVariant: e.target.value }))}>
                  {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-label">Аудиофайл (mp3/wav/ogg, до 25 МБ)</label>
                <input id="track-file-input" type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg" className="admin-file" onChange={(e) => setTrackFile(e.target.files?.[0] || null)} required />
              </div>
              <button type="submit" className="btn" disabled={trackSubmitting}>{trackSubmitting ? 'ЗАГРУЖАЮ...' : 'ДОБАВИТЬ ТРЕК'}</button>
            </form>

            <div className="admin-list">
              {tracks.length === 0 && <div className="admin-empty">Пока нет добавленных треков</div>}
              {tracks.map((t) => (
                <div className="admin-item" key={t.id}>
                  <div className="admin-item-thumb"><MusicNoteIcon size="18px" /></div>
                  <div className="admin-item-body">
                    <div className="admin-item-name">{t.name}</div>
                    <audio className="admin-item-audio" src={t.src} controls preload="none" />
                  </div>
                  <button className="admin-item-delete" onClick={() => handleDeleteTrack(t.id)} aria-label="Удалить">
                    <TrashIcon size="14px" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-section">
            <h2 className="admin-section-title"><BagIcon size="0.9em" /> ТОВАРЫ</h2>
            <p className="admin-section-hint">Добавленные товары сразу появляются на странице «Магазин».</p>

            <form className="admin-form" onSubmit={handleAddMerch}>
              {merchMsg && <div className={`admin-msg admin-msg--${merchMsg.type}`}>{merchMsg.text}</div>}
              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-label">Название</label>
                  <input className="admin-input" value={merchForm.name} onChange={(e) => setMerchForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Цена</label>
                  <input className="admin-input" value={merchForm.price} onChange={(e) => setMerchForm((f) => ({ ...f, price: e.target.value }))} placeholder="1500 ₽" maxLength={30} required />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Описание</label>
                <textarea className="admin-textarea" value={merchForm.desc} onChange={(e) => setMerchForm((f) => ({ ...f, desc: e.target.value }))} maxLength={400} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Фото (jpg/png/webp, до 8 МБ)</label>
                <input id="merch-file-input" type="file" accept="image/jpeg,image/png,image/webp" className="admin-file" onChange={(e) => setMerchFile(e.target.files?.[0] || null)} />
              </div>
              <button type="submit" className="btn" disabled={merchSubmitting}>{merchSubmitting ? 'ЗАГРУЖАЮ...' : 'ДОБАВИТЬ ТОВАР'}</button>
            </form>

            <div className="admin-list">
              {merch.length === 0 && <div className="admin-empty">Пока нет добавленных товаров</div>}
              {merch.map((item) => (
                <div className="admin-item" key={item.id}>
                  <div className="admin-item-thumb" style={item.image ? { backgroundImage: `url('${item.image}')` } : undefined}>
                    {!item.image && <BagIcon size="18px" />}
                  </div>
                  <div className="admin-item-body">
                    <div className="admin-item-name">{item.name}</div>
                    <div className="admin-item-sub">{item.price}</div>
                  </div>
                  <button className="admin-item-delete" onClick={() => handleDeleteMerch(item.id)} aria-label="Удалить">
                    <TrashIcon size="14px" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
