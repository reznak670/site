/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // better-sqlite3 ships a native .node addon that webpack can't bundle —
  // keep it (and the Prisma packages that load it) as real require() calls.
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3', '@prisma/client', '@prisma/adapter-better-sqlite3'],
  },

  // Отдача статических файлов из front/
  async rewrites() {
    return [
      {
        source: '/video/:path*',
        destination: '/api/static/video/:path*',
      },
      {
        source: '/sound/:path*',
        destination: '/api/static/sound/:path*',
      },
      {
        source: '/img/:path*',
        destination: '/api/static/img/:path*',
      },
    ]
  },

  // Заголовки для медиафайлов
  async headers() {
    return [
      {
        source: '/video/:path*',
        headers: [
          { key: 'Accept-Ranges', value: 'bytes' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sound/:path*',
        headers: [
          { key: 'Accept-Ranges', value: 'bytes' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/img/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
