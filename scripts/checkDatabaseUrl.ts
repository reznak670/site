import 'dotenv/config'
import { migrationDatabaseUrl } from '../lib/databaseUrl'

// Отдельный шаг в vercel-build: без него отсутствующая строка подключения
// всплывает как общее "The datasource.url property is required" от Prisma,
// по которому не понять, какую переменную и куда добавлять.
if (!migrationDatabaseUrl()) {
  console.error(
    '\n✖ Не задана строка подключения к Postgres.\n' +
      '  Ожидается одна из переменных: DIRECT_DATABASE_URL, POSTGRES_URL_NON_POOLING, DATABASE_URL, POSTGRES_URL.\n' +
      '  Vercel: Settings → Environment Variables (включите все окружения и передеплойте).\n'
  )
  process.exit(1)
}
