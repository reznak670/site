import { NextRequest, NextResponse } from 'next/server'
import { getTracks, addTrack, deleteTrack } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { resolveUpload, UploadError } from '@/lib/uploads'
import { logAction } from '@/lib/actionLog'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tracks = await getTracks()
  return NextResponse.json({ tracks })
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })

  const name = String(form.get('name') || '').trim().slice(0, 100)
  const desc = String(form.get('desc') || '').trim().slice(0, 400)

  if (!name) {
    return NextResponse.json({ error: 'Укажите название трека' }, { status: 400 })
  }

  let src = ''
  try {
    src = await resolveUpload(form, 'audio')
  } catch (e) {
    const message = e instanceof UploadError ? e.message : 'Ошибка загрузки файла'
    return NextResponse.json({ error: message }, { status: 400 })
  }
  if (!src) {
    return NextResponse.json({ error: 'Укажите аудиофайл трека' }, { status: 400 })
  }

  try {
    const track = await addTrack({ name, desc, src })
    logAction('tracks.add', { id: track.id, name })
    return NextResponse.json({ track })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не удалось сохранить трек'
    logAction('tracks.add.fail', { error: message })
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
    await deleteTrack(id)
    logAction('tracks.delete', { id })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не удалось удалить трек'
    logAction('tracks.delete.fail', { id, error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
