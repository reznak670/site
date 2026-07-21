import { readFile } from 'fs/promises'
import { join } from 'path'
import { SkullIcon } from './icons'

export default async function HomePage() {
  // Читаем index.html из public
  const htmlPath = join(process.cwd(), 'public', 'index.html')
  
  try {
    const html = await readFile(htmlPath, 'utf-8')
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    )
  } catch {
    return <ServerError />
  }
}

function ServerError() {
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
      <h1 style={{ fontSize: '4em', textShadow: '0 0 30px #ff1744', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2em' }}>
        <SkullIcon /> 500
      </h1>
      <p style={{ fontSize: '1.5em', color: '#ff5252' }}>
        index.html не найден в public/
      </p>
      <p style={{ color: '#666' }}>
        Запустите скрипт подготовки фронтенда
      </p>
    </div>
  )
}
