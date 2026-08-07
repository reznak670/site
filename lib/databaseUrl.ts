// Резолв строки подключения к Postgres.
// Отдельный модуль без зависимостей: его импортируют и приложение (lib/db.ts),
// и prisma.config.ts, который грузится CLI вне сборки Next.
//
// Имена переменных различаются в зависимости от того, как подключена БД:
// свой Postgres даёт DATABASE_URL, интеграции Vercel/Neon добавляют
// POSTGRES_* варианты — пулер и прямое соединение под разными именами.

// Рантайм: предпочитаем пулер — serverless открывает много коротких соединений.
const RUNTIME_VARS = [
  'DATABASE_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL',
] as const

// Миграции: только прямое соединение. Схемные операции через pgbouncer
// в transaction-режиме ломаются, поэтому non-pooling идёт первым.
const MIGRATION_VARS = [
  'DIRECT_DATABASE_URL',
  'POSTGRES_URL_NON_POOLING',
  'DATABASE_URL',
  'POSTGRES_URL',
] as const

function pick(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }
  return undefined
}

function fail(names: readonly string[]): never {
  throw new Error(
    `Не задана строка подключения к Postgres. Ожидается одна из переменных: ${names.join(', ')}. ` +
      'На Vercel добавьте её в Settings → Environment Variables (для всех окружений), локально — в .env.local.'
  )
}

/** Строка подключения для Prisma Client. Бросает, если ничего не задано. */
export function runtimeDatabaseUrl(): string {
  return pick(RUNTIME_VARS) ?? fail(RUNTIME_VARS)
}

/**
 * Строка подключения для prisma migrate / db seed.
 * Может вернуть undefined: prisma.config.ts читается и при `prisma generate`,
 * которому БД не нужна, — падать на этом этапе нельзя.
 */
export function migrationDatabaseUrl(): string | undefined {
  return pick(MIGRATION_VARS)
}
