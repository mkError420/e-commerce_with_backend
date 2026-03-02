import { NextRequest } from 'next/server'
import { getDb, writeDb } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const category = db.categories.find(c => c.id === id)
  if (!category) return apiError('Category not found', 404)
  return apiSuccess(category)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const db = await getDb()
  const idx = db.categories.findIndex(c => c.id === id)
  if (idx === -1) return apiError('Category not found', 404)
  db.categories[idx] = { ...db.categories[idx], ...body, id }
  await writeDb(db)
  return apiSuccess(db.categories[idx])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const idx = db.categories.findIndex(c => c.id === id)
  if (idx === -1) return apiError('Category not found', 404)
  db.categories.splice(idx, 1)
  await writeDb(db)
  return apiSuccess({ deleted: true })
}
