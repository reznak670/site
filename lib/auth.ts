import crypto from 'crypto'
import type { NextRequest } from 'next/server'

export const SESSION_COOKIE_NAME = 'bs_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 4 // 4 часа

const DEV_FALLBACK_SECRET = 'bloody-scissors-dev-secret-change-me'
const DEV_FALLBACK_PASSWORD = 'kozaaa1994'

// В проде ADMIN_PASSWORD и ADMIN_SESSION_SECRET обязательны — без них сервер
// откажется обслуживать вход в админку. Дев-фолбэки ниже работают только
// при NODE_ENV !== 'production', чтобы `npm run dev` заводился из коробки.
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET (или ADMIN_PASSWORD) не задан в production')
  }
  return DEV_FALLBACK_SECRET
}

function getExpectedPassword(): string {
  const password = process.env.ADMIN_PASSWORD
  if (password) return password
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_PASSWORD не задан в production')
  }
  return DEV_FALLBACK_PASSWORD
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
