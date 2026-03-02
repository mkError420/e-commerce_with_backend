import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  const db = await getDb()
  return apiSuccess(db.deals)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, originalPrice, dealPrice, discount, image, category, dealType, endTime, stock, sold, rating, reviews, description, features, freeShipping } = body
    if (!title || originalPrice == null || dealPrice == null) return apiError('Title, originalPrice and dealPrice required', 400)
    const db = await getDb()
    const deal = {
      id: generateId(),
      title,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      discount: discount ?? Math.round((1 - Number(dealPrice) / Number(originalPrice)) * 100),
      image: image || '/api/placeholder/400/300',
      category: category || 'General',
      dealType: dealType || 'daily',
      endTime: endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      stock: stock ?? 10,
      sold: sold ?? 0,
      rating: rating ?? 4.5,
      reviews: reviews ?? 0,
      description: description || '',
      features: features || [],
      freeShipping: freeShipping ?? true
    }
    db.deals.push(deal)
    await writeDb(db)
    return apiSuccess(deal, 201)
  } catch {
    return apiError('Failed to create deal', 500)
  }
}
