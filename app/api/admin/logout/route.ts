import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/auth'
import { logAction } from '@/lib/actionLog'

export async function POST() {
  logAction('admin.logout')
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE_NAME, '', { path: '/', maxAge: 0 })
  return res
}
