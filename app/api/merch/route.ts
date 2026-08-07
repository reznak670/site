import { NextRequest, NextResponse } from 'next/server'
import { getMerch, addMerch, deleteMerch } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { resolveUpload, UploadError } from '@/lib/uploads'

export const dynamic = 'force-dynamic'

export async function GET() {
  const merch = await getMerch()
  return NextResponse.json({ merch })
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })

  const name = String(form.get('name') || '').trim().slice(0, 100)
  const desc = String(form.get('desc') || '').trim().slice(0, 400)
  const price = String(form.get('price') || '').trim().slice(0, 30)

  if (!name || !price) {
    return NextResponse.json({ error: 'Укажите название и цену' }, { status: 400 })
  }

  try {
    const image = await resolveUpload(form, 'merch')
    const item = await addMerch({ name, desc, price, image })
    return NextResponse.json({ item })
  } catch (e) {
    const message = e instanceof UploadError ? e.message : 'Ошибка загрузки файла'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = body && typeof body.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'id обязателен' }, { status: 400 })

  await deleteMerch(id)
  return NextResponse.json({ ok: true })
}
