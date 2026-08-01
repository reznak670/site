import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'data')
const TRACKS_FILE = path.join(DATA_DIR, 'tracks.json')
const MERCH_FILE = path.join(DATA_DIR, 'merch.json')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const CONCERTS_FILE = path.join(DATA_DIR, 'concerts.json')

export type Track = {
  id: string
  name: string
  desc: string
  badge: string
  badgeVariant: string
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

export type Order = {
  id: string
  itemId: string
  itemName: string
  itemPrice: string
  fio: string
  phone: string
  postalCode: string
  email: string
  seen: boolean
  createdAt: number
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

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getTracks(): Promise<Track[]> {
  return readJson<Track[]>(TRACKS_FILE, [])
}

export async function addTrack(input: Omit<Track, 'id' | 'createdAt'>): Promise<Track> {
  const tracks = await getTracks()
  const track: Track = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  tracks.push(track)
  await writeJson(TRACKS_FILE, tracks)
  return track
}

export async function deleteTrack(id: string): Promise<void> {
  const tracks = await getTracks()
  await writeJson(TRACKS_FILE, tracks.filter((t) => t.id !== id))
}

export async function getMerch(): Promise<MerchItem[]> {
  return readJson<MerchItem[]>(MERCH_FILE, [])
}

export async function addMerch(input: Omit<MerchItem, 'id' | 'createdAt'>): Promise<MerchItem> {
  const items = await getMerch()
  const item: MerchItem = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  items.push(item)
  await writeJson(MERCH_FILE, items)
  return item
}

export async function deleteMerch(id: string): Promise<void> {
  const items = await getMerch()
  await writeJson(MERCH_FILE, items.filter((i) => i.id !== id))
}

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>(ORDERS_FILE, [])
}

export async function addOrder(input: Omit<Order, 'id' | 'createdAt' | 'seen'>): Promise<Order> {
  const orders = await getOrders()
  const order: Order = { ...input, id: crypto.randomUUID(), seen: false, createdAt: Date.now() }
  orders.push(order)
  await writeJson(ORDERS_FILE, orders)
  return order
}

export async function markOrderSeen(id: string): Promise<void> {
  const orders = await getOrders()
  await writeJson(ORDERS_FILE, orders.map((o) => (o.id === id ? { ...o, seen: true } : o)))
}

export async function deleteOrder(id: string): Promise<void> {
  const orders = await getOrders()
  await writeJson(ORDERS_FILE, orders.filter((o) => o.id !== id))
}

export async function getConcerts(): Promise<Concert[]> {
  return readJson<Concert[]>(CONCERTS_FILE, [])
}

export async function addConcert(input: Omit<Concert, 'id' | 'createdAt'>): Promise<Concert> {
  const concerts = await getConcerts()
  const concert: Concert = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  concerts.push(concert)
  await writeJson(CONCERTS_FILE, concerts)
  return concert
}

export async function deleteConcert(id: string): Promise<void> {
  const concerts = await getConcerts()
  await writeJson(CONCERTS_FILE, concerts.filter((c) => c.id !== id))
}
