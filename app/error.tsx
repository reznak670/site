'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      background: '#0a0000',
      color: '#ff1744',
      fontFamily: 'monospace',
      textAlign: 'center',
      padding: '50px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '4em', textShadow: '0 0 30px #ff1744', margin: 0 }}>💀 500</h1>
      <p style={{ fontSize: '1.3em', color: '#ff5252' }}>
        Всё пошло по пизде
      </p>
      <p style={{ color: '#888', fontSize: '0.9em' }}>
        Как барабанщик на 10-й минуте слэма
      </p>
      <button
        onClick={reset}
        style={{
          background: 'rgba(255,23,68,0.2)',
          color: '#ff1744',
          border: '1px solid #ff1744',
          padding: '12px 25px',
          cursor: 'pointer',
          marginTop: '20px',
          fontFamily: 'Metal Mania, cursive',
          fontSize: '1em',
          letterSpacing: '2px'
        }}
      >
        🔄 ПОПРОБОВАТЬ ЕЩЁ РАЗ
      </button>
    </div>
  )
}
