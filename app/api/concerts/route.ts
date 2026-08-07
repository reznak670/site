import { NextRequest, NextResponse } from 'next/server'
import { getConcerts, addConcert, deleteConcert } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { resolveUpload, UploadError } from '@/lib/uploads'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const dynamic = 'force-dynamic'

export async function GET() {
  const concerts = await getConcerts()
  const sorted = concerts.slice().sort((a, b) => a.date.localeCompare(b.date))
  return NextResponse.json({ concerts: sorted })
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })

  const date = String(form.get('date') || '').trim().slice(0, 10)
  const time = String(form.get('time') || '').trim().slice(0, 20)
  const city = String(form.get('city') || '').trim().slice(0, 100)
  const venue = String(form.get('venue') || '').trim().slice(0, 150)
  const ticketUrl = String(form.get('ticketUrl') || '').trim().slice(0, 300)
  const desc = String(form.get('desc') || '').trim().slice(0, 400)

  if (!date || !city || !venue) {
    return NextResponse.json({ error: 'Укажите дату, город и площадку' }, { status: 400 })
  }
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: 'Некорректная дата' }, { status: 400 })
  }

  let poster = ''
  try {
    poster = await resolveUpload(form, 'concert')
  } catch (e) {
    const message = e instanceof UploadError ? e.message : 'Ошибка загрузки фото'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const concert = await addConcert({ date, time, city, venue, ticketUrl, desc, poster })
  return NextResponse.json({ concert })
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = body && typeof body.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'id обязателен' }, { status: 400 })

  await deleteConcert(id)
  return NextResponse.json({ ok: true })
}
