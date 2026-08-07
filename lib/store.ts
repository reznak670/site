import crypto from 'crypto'
import { readCollection, updateCollection } from './jsonStore'

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

function byCreatedAtAsc<T extends { createdAt: number }>(a: T, b: T): number {
  return a.createdAt - b.createdAt
}

// Tracks

export async function getTracks(): Promise<Track[]> {
  const tracks = await readCollection<Track>('tracks')
  return tracks.slice().sort(byCreatedAtAsc)
}

export async function addTrack(input: Omit<Track, 'id' | 'createdAt'>): Promise<Track> {
  const track: Track = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  return updateCollection<Track, Track>('tracks', (items) => ({
    items: [...items, track],
    result: track,
  }))
}

export async function deleteTrack(id: string): Promise<void> {
  await updateCollection<Track, void>('tracks', (items) => ({
    items: items.filter((t) => t.id !== id),
    result: undefined,
  }))
}

// Merch

export async function getMerch(): Promise<MerchItem[]> {
  const merch = await readCollection<MerchItem>('merch')
  return merch.slice().sort(byCreatedAtAsc)
}

export async function addMerch(input: Omit<MerchItem, 'id' | 'createdAt'>): Promise<MerchItem> {
  const item: MerchItem = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  return updateCollection<MerchItem, MerchItem>('merch', (items) => ({
    items: [...items, item],
    result: item,
  }))
}

export async function deleteMerch(id: string): Promise<void> {
  await updateCollection<MerchItem, void>('merch', (items) => ({
    items: items.filter((m) => m.id !== id),
    result: undefined,
  }))
}

// Orders

export async function getOrders(): Promise<Order[]> {
  const orders = await readCollection<Order>('orders')
  return orders.slice().sort((a, b) => b.createdAt - a.createdAt)
}

export async function addOrder(input: {
  fio: string
  phone: string
  postalCode: string
  email: string
  items: OrderItemInput[]
}): Promise<Order> {
  const order: Order = {
    id: crypto.randomUUID(),
    fio: input.fio,
    phone: input.phone,
    postalCode: input.postalCode,
    email: input.email,
    seen: false,
    createdAt: Date.now(),
    items: input.items.map((item) => ({ ...item, id: crypto.randomUUID() })),
  }
  return updateCollection<Order, Order>('orders', (items) => ({
    items: [...items, order],
    result: order,
  }))
}

export async function markOrderSeen(id: string): Promise<void> {
  await updateCollection<Order, void>('orders', (items) => ({
    items: items.map((o) => (o.id === id ? { ...o, seen: true } : o)),
    result: undefined,
  }))
}

export async function deleteOrder(id: string): Promise<void> {
  await updateCollection<Order, void>('orders', (items) => ({
    items: items.filter((o) => o.id !== id),
    result: undefined,
  }))
}

// Concerts

export async function getConcerts(): Promise<Concert[]> {
  const concerts = await readCollection<Concert>('concerts')
  return concerts.slice().sort((a, b) => a.date.localeCompare(b.date))
}

export async function addConcert(input: Omit<Concert, 'id' | 'createdAt'>): Promise<Concert> {
  const concert: Concert = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  return updateCollection<Concert, Concert>('concerts', (items) => ({
    items: [...items, concert],
    result: concert,
  }))
}

export async function deleteConcert(id: string): Promise<void> {
  await updateCollection<Concert, void>('concerts', (items) => ({
    items: items.filter((c) => c.id !== id),
    result: undefined,
  }))
}
