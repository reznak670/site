import { promises as fs } from 'fs'
import path from 'path'
import { get, put, BlobPreconditionFailedError } from '@vercel/blob'
import { isBlobConfigured } from './blob'

import tracksSeed from '@/data/tracks.json'
import merchSeed from '@/data/merch.json'
import concertsSeed from '@/data/concerts.json'
import ordersSeed from '@/data/orders.json'

export type Collection = 'tracks' | 'merch' | 'concerts' | 'orders'

// Начальное содержимое коллекций. Импорт статический, а не чтение с диска:
// динамические пути не попадают в трейсинг Next и на Vercel файла бы не было.
const SEEDS: Record<Collection, unknown[]> = {
  tracks: tracksSeed,
  merch: merchSeed,
  concerts: concertsSeed,
  orders: ordersSeed,
}

// Стор один и настроен как public-only (private он отклоняет — см. историю
// в git). orders.json при этом содержит ФИО/телефон/почту покупателей и
// технически читается по прямой ссылке кем угодно, если её узнать; ссылка
// нигде не публикуется, но это осознанный компромисс ради одного стора.
const ACCESS = 'public' as const
const MAX_WRITE_ATTEMPTS = 5

function blobPath(name: Collection): string {
  return `data/${name}.json`
}

function localPath(name: Collection): string {
  return path.join(process.cwd(), 'data', `${name}.json`)
}


type Snapshot<T> = {
  items: T[]
  /** ETag прочитанной версии; undefined — коллекции ещё нет в хранилище. */
  etag?: string
}

async function readSnapshot<T>(name: Collection): Promise<Snapshot<T>> {
  if (!isBlobConfigured()) {
    try {
      const raw = await fs.readFile(localPath(name), 'utf-8')
      return { items: JSON.parse(raw) as T[] }
    } catch {
      return { items: SEEDS[name] as T[] }
    }
  }

  // useCache: false — читаем из origin мимо CDN. Иначе после записи можно
  // получить старую версию: минимальный TTL кеша у Blob — минута.
  const res = await get(blobPath(name), { access: ACCESS, useCache: false })
  if (!res || res.statusCode !== 200) {
    return { items: SEEDS[name] as T[] }
  }

  const raw = await new Response(res.stream).text()
  // Blob отдаёт слабый ETag (W/"..."), а put({ ifMatch }) сверяет его как
  // сильный: слабый валидатор не проходит сравнение, даже совпадая сам с
  // собой. Без обрезки префикса каждая запись после первой (когда ETag уже
  // есть) падала бы с вечным PreconditionFailed — не гонка, а гарантированный отказ.
  const etag = res.blob.etag.replace(/^W\//, '')
  try {
    return { items: JSON.parse(raw) as T[], etag }
  } catch {
    // Битый JSON лучше не затирать молча — иначе одна неудачная запись
    // тихо обнулит заказы.
    throw new Error(`Повреждён ${blobPath(name)}: не удалось разобрать JSON`)
  }
}

async function writeSnapshot<T>(name: Collection, items: T[], etag?: string): Promise<void> {
  const body = JSON.stringify(items, null, 2)

  if (!isBlobConfigured()) {
    // На Vercel диск доступен только на чтение: без Blob-стора запись падала бы
    // с невнятным EROFS, а в админке это выглядело как «ошибка загрузки файла».
    if (process.env.VERCEL) {
      throw new Error(
        'Хранилище не настроено: подключите Vercel Blob к проекту (переменная BLOB_READ_WRITE_TOKEN) и передеплойте сайт'
      )
    }
    const target = localPath(name)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, body)
    return
  }

  await put(blobPath(name), body, {
    access: ACCESS,
    addRandomSuffix: false,
    contentType: 'application/json',
    // Есть версия — переписываем только её (ifMatch подразумевает
    // allowOverwrite). Нет — создаём, и параллельное создание должно упасть,
    // чтобы попытка началась заново уже с чтением.
    ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
  })
}

export async function readCollection<T>(name: Collection): Promise<T[]> {
  const snapshot = await readSnapshot<T>(name)
  return snapshot.items
}

/**
 * Атомарное изменение коллекции: читаем версию, применяем mutate, пишем с
 * проверкой ETag. Если между чтением и записью кто-то успел изменить файл,
 * запись отклоняется и попытка повторяется на свежих данных — иначе
 * одновременные заказы затирали бы друг друга.
 */
export async function updateCollection<T, R>(
  name: Collection,
  mutate: (items: T[]) => { items: T[]; result: R }
): Promise<R> {
  let lastError: unknown

  for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt++) {
    const snapshot = await readSnapshot<T>(name)
    const { items, result } = mutate(snapshot.items)

    try {
      await writeSnapshot(name, items, snapshot.etag)
      return result
    } catch (e) {
      // Повторяем при конфликте версий, а также при любой ошибке создания:
      // без ETag конфликт приходит не как PreconditionFailed, а как отказ
      // перезаписать уже существующий blob. Настоящая ошибка (например,
      // недействительный токен) всё равно всплывёт после последней попытки.
      const retriable = e instanceof BlobPreconditionFailedError || !snapshot.etag
      if (!retriable) throw e
      lastError = e
      await new Promise((r) => setTimeout(r, 50 * (attempt + 1)))
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Не удалось сохранить ${name}: слишком много одновременных изменений`)
}
