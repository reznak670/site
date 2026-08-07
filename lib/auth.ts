import crypto from 'crypto'
import type { NextRequest } from 'next/server'

export const SESSION_COOKIE_NAME = 'bs_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 4 // 4 часа

// Доступ к админке намеренно зашит в репозиторий — так решил владелец сайта
// 2026-08-08, чтобы деплой не требовал настройки переменных окружения.
//
// ВНИМАНИЕ: репозиторий публичный. Значит и пароль, и секрет подписи сессии
// доступны любому — войти в /admin, прочитать заказы с ФИО, телефонами и
// почтой покупателей и удалить контент может кто угодно. Секретом ниже
// подписывается кука, поэтому подделать сессию можно и вовсе без пароля.
// Если это перестанет устраивать: сделать репозиторий приватным либо задать
// ADMIN_PASSWORD и ADMIN_SESSION_SECRET в Vercel — они перекрывают эти значения.
const REPO_PASSWORD = 'Scissors2025!'
const REPO_SESSION_SECRET = 'f19519412afc176e78217bcd53ff08ba21b26a57bc466824e10ec7f2c695c875'

// ADMIN_PASSWORD в цепочке не случайно: если задать в Vercel только его,
// подпись сессии тоже перестанет быть публичной — иначе куку по-прежнему
// можно было бы подделать зашитым секретом, и смена пароля ничего не дала бы.
function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || REPO_SESSION_SECRET
}

function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || REPO_PASSWORD
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function createSessionToken(): string {
  const expires = String(Date.now() + SESSION_TTL_MS)
  return `${expires}.${sign(expires)}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const dot = token.lastIndexOf('.')
  if (dot < 0) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expires = Number(payload)
  if (!expires || Date.now() > expires) return false

  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function checkPassword(input: string): boolean {
  const expected = getExpectedPassword()
  const a = Buffer.from(String(input || ''))
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function isAuthed(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value)
}
