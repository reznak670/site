import { NextRequest, NextResponse } from 'next/server'
import { getTracks, addTrack, deleteTrack } from '@/lib/store'
import { isAuthed } from '@/lib/auth'
import { resolveUpload, UploadError } from '@/lib/uploads'

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

  try {
    const src = await resolveUpload(form, 'audio')
    if (!src) {
      return NextResponse.json({ error: 'Укажите аудиофайл трека' }, { status: 400 })
    }
    const track = await addTrack({ name, desc, src })
    return NextResponse.json({ track })
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

  await deleteTrack(id)
  return NextResponse.json({ ok: true })
}
