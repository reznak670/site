/**
 * Настроен ли приватный Vercel Blob (данные коллекций: концерты, мерч, треки,
 * заказы). Без токена данные остаются на локальном диске — рабочий режим
 * только для разработки: на Vercel файловая система доступна лишь на чтение.
 */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/**
 * Настроен ли публичный Vercel Blob (загруженные файлы: аудио, картинки).
 * Отдельный стор и токен — один стор Vercel Blob не может одновременно
 * обслуживать и private-, и public-доступ.
 */
export function isPublicBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_PUBLIC_READ_WRITE_TOKEN)
}

export function getPublicBlobToken(): string {
  const token = process.env.BLOB_PUBLIC_READ_WRITE_TOKEN
  if (!token) {
    throw new Error('BLOB_PUBLIC_READ_WRITE_TOKEN не настроен')
  }
  return token
}
