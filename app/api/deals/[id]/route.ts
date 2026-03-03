import { NextRequest } from 'next/server'
import { getDb, writeDb } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('=== GET [id] Route Called ===')
    
    const { id } = await params
    console.log('GET [id] Route - ID received:', id)
    
    const db = await getDb()
    console.log('GET [id] Route - Total deals in DB:', db.deals.length)
    console.log('GET [id] Route - Available deal IDs:', db.deals.map(d => d.id))
    
    const deal = db.deals.find(d => d.id === id)
    console.log('GET [id] Route - Found deal:', deal)
    
    if (!deal) {
      console.log('GET [id] Route - Deal not found for ID:', id)
      const errorResponse = apiError('Deal not found', 404)
      console.log('GET [id] Route - Error response:', errorResponse)
      return errorResponse
    }
    
    console.log('GET [id] Route - Returning deal:', deal.title)
    const successResponse = apiSuccess(deal)
    console.log('GET [id] Route - Success response created')
    return successResponse
  } catch (error) {
    console.error('GET [id] Route - Error:', error)
    const errorResponse = apiError('Failed to fetch deal', 500)
    console.log('GET [id] Route - Error response:', errorResponse)
    return errorResponse
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('=== PUT [id] Route Called ===')
    
    const { id } = await params
    console.log('PUT [id] Route - ID received:', id)
    
    const body = await req.json()
    console.log('PUT [id] Route - Body:', body)
    
    const { title, originalPrice, dealPrice, discount, image, images, category, dealType, endTime, stock, sold, rating, reviews, description, features, freeShipping } = body
    if (!title || originalPrice == null || dealPrice == null) {
      console.log('PUT [id] Route - Validation failed: missing required fields')
      return apiError('Title, originalPrice and dealPrice required', 400)
    }
    
    const db = await getDb()
    console.log('PUT [id] Route - Total deals in DB:', db.deals.length)
    
    const idx = db.deals.findIndex(d => d.id === id)
    console.log('PUT [id] Route - Deal index found:', idx)
    
    if (idx === -1) {
      console.log('PUT [id] Route - Deal not found for ID:', id)
      return apiError('Deal not found', 404)
    }
    
    // Update deal
    db.deals[idx] = {
      ...db.deals[idx],
      title,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      discount: discount ?? Math.round((1 - Number(dealPrice) / Number(originalPrice)) * 100),
      image: image || '/api/placeholder/400/300',
      images: images || db.deals[idx].images || [], // Keep existing images if not provided
      category: category || 'General',
      dealType: dealType || 'daily',
      endTime: endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      stock: stock ?? 10,
      sold: sold ?? db.deals[idx].sold,
      rating: rating ?? 4.5,
      reviews: reviews ?? 0,
      description: description || '',
      features: features || [],
      freeShipping: freeShipping ?? true
    }
    
    console.log('PUT [id] Route - Updated deal:', db.deals[idx])
    
    await writeDb(db)
    console.log('PUT [id] Route - Database saved successfully')
    
    const successResponse = apiSuccess(db.deals[idx])
    console.log('PUT [id] Route - Success response created')
    return successResponse
  } catch (error) {
    console.error('PUT [id] Route - Error:', error)
    return apiError('Failed to update deal', 500)
  }
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
