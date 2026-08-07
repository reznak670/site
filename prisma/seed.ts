import 'dotenv/config'
import { readFileSync } from 'fs'
import path from 'path'
import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

type LegacyTrack = {
  id: string
  name: string
  desc: string
  src: string
  createdAt: number
}

async function main() {
  const existing = await prisma.track.count()
  if (existing > 0) {
    console.log(`Track table already has ${existing} rows, skipping seed.`)
    return
  }

  const raw = readFileSync(path.join(__dirname, '..', 'data', 'tracks.json'), 'utf-8')
  const tracks = JSON.parse(raw) as LegacyTrack[]

  for (const t of tracks) {
    await prisma.track.create({
      data: {
        name: t.name,
        desc: t.desc,
        src: t.src,
        createdAt: new Date(t.createdAt),
      },
    })
  }

  console.log(`Seeded ${tracks.length} tracks.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
