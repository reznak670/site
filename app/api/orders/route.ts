import { NextRequest, NextResponse } from 'next/server'
import { getOrders, addOrder, markOrderSeen, deleteOrder } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { isRateLimited, recordFailedAttempt } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\-\s]{5,20}$/
const POSTAL_RE = /^[0-9]{4,10}$/

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }
  const orders = await getOrders()
  return NextResponse.json({ orders: orders.slice().reverse() })
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

  const itemId = String(body.itemId || '').trim().slice(0, 100)
  const itemName = String(body.itemName || '').trim().slice(0, 100)
  const itemPrice = String(body.itemPrice || '').trim().slice(0, 30)
  const fio = String(body.fio || '').trim().slice(0, 150)
  const phone = String(body.phone || '').trim().slice(0, 20)
  const postalCode = String(body.postalCode || '').trim().slice(0, 10)
  const email = String(body.email || '').trim().slice(0, 150)

  if (!itemId || !itemName || !fio || !phone || !postalCode || !email) {
    recordFailedAttempt(rateKey)
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
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

  const order = await addOrder({ itemId, itemName, itemPrice, fio, phone, postalCode, email })
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
