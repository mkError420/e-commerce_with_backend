import { NextRequest } from 'next/server'
import { getDb, writeDb } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const deal = db.deals.find(d => d.id === id)
  if (!deal) return apiError('Deal not found', 404)
  return apiSuccess(deal)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const db = await getDb()
  const idx = db.deals.findIndex(d => d.id === id)
  if (idx === -1) return apiError('Deal not found', 404)
  db.deals[idx] = { ...db.deals[idx], ...body, id }
  await writeDb(db)
  return apiSuccess(db.deals[idx])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const idx = db.deals.findIndex(d => d.id === id)
  if (idx === -1) return apiError('Deal not found', 404)
  db.deals.splice(idx, 1)
  await writeDb(db)
  return apiSuccess({ deleted: true })
}
