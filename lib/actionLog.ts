export function logAction(action: string, details?: Record<string, unknown>): void {
  console.log(`[action] ${action}`, details ?? '')
}
