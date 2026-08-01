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

export function LockIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="22" y="45" width="56" height="42" rx="6" />
      <path d="M32 45 L32 30 C32 17 41 9 50 9 C59 9 68 17 68 30 L68 45" />
      <circle cx="50" cy="64" r="6" fill="currentColor" stroke="none" />
      <line x1="50" y1="70" x2="50" y2="78" />
    </svg>
  )
}

export function TrashIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <line x1="20" y1="28" x2="80" y2="28" />
      <path d="M32 28 L36 14 L64 14 L68 28" />
      <path d="M28 28 L33 88 L67 88 L72 28" />
      <line x1="42" y1="42" x2="42" y2="72" />
      <line x1="58" y1="42" x2="58" y2="72" />
    </svg>
  )
}

export function MusicNoteIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="30" cy="78" r="12" /><circle cx="70" cy="68" r="12" />
      <line x1="42" y1="78" x2="42" y2="22" /><line x1="82" y1="68" x2="82" y2="18" />
      <path d="M42 22 L82 18" fill="none" /><path d="M42 34 L82 30" fill="none" />
    </svg>
  )
}

export function ScissorsIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M50 48 L18 14" /><path d="M50 48 L82 14" />
      <path d="M50 48 L32 84" /><path d="M50 48 L68 84" />
      <circle cx="27" cy="88" r="10" /><circle cx="73" cy="88" r="10" />
      <path d="M18 14 C13 22 13 30 18 34 C23 30 23 22 18 14 Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function BellIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M50 12 C36 12 28 23 28 38 L28 55 L18 72 L82 72 L72 55 L72 38 C72 23 64 12 50 12 Z" />
      <path d="M42 84 C42 90 46 94 50 94 C54 94 58 90 58 84" />
    </svg>
  )
}

export function CheckIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="50" cy="50" r="38" />
      <path d="M32 51 L44 63 L70 35" />
    </svg>
  )
}

export function CardIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="8" y="24" width="84" height="56" rx="8" />
      <line x1="8" y1="42" x2="92" y2="42" />
      <line x1="20" y1="62" x2="45" y2="62" />
    </svg>
  )
}

export function BagIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M28 34 L72 34 L78 90 L22 90 Z" />
      <path d="M36 34 C36 20 42 10 50 10 C58 10 64 20 64 34" />
    </svg>
  )
}

export function CalendarIcon({ size = '1em' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="12" y="20" width="76" height="70" rx="6" />
      <line x1="12" y1="38" x2="88" y2="38" />
      <line x1="30" y1="10" x2="30" y2="26" /><line x1="70" y1="10" x2="70" y2="26" />
      <line x1="28" y1="55" x2="40" y2="55" /><line x1="46" y1="55" x2="58" y2="55" /><line x1="64" y1="55" x2="76" y2="55" />
      <line x1="28" y1="72" x2="40" y2="72" /><line x1="46" y1="72" x2="58" y2="72" />
    </svg>
  )
}
