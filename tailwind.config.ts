import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Фон страницы — чистый чёрный. soft/raised остаются приподнятыми:
        // это поверхности панелей и карточек, они должны отделяться от фона.
        // Яркость секций с медиа регулируется не здесь, а прозрачностью
        // самих снимков и градиентов поверх них.
        ink: {
          DEFAULT: '#000000',
          soft: '#0c0c0f',
          raised: '#161618',
        },
        red: {
          DEFAULT: '#d4102a',
          dim: '#5c0714',
          bright: '#ff2f47',
        },
        paper: '#f0ede6',
        mute: '#8a887f',
        line: 'rgba(240,237,230,0.1)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      screens: {
        xs: '420px',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(212, 16, 42, 0.55)',
      },
      keyframes: {
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        glitchSlice: {
          '0%, 92%, 100%': { transform: 'translate(0, 0)', opacity: '0' },
          '93%': { transform: 'translate(-3px, 1px)', opacity: '0.85' },
          '95%': { transform: 'translate(3px, -1px)', opacity: '0.85' },
          '97%': { transform: 'translate(-2px, 0)', opacity: '0.6' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.35' },
          '94%': { opacity: '1' },
        },
        noiseShift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(-4%, 2%)' },
          '30%': { transform: 'translate(2%, -4%)' },
          '40%': { transform: 'translate(-2%, 4%)' },
          '50%': { transform: 'translate(4%, 1%)' },
          '60%': { transform: 'translate(-3%, -2%)' },
          '70%': { transform: 'translate(3%, 3%)' },
          '80%': { transform: 'translate(-1%, -3%)' },
          '90%': { transform: 'translate(1%, 2%)' },
        },
        tracking: {
          '0%, 96%, 100%': { transform: 'translateY(0) scaleY(1)', opacity: '0' },
          '97%': { transform: 'translateY(-6px) scaleY(1.4)', opacity: '0.5' },
          '98%': { transform: 'translateY(4px) scaleY(0.6)', opacity: '0.4' },
          '99%': { transform: 'translateY(-2px) scaleY(1)', opacity: '0.3' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.15' },
        },
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        'glitch-r': 'glitchSlice 3.4s steps(1) infinite',
        'glitch-c': 'glitchSlice 3.4s steps(1) infinite reverse',
        flicker: 'flicker 6s ease-in-out infinite',
        noise: 'noiseShift 0.6s steps(8) infinite',
        tracking: 'tracking 7s ease-in-out infinite',
        blink: 'blink 1.2s step-start infinite',
      },
    },
  },
  plugins: [],
}

export default config
