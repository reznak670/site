import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: isAuthed(req) })
}
