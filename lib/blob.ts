/**
 * Настроен ли Vercel Blob. Без токена и данные, и загруженные файлы остаются
 * на локальном диске — это рабочий режим только для разработки: на Vercel
 * файловая система доступна лишь на чтение.
 */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}
