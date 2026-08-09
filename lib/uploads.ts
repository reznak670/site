import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { put } from '@vercel/blob'
import { UPLOAD_RULES, UploadError, type UploadKind } from './uploadRules'
import { isBlobConfigured } from './blob'

export { UPLOAD_RULES, UploadError, isBlobConfigured }
export type { UploadKind }

/**
 * Загрузка файла через сервер. На Vercel этот путь ограничен 4.5 МБ на тело
 * запроса, поэтому админка грузит напрямую в Blob (см. lib/uploadClient.ts),
 * а сюда попадают только локальные загрузки без настроенного Blob-стора.
 */
export async function saveUploadedFile(file: File, kind: UploadKind): Promise<string> {
  const { allowed, maxBytes, dir } = UPLOAD_RULES[kind]
  const ext = allowed[file.type]
  if (!ext) throw new UploadError('Недопустимый тип файла')
  if (file.size > maxBytes) throw new UploadError('Файл слишком большой')

  const pathname = `${dir}/${crypto.randomUUID()}.${ext}`

  if (isBlobConfigured()) {
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    })
    return blob.url
  }

  const target = path.join(process.cwd(), 'public', pathname)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, Buffer.from(await file.arrayBuffer()))
  return `/${pathname}`
}

/**
 * Проверка URL, который клиент вернул после прямой загрузки в Blob.
 * Принимаем только адреса самого Blob-хранилища и только в нашем каталоге —
 * иначе через админку можно было бы записать в БД произвольную ссылку.
 */
export function verifyBlobUrl(value: string, kind: UploadKind): string {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new UploadError('Некорректная ссылка на файл')
  }
  const okHost = url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com')
  const okPath = url.pathname.startsWith(`/${UPLOAD_RULES[kind].dir}/`)
  if (!okHost || !okPath) throw new UploadError('Некорректная ссылка на файл')
  return url.toString()
}

/**
 * Достаёт из формы либо готовый blob-URL (прямая загрузка), либо сам файл
 * (локальный фолбэк). Возвращает '' если файла не приложили.
 */
export async function resolveUpload(form: FormData, kind: UploadKind): Promise<string> {
  const fileUrl = form.get('fileUrl')
  if (typeof fileUrl === 'string' && fileUrl) return verifyBlobUrl(fileUrl, kind)

  const file = form.get('file')
  if (file instanceof File && file.size > 0) return saveUploadedFile(file, kind)

  return ''
}
