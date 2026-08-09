import { NextRequest, NextResponse } from 'next/server'
import { getMerch, addMerch, deleteMerch } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { resolveUpload, UploadError } from '@/lib/uploads'
import { logAction } from '@/lib/actionLog'

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

  let image = ''
  try {
    image = await resolveUpload(form, 'merch')
  } catch (e) {
    const message = e instanceof UploadError ? e.message : 'Ошибка загрузки файла'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Сохранение отделено от загрузки: иначе отказ хранилища приходил в админку
  // как «ошибка загрузки файла» и настоящую причину было не видно.
  try {
    const item = await addMerch({ name, desc, price, image })
    logAction('merch.add', { id: item.id, name })
    return NextResponse.json({ item })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не удалось сохранить товар'
    logAction('merch.add.fail', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = body && typeof body.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'id обязателен' }, { status: 400 })

  try {
    await deleteMerch(id)
    logAction('merch.delete', { id })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не удалось удалить товар'
    logAction('merch.delete.fail', { id, error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
