import { SkullIcon } from './icons'

export default function NotFound() {
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
      <h1 style={{ fontSize: '6em', textShadow: '0 0 30px #ff1744', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.15em' }}>
        <SkullIcon /> 404
      </h1>
      <p style={{ fontSize: '1.5em', color: '#ff5252' }}>
        Этой страницы не существует
      </p>
      <p style={{ color: '#888' }}>
        Как и твоих шансов выжить на нашем концерте
      </p>
      <a 
        href="/" 
        style={{
          color: '#ff1744',
          border: '1px solid #ff1744',
          padding: '12px 25px',
          textDecoration: 'none',
          marginTop: '20px',
          fontFamily: 'Metal Mania, cursive',
          fontSize: '1.2em',
          letterSpacing: '2px',
          transition: 'all 0.3s'
        }}
      >
        ← ВЕРНУТЬСЯ НА БАЗУ
      </a>
    </div>
  )
}
