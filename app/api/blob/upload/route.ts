import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { isAuthed } from '@/lib/auth'
import { isPublicBlobConfigured, getPublicBlobToken } from '@/lib/blob'
import { UPLOAD_RULES, type UploadKind } from '@/lib/uploadRules'

export const dynamic = 'force-dynamic'

function kindFromPathname(pathname: string): UploadKind | null {
  const entry = (Object.keys(UPLOAD_RULES) as UploadKind[]).find((k) =>
    pathname.startsWith(`${UPLOAD_RULES[k].dir}/`)
  )
  return entry ?? null
}

// Выдаёт браузеру одноразовый токен на прямую загрузку в Vercel Blob.
// Это обход лимита в 4.5 МБ на тело запроса к серверной функции —
// иначе треки (до 25 МБ) через админку загрузить невозможно.
export async function POST(req: NextRequest) {
  if (!isPublicBlobConfigured()) {
    return NextResponse.json({ error: 'Хранилище файлов не настроено' }, { status: 501 })
  }
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as HandleUploadBody | null
  if (!body) return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })

  try {
    const result = await handleUpload({
      body,
      request: req,
      token: getPublicBlobToken(),
      onBeforeGenerateToken: async (pathname) => {
        // Повторная проверка авторизации: токен подписывается здесь, и он
        // единственное, что стоит между публичным эндпоинтом и записью в стор.
        if (!isAuthed(req)) throw new Error('Требуется авторизация')

        const kind = kindFromPathname(pathname)
        if (!kind) throw new Error('Недопустимый путь загрузки')

        const { allowed, maxBytes } = UPLOAD_RULES[kind]
        return {
          allowedContentTypes: Object.keys(allowed),
          maximumSizeInBytes: maxBytes,
          addRandomSuffix: false,
        }
      },
    })
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка загрузки файла'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
