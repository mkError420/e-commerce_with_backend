import { NextRequest } from 'next/server'
import { getDb, writeDb } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const order = db.orders.find(o => o.id === id || o.orderNumber === id)
  if (!order) return apiError('Order not found', 404)
  return apiSuccess(order)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const db = await getDb()
  const idx = db.orders.findIndex(o => o.id === id)
  if (idx === -1) return apiError('Order not found', 404)
  db.orders[idx] = { ...db.orders[idx], ...body, id: db.orders[idx].id }
  await writeDb(db)
  return apiSuccess(db.orders[idx])
}
