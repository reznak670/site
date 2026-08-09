import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { isPublicBlobConfigured } from '@/lib/uploads'

export async function GET(req: NextRequest) {
  // blob сообщает админке, грузить файлы напрямую в Vercel Blob
  // или отдавать их серверу (локальная разработка без стора).
  return NextResponse.json({ ok: isAuthed(req), blob: isPublicBlobConfigured() })
}
