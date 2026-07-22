const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

const attempts = new Map<string, { count: number; resetAt: number }>()

export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key)
  if (!entry || Date.now() > entry.resetAt) return false
  return entry.count >= MAX_ATTEMPTS
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  entry.count++
}

export function clearAttempts(key: string): void {
  attempts.delete(key)
}
