import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth'
import { isRateLimited, recordFailedAttempt, clearAttempts } from '@/lib/rateLimit'
import { logAction } from '@/lib/actionLog'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local'

  if (isRateLimited(ip)) {
    logAction('admin.login.rateLimited', { ip })
    return NextResponse.json({ ok: false, error: 'Слишком много попыток, попробуйте позже' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const password = body && typeof body.password === 'string' ? body.password : ''

  if (!checkPassword(password)) {
    recordFailedAttempt(ip)
    logAction('admin.login.fail', { ip })
    return NextResponse.json({ ok: false, error: 'Неверный пароль' }, { status: 401 })
  }
  clearAttempts(ip)
  logAction('admin.login', { ip })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 4,
  })
  return res
}
