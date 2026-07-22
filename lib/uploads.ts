import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const AUDIO_TYPES: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/ogg': 'ogg',
}

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const MAX_AUDIO_BYTES = 25 * 1024 * 1024
const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export class UploadError extends Error {}

async function saveFile(
  file: File,
  allowed: Record<string, string>,
  maxBytes: number,
  subdir: string
): Promise<string> {
  const ext = allowed[file.type]
  if (!ext) throw new UploadError('Недопустимый тип файла')
  if (file.size > maxBytes) throw new UploadError('Файл слишком большой')

  const buffer = Buffer.from(await file.arrayBuffer())
  const name = `${crypto.randomUUID()}.${ext}`
  const dir = path.join(process.cwd(), 'public', subdir)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, name), buffer)
  return `/${subdir}/${name}`
}

export function saveAudioFile(file: File): Promise<string> {
  return saveFile(file, AUDIO_TYPES, MAX_AUDIO_BYTES, 'sound/uploads')
}

export function saveImageFile(file: File): Promise<string> {
  return saveFile(file, IMAGE_TYPES, MAX_IMAGE_BYTES, 'img/merch')
}
