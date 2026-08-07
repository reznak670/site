import { prisma } from './db'

export type Track = {
  id: string
  name: string
  desc: string
  src: string
  createdAt: number
}

export type MerchItem = {
  id: string
  name: string
  desc: string
  price: string
  image: string
  createdAt: number
}

export type OrderItemInput = {
  itemId: string
  itemName: string
  itemPrice: string
  qty: number
}

export type OrderItemRecord = OrderItemInput & { id: string }

export type Order = {
  id: string
  fio: string
  phone: string
  postalCode: string
  email: string
  seen: boolean
  createdAt: number
  items: OrderItemRecord[]
}

export type Concert = {
  id: string
  date: string
  time: string
  city: string
  venue: string
  ticketUrl: string
  desc: string
  poster: string
  createdAt: number
}

function toEpoch(date: Date): number {
  return date.getTime()
}

// Tracks

export async function getTracks(): Promise<Track[]> {
  const rows = await prisma.track.findMany({ orderBy: { createdAt: 'asc' } })
  return rows.map((t) => ({ id: t.id, name: t.name, desc: t.desc, src: t.src, createdAt: toEpoch(t.createdAt) }))
}

export async function addTrack(input: Omit<Track, 'id' | 'createdAt'>): Promise<Track> {
  const row = await prisma.track.create({ data: input })
  return { id: row.id, name: row.name, desc: row.desc, src: row.src, createdAt: toEpoch(row.createdAt) }
}

export async function deleteTrack(id: string): Promise<void> {
  await prisma.track.delete({ where: { id } }).catch(() => {})
}

// Merch

export async function getMerch(): Promise<MerchItem[]> {
  const rows = await prisma.merchItem.findMany({ orderBy: { createdAt: 'asc' } })
  return rows.map((m) => ({ ...m, createdAt: toEpoch(m.createdAt) }))
}

export async function addMerch(input: Omit<MerchItem, 'id' | 'createdAt'>): Promise<MerchItem> {
  const row = await prisma.merchItem.create({ data: input })
  return { ...row, createdAt: toEpoch(row.createdAt) }
}

export async function deleteMerch(id: string): Promise<void> {
  await prisma.merchItem.delete({ where: { id } }).catch(() => {})
}

// Orders

export async function getOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })
  return rows.map((o) => ({ ...o, createdAt: toEpoch(o.createdAt) }))
}

export async function addOrder(input: {
  fio: string
  phone: string
  postalCode: string
  email: string
  items: OrderItemInput[]
}): Promise<Order> {
  const row = await prisma.order.create({
    data: {
      fio: input.fio,
      phone: input.phone,
      postalCode: input.postalCode,
      email: input.email,
      items: { create: input.items },
    },
    include: { items: true },
  })
  return { ...row, createdAt: toEpoch(row.createdAt) }
}

export async function markOrderSeen(id: string): Promise<void> {
  await prisma.order.update({ where: { id }, data: { seen: true } }).catch(() => {})
}

export async function deleteOrder(id: string): Promise<void> {
  await prisma.order.delete({ where: { id } }).catch(() => {})
}

// Concerts

export async function getConcerts(): Promise<Concert[]> {
  const rows = await prisma.concert.findMany({ orderBy: { date: 'asc' } })
  return rows.map((c) => ({ ...c, createdAt: toEpoch(c.createdAt) }))
}

export async function addConcert(input: Omit<Concert, 'id' | 'createdAt'>): Promise<Concert> {
  const row = await prisma.concert.create({ data: input })
  return { ...row, createdAt: toEpoch(row.createdAt) }
}

export async function deleteConcert(id: string): Promise<void> {
  await prisma.concert.delete({ where: { id } }).catch(() => {})
}
