import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')
  const db = await getDb()
  let products = [...db.products]
  if (category) products = products.filter(p => p.category.toLowerCase() === category.toLowerCase())
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  if (featured === 'true') products = products.filter(p => (p as { featured?: boolean }).featured)
  return apiSuccess(products)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, price, originalPrice, image, rating, reviews, badge, category, description, size, stock } = body
    if (!name || price == null) return apiError('Name and price required', 400)
    const db = await getDb()
    const product = {
      id: generateId(),
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: image || '/api/placeholder/300/300',
      rating: rating ?? 0,
      reviews: reviews ?? 0,
      badge: badge || '',
      category: category || 'Uncategorized',
      description: description || '',
      size: size || '',
      stock: stock ?? 100
    }
    db.products.push(product)
    await writeDb(db)
    return apiSuccess(product, 201)
  } catch (e) {
    return apiError('Failed to create product', 500)
  }
}
