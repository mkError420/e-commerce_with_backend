import { NextRequest } from 'next/server'
import { getDb, writeDb } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const product = db.products.find(p => p.id === id)
  if (!product) return apiError('Product not found', 404)
  return apiSuccess(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const db = await getDb()
  const idx = db.products.findIndex(p => p.id === id)
  if (idx === -1) return apiError('Product not found', 404)
  db.products[idx] = { ...db.products[idx], ...body, id }
  await writeDb(db)
  return apiSuccess(db.products[idx])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const idx = db.products.findIndex(p => p.id === id)
  if (idx === -1) return apiError('Product not found', 404)
  db.products.splice(idx, 1)
  await writeDb(db)
  return apiSuccess({ deleted: true })
}
