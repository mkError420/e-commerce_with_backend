import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  try {
    console.log('=== GET Main Deals Route Called ===')
    
    const db = await getDb()
    console.log('GET Main Route - Total deals in DB:', db.deals.length)
    console.log('GET Main Route - Deals:', db.deals.map(d => ({ id: d.id, title: d.title, dealPrice: d.dealPrice })))
    
    const response = apiSuccess(db.deals)
    console.log('GET Main Route - Response created with deals count:', db.deals.length)
    return response
  } catch (error) {
    console.error('GET Main Route - Error:', error)
    return apiError('Failed to fetch deals', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('POST Request - Body:', body)
    
    const { title, originalPrice, dealPrice, discount, image, images, category, dealType, endTime, stock, sold, rating, reviews, description, features, freeShipping } = body
    if (!title || originalPrice == null || dealPrice == null) return apiError('Title, originalPrice and dealPrice required', 400)
    
    const db = await getDb()
    console.log('Current deals in DB before creation:', db.deals.length)
    
    // Sample product images for defaults
    const sampleImages = [
      '/images/products/product_1.png',
      '/images/products/product_2.jpg',
      '/images/products/product_3.png',
      '/images/products/product_4.png',
      '/images/products/product_5.png',
      '/images/products/product_6.png',
      '/images/products/product_7.png',
      '/images/products/product_8.png'
    ];
    
    const deal = {
      id: generateId(),
      title,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      discount: discount ?? Math.round((1 - Number(dealPrice) / Number(originalPrice)) * 100),
      image: image && image !== '/api/placeholder/400/300' ? image : sampleImages[Math.floor(Math.random() * sampleImages.length)],
      images: images || [], // Array of additional images for gallery
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
    
    console.log('New deal created:', deal)
    
    db.deals.push(deal)
    await writeDb(db)
    
    console.log('Total deals after creation:', db.deals.length)
    
    return apiSuccess(deal, 201)
  } catch (error) {
    console.error('Error creating deal:', error)
    return apiError('Failed to create deal', 500)
  }
}

