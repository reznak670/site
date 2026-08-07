import { NextRequest, NextResponse } from 'next/server'
import { getOrders, addOrder, markOrderSeen, deleteOrder, type OrderItemInput } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { isRateLimited, recordFailedAttempt, clearAttempts } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\-\s]{5,20}$/
const POSTAL_RE = /^[0-9]{4,10}$/
const MAX_ITEMS = 20

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }
  const orders = await getOrders()
  return NextResponse.json({ orders })
}

function parseItems(raw: unknown): OrderItemInput[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_ITEMS) return null

  const items: OrderItemInput[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') return null
    const itemId = String((entry as Record<string, unknown>).itemId || '').trim().slice(0, 100)
    const itemName = String((entry as Record<string, unknown>).itemName || '').trim().slice(0, 100)
    const itemPrice = String((entry as Record<string, unknown>).itemPrice || '').trim().slice(0, 30)
    const qtyRaw = Number((entry as Record<string, unknown>).qty)
    const qty = Number.isFinite(qtyRaw) ? Math.min(99, Math.max(1, Math.trunc(qtyRaw))) : 1
    if (!itemId || !itemName) return null
    items.push({ itemId, itemName, itemPrice, qty })
  }
  return items
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  const rateKey = `order:${ip}`
  if (isRateLimited(rateKey)) {
    return NextResponse.json({ error: 'Слишком много заказов, попробуйте позже' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    recordFailedAttempt(rateKey)
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const items = parseItems(body.items)
  const fio = String(body.fio || '').trim().slice(0, 150)
  const phone = String(body.phone || '').trim().slice(0, 20)
  const postalCode = String(body.postalCode || '').trim().slice(0, 10)
  const email = String(body.email || '').trim().slice(0, 150)

  if (!items || !fio || !phone || !postalCode || !email) {
    recordFailedAttempt(rateKey)
    return NextResponse.json({ error: 'Заполните все поля и добавьте товары в корзину' }, { status: 400 })
  }
  if (!PHONE_RE.test(phone)) {
    recordFailedAttempt(rateKey)
    return NextResponse.json({ error: 'Некорректный номер телефона' }, { status: 400 })
  }
  if (!POSTAL_RE.test(postalCode)) {
    recordFailedAttempt(rateKey)
    return NextResponse.json({ error: 'Некорректный почтовый индекс' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    recordFailedAttempt(rateKey)
    return NextResponse.json({ error: 'Некорректная почта' }, { status: 400 })
  }

  clearAttempts(rateKey)
  const order = await addOrder({ fio, phone, postalCode, email, items })
  return NextResponse.json({ order: { id: order.id } })
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  const id = body && typeof body.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'id обязателен' }, { status: 400 })

  await markOrderSeen(id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  const id = body && typeof body.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'id обязателен' }, { status: 400 })

  await deleteOrder(id)
  return NextResponse.json({ ok: true })
}
