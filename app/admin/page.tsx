'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { SkullIcon, LockIcon, TrashIcon, MusicNoteIcon, BagIcon, BellIcon, CalendarIcon } from '../icons'
import type { Track, MerchItem, Order, Concert } from '@/lib/store'
import { attachUpload } from '@/lib/uploadClient'
import CityAutocomplete from './CityAutocomplete'
import TimePicker from './TimePicker'
import DatePicker from './DatePicker'

type Msg = { type: 'error' | 'success'; text: string } | null

function Message({ msg }: { msg: Msg }) {
  if (!msg) return null
  return (
    <div
      className={`cut-sm border px-4 py-2 text-sm ${
        msg.type === 'error' ? 'border-red/50 bg-red/10 text-red' : 'border-paper/30 bg-white/5 text-paper'
      }`}
    >
      {msg.text}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] uppercase tracking-widest2 text-mute">{label}</label>
      {children}
    </div>
  )
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  // Настроен ли Vercel Blob: если да — файлы уходят в хранилище напрямую из
  // браузера, минуя лимит 4.5 МБ на тело запроса к серверной функции.
  const [blobEnabled, setBlobEnabled] = useState(false)

  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [tracks, setTracks] = useState<Track[]>([])
  const [merch, setMerch] = useState<MerchItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [concerts, setConcerts] = useState<Concert[]>([])

  const [trackForm, setTrackForm] = useState({ name: '', desc: '' })
  const [trackFile, setTrackFile] = useState<File | null>(null)
  const [trackMsg, setTrackMsg] = useState<Msg>(null)
  const [trackSubmitting, setTrackSubmitting] = useState(false)

  const [merchForm, setMerchForm] = useState({ name: '', desc: '', price: '' })
  const [merchFile, setMerchFile] = useState<File | null>(null)
  const [merchMsg, setMerchMsg] = useState<Msg>(null)
  const [merchSubmitting, setMerchSubmitting] = useState(false)

  const [concertForm, setConcertForm] = useState({ date: '', time: '', city: '', venue: '', ticketUrl: '', desc: '' })
  const [concertFile, setConcertFile] = useState<File | null>(null)
  const [concertMsg, setConcertMsg] = useState<Msg>(null)
  const [concertSubmitting, setConcertSubmitting] = useState(false)

  const loadOrders = useCallback(async () => {
    const res = await fetch('/api/orders')
    if (res.ok) setOrders((await res.json()).orders || [])
  }, [])

  const loadData = useCallback(async () => {
    const [tRes, mRes, oRes, cRes] = await Promise.all([fetch('/api/tracks'), fetch('/api/merch'), fetch('/api/orders'), fetch('/api/concerts')])
    if (tRes.ok) setTracks((await tRes.json()).tracks || [])
    if (mRes.ok) setMerch((await mRes.json()).merch || [])
    if (oRes.ok) setOrders((await oRes.json()).orders || [])
    if (cRes.ok) setConcerts((await cRes.json()).concerts || [])
  }, [])

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((data) => {
        setAuthed(Boolean(data.ok))
        setBlobEnabled(Boolean(data.blob))
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
      await attachUpload(fd, trackFile, 'audio', blobEnabled)
      const res = await fetch('/api/tracks', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setTrackMsg({ type: 'error', text: data.error || 'Ошибка добавления' })
        return
      }
      setTracks((prev) => [...prev, data.track])
      setTrackForm({ name: '', desc: '' })
      setTrackFile(null)
      const fileInput = document.getElementById('track-file-input') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      setTrackMsg({ type: 'success', text: 'Трек добавлен' })
    } catch (err) {
      setTrackMsg({ type: 'error', text: err instanceof Error ? err.message : 'Ошибка сети' })
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
      if (merchFile) await attachUpload(fd, merchFile, 'merch', blobEnabled)
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
    } catch (err) {
      setMerchMsg({ type: 'error', text: err instanceof Error ? err.message : 'Ошибка сети' })
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

  async function handleAddConcert(e: FormEvent) {
    e.preventDefault()
    setConcertMsg(null)
    if (!concertForm.date.trim() || !concertForm.city.trim() || !concertForm.venue.trim()) {
      setConcertMsg({ type: 'error', text: 'Укажите дату, город и площадку' })
      return
    }
    setConcertSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(concertForm).forEach(([key, val]) => fd.set(key, val))
      if (concertFile) await attachUpload(fd, concertFile, 'concert', blobEnabled)
      const res = await fetch('/api/concerts', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setConcertMsg({ type: 'error', text: data.error || 'Ошибка добавления' })
        return
      }
      setConcerts((prev) => [...prev, data.concert])
      setConcertForm({ date: '', time: '', city: '', venue: '', ticketUrl: '', desc: '' })
      setConcertFile(null)
      const fileInput = document.getElementById('concert-file-input') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      setConcertMsg({ type: 'success', text: 'Концерт добавлен' })
    } catch (err) {
      setConcertMsg({ type: 'error', text: err instanceof Error ? err.message : 'Ошибка сети' })
    } finally {
      setConcertSubmitting(false)
    }
  }

  async function handleDeleteConcert(id: string) {
    if (!confirm('Удалить концерт?')) return
    await fetch('/api/concerts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setConcerts((prev) => prev.filter((c) => c.id !== id))
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
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="font-mono text-xs uppercase tracking-widest2 text-mute">ЗАГРУЗКА...</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <form className="glass flex w-full max-w-sm flex-col items-center gap-4 p-8" onSubmit={handleLogin}>
          <span className="text-red"><LockIcon size="44px" /></span>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide">Вход в админку</h1>
          {loginError && <Message msg={{ type: 'error', text: loginError }} />}
          <div className="w-full">
            <Field label="Пароль">
              <input
                id="admin-password"
                type="password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </Field>
          </div>
          <button type="submit" className="btn w-full" disabled={loggingIn}>
            {loggingIn ? 'ВХОЖУ...' : 'ВОЙТИ'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink pb-20 pt-16">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-red/15 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
            <span className="text-red"><SkullIcon size="22px" /></span>
            BLOODY SCISSORS — АДМИНКА
            <span className="relative ml-1 text-mute">
              <BellIcon size="18px" />
              {unseenOrders > 0 && (
                <span className="cut-sm absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center bg-red px-1 font-mono text-[10px] text-ink">
                  {unseenOrders}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="btn-ghost !px-3 !py-2 text-xs">НА САЙТ</a>
            <a href="/merch" className="btn-ghost !px-3 !py-2 text-xs">МАГАЗИН</a>
            <button className="btn !px-3 !py-2 text-xs" onClick={handleLogout}>ВЫЙТИ</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="glass mb-10 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
            <BellIcon size="0.9em" /> Заказы{unseenOrders > 0 ? ` (${unseenOrders} новых)` : ''}
          </h2>
          <p className="mt-1 text-sm text-paper/60">Заявки из магазина «Мерч» — контактные данные покупателя для связи и оплаты.</p>

          <div className="mt-5 flex flex-col gap-3">
            {orders.length === 0 && <div className="font-mono text-xs uppercase tracking-widest2 text-mute">Пока нет заказов</div>}
            {orders.map((o) => (
              <div
                key={o.id}
                className={`cut border p-4 ${o.seen ? 'border-line' : 'border-red/40 bg-red/5'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    {o.items.map((item) => (
                      <div key={item.id} className="text-sm">
                        <span className="font-display font-semibold uppercase">{item.itemName}</span>
                        <span className="ml-2 font-mono text-xs text-paper">{item.itemPrice} × {item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="font-mono text-xs text-mute">{new Date(o.createdAt).toLocaleString('ru-RU')}</div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-paper/80 sm:grid-cols-2">
                  <div><b className="text-paper">ФИО:</b> {o.fio}</div>
                  <div><b className="text-paper">Телефон:</b> {o.phone}</div>
                  <div><b className="text-paper">Индекс:</b> {o.postalCode}</div>
                  <div><b className="text-paper">Почта:</b> {o.email}</div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {!o.seen && <button className="btn !px-3 !py-1.5 text-xs" onClick={() => handleMarkOrderSeen(o.id)}>ПРОЧИТАНО</button>}
                  <button className="text-mute hover:text-red" onClick={() => handleDeleteOrder(o.id)} aria-label="Удалить">
                    <TrashIcon size="14px" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="glass p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
              <MusicNoteIcon size="0.9em" /> Треки
            </h2>
            <p className="mt-1 text-sm text-paper/60">Добавленные треки сразу появляются в разделе «Треки» на главной.</p>

            <form className="mt-4 flex flex-col gap-3" onSubmit={handleAddTrack}>
              <Message msg={trackMsg} />
              <Field label="Название">
                <input className="field-input" value={trackForm.name} onChange={(e) => setTrackForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} required />
              </Field>
              <Field label="Описание">
                <textarea className="field-input" rows={3} value={trackForm.desc} onChange={(e) => setTrackForm((f) => ({ ...f, desc: e.target.value }))} maxLength={400} />
              </Field>
              <Field label="Аудиофайл (mp3/wav/ogg, до 25 МБ)">
                <input id="track-file-input" type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg" className="text-sm text-paper/80 file:mr-3 file:border file:border-line file:bg-ink-raised file:px-3 file:py-1.5 file:text-paper" onChange={(e) => setTrackFile(e.target.files?.[0] || null)} required />
              </Field>
              <button type="submit" className="btn" disabled={trackSubmitting}>{trackSubmitting ? 'ЗАГРУЖАЮ...' : 'ДОБАВИТЬ ТРЕК'}</button>
            </form>

            <div className="mt-5 flex flex-col gap-2">
              {tracks.length === 0 && <div className="font-mono text-xs uppercase tracking-widest2 text-mute">Пока нет добавленных треков</div>}
              {tracks.map((t) => (
                <div className="cut-sm flex items-center gap-3 border border-line p-3" key={t.id}>
                  <div className="flex h-9 w-9 flex-none items-center justify-center border border-line text-mute"><MusicNoteIcon size="16px" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-semibold uppercase">{t.name}</div>
                    <audio className="mt-1 h-8 w-full" src={t.src} controls preload="none" />
                  </div>
                  <button className="text-mute hover:text-red" onClick={() => handleDeleteTrack(t.id)} aria-label="Удалить">
                    <TrashIcon size="14px" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
              <BagIcon size="0.9em" /> Товары
            </h2>
            <p className="mt-1 text-sm text-paper/60">Добавленные товары сразу появляются на странице «Магазин».</p>

            <form className="mt-4 flex flex-col gap-3" onSubmit={handleAddMerch}>
              <Message msg={merchMsg} />
              <Field label="Название">
                <input className="field-input" value={merchForm.name} onChange={(e) => setMerchForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} required />
              </Field>
              <Field label="Цена">
                <input className="field-input" value={merchForm.price} onChange={(e) => setMerchForm((f) => ({ ...f, price: e.target.value }))} placeholder="1500 ₽" maxLength={30} required />
              </Field>
              <Field label="Описание">
                <textarea className="field-input" rows={3} value={merchForm.desc} onChange={(e) => setMerchForm((f) => ({ ...f, desc: e.target.value }))} maxLength={400} />
              </Field>
              <Field label="Фото (jpg/png/webp, до 8 МБ)">
                <input id="merch-file-input" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm text-paper/80 file:mr-3 file:border file:border-line file:bg-ink-raised file:px-3 file:py-1.5 file:text-paper" onChange={(e) => setMerchFile(e.target.files?.[0] || null)} />
              </Field>
              <button type="submit" className="btn" disabled={merchSubmitting}>{merchSubmitting ? 'ЗАГРУЖАЮ...' : 'ДОБАВИТЬ ТОВАР'}</button>
            </form>

            <div className="mt-5 flex flex-col gap-2">
              {merch.length === 0 && <div className="font-mono text-xs uppercase tracking-widest2 text-mute">Пока нет добавленных товаров</div>}
              {merch.map((item) => (
                <div className="cut-sm flex items-center gap-3 border border-line p-3" key={item.id}>
                  <div className="h-9 w-9 flex-none border border-line bg-cover bg-center text-mute" style={item.image ? { backgroundImage: `url('${item.image}')` } : undefined}>
                    {!item.image && <div className="flex h-full items-center justify-center"><BagIcon size="16px" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-semibold uppercase">{item.name}</div>
                    <div className="font-mono text-xs text-paper">{item.price}</div>
                  </div>
                  <button className="text-mute hover:text-red" onClick={() => handleDeleteMerch(item.id)} aria-label="Удалить">
                    <TrashIcon size="14px" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
              <CalendarIcon size="0.9em" /> Концерты
            </h2>
            <p className="mt-1 text-sm text-paper/60">Добавленные концерты сразу появляются в разделе «Концерты» на главной.</p>

            <form className="mt-4 flex flex-col gap-3" onSubmit={handleAddConcert}>
              <Message msg={concertMsg} />
              <Field label="Дата">
                <DatePicker value={concertForm.date} onChange={(date) => setConcertForm((f) => ({ ...f, date }))} />
              </Field>
              <Field label="Время начала (МСК)">
                <TimePicker value={concertForm.time} onChange={(time) => setConcertForm((f) => ({ ...f, time }))} />
              </Field>
              <Field label="Город">
                <CityAutocomplete value={concertForm.city} onChange={(city) => setConcertForm((f) => ({ ...f, city }))} />
              </Field>
              <Field label="Площадка">
                <input className="field-input" value={concertForm.venue} onChange={(e) => setConcertForm((f) => ({ ...f, venue: e.target.value }))} maxLength={150} required />
              </Field>
              <Field label="Ссылка на билеты (необязательно)">
                <input className="field-input" value={concertForm.ticketUrl} onChange={(e) => setConcertForm((f) => ({ ...f, ticketUrl: e.target.value }))} placeholder="https://..." maxLength={300} />
              </Field>
              <Field label="Описание">
                <textarea className="field-input" rows={3} value={concertForm.desc} onChange={(e) => setConcertForm((f) => ({ ...f, desc: e.target.value }))} maxLength={400} />
              </Field>
              <Field label="Афиша (jpg/png/webp, до 8 МБ, необязательно)">
                <input id="concert-file-input" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm text-paper/80 file:mr-3 file:border file:border-line file:bg-ink-raised file:px-3 file:py-1.5 file:text-paper" onChange={(e) => setConcertFile(e.target.files?.[0] || null)} />
              </Field>
              <button type="submit" className="btn" disabled={concertSubmitting}>{concertSubmitting ? 'ДОБАВЛЯЮ...' : 'ДОБАВИТЬ КОНЦЕРТ'}</button>
            </form>

            <div className="mt-5 flex flex-col gap-2">
              {concerts.length === 0 && <div className="font-mono text-xs uppercase tracking-widest2 text-mute">Пока нет добавленных концертов</div>}
              {concerts.slice().sort((a, b) => a.date.localeCompare(b.date)).map((c) => (
                <div className="cut-sm flex items-center gap-3 border border-line p-3" key={c.id}>
                  <div className="h-9 w-9 flex-none border border-line bg-cover bg-center text-mute" style={c.poster ? { backgroundImage: `url('${c.poster}')` } : undefined}>
                    {!c.poster && <div className="flex h-full items-center justify-center"><CalendarIcon size="16px" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-semibold uppercase">{c.venue}, {c.city}</div>
                    <div className="font-mono text-xs text-paper">{c.date}{c.time ? ` в ${c.time}` : ''}</div>
                  </div>
                  <button className="text-mute hover:text-red" onClick={() => handleDeleteConcert(c.id)} aria-label="Удалить">
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
