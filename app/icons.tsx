export function SkullIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M50 9 C24 9 14 30 14 48 C14 63 21 71 27 77 L27 89 L40 89 L40 79 L44 79 L44 89 L56 89 L56 79 L60 79 L60 89 L73 89 L73 77 C79 71 86 63 86 48 C86 30 76 9 50 9 Z" />
      <circle cx="34" cy="46" r="8" fill="#0a0000" />
      <circle cx="66" cy="46" r="8" fill="#0a0000" />
      <path d="M50 50 L44 63 L56 63 Z" fill="#0a0000" />
    </svg>
  )
}

export function RefreshIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M80 38 A34 34 0 1 1 68 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M62 6 L86 14 L70 32 Z" fill="currentColor" />
    </svg>
  )
}
