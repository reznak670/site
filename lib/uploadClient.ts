'use client'

import { upload } from '@vercel/blob/client'
import { UPLOAD_RULES, type UploadKind } from './uploadRules'

/**
 * Прямая загрузка из браузера в Vercel Blob, минуя нашу функцию, —
 * так файл не упирается в лимит 4.5 МБ на тело запроса.
 * Возвращает публичный URL загруженного файла.
 */
export async function uploadToBlob(file: File, kind: UploadKind): Promise<string> {
  const { allowed, maxBytes } = UPLOAD_RULES[kind]
  const ext = allowed[file.type]
  if (!ext) throw new Error('Недопустимый тип файла')
  if (file.size > maxBytes) throw new Error('Файл слишком большой')

  const pathname = `${UPLOAD_RULES[kind].dir}/${crypto.randomUUID()}.${ext}`
  const blob = await upload(pathname, file, {
    access: 'public',
    contentType: file.type,
    handleUploadUrl: '/api/blob/upload',
    multipart: file.size > 5 * 1024 * 1024,
  })
  return blob.url
}

/**
 * Кладёт в форму либо ссылку на уже загруженный blob, либо сам файл
 * (локальная разработка без Blob-стора — там сервер пишет в public/).
 */
export async function attachUpload(
  fd: FormData,
  file: File,
  kind: UploadKind,
  blobEnabled: boolean
): Promise<void> {
  if (blobEnabled) {
    fd.set('fileUrl', await uploadToBlob(file, kind))
  } else {
    fd.set('file', file)
  }
}
