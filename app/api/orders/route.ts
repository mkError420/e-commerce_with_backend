import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

function generateOrderNumber() {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    
    if (id) {
      // Get single order by ID
      const order = db.orders.find((order: any) => order.id === id)
      if (!order) {
        return apiError('Order not found', 404)
      }
      return apiSuccess(order)
    } else {
      // Get all orders
      return apiSuccess(db.orders)
    }
  } catch (error) {
    return apiError('Failed to fetch orders', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, district, zipCode, country, items, subtotal, shipping, total, paymentMethod, paymentInfo } = body
    if (!name || !email || !phone || !address || !items?.length || total == null) return apiError('Required fields missing', 400)
    const db = await getDb()
    const order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      status: 'pending',
      name,
      email,
      phone,
      address,
      district: district || '',
      zipCode: zipCode || '',
      country: country || 'Bangladesh',
      items,
      subtotal: Number(subtotal),
      shipping: Number(shipping || 0),
      total: Number(total),
      paymentMethod: paymentMethod || 'card',
      paymentInfo: paymentInfo || '',
      createdAt: new Date().toISOString()
    }
    db.orders.push(order)
    await writeDb(db)
    return apiSuccess(order, 201)
  } catch (e) {
    return apiError('Failed to create order', 500)
  }
}
