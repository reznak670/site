// Правила загрузки: общие для сервера и браузера, поэтому здесь не должно быть
// ни node-модулей, ни @vercel/blob — иначе они утекут в клиентский бандл.

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

export type UploadKind = 'audio' | 'merch' | 'concert'

type UploadRules = {
  dir: string
  allowed: Record<string, string>
  maxBytes: number
}

export const UPLOAD_RULES: Record<UploadKind, UploadRules> = {
  audio: { dir: 'sound/uploads', allowed: AUDIO_TYPES, maxBytes: MAX_AUDIO_BYTES },
  merch: { dir: 'img/merch', allowed: IMAGE_TYPES, maxBytes: MAX_IMAGE_BYTES },
  concert: { dir: 'img/concerts', allowed: IMAGE_TYPES, maxBytes: MAX_IMAGE_BYTES },
}

export class UploadError extends Error {}
