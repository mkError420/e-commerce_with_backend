import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'
import { generateOrderNumber } from '@/lib/order-number'

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return apiError('Order ID is required', 400)
    }
    
    const db = await getDb()
    const idx = db.orders.findIndex((order: any) => order.id === id)
    
    if (idx === -1) {
      return apiError('Order not found', 404)
    }
    
    db.orders[idx] = { ...db.orders[idx], ...body, id: db.orders[idx].id }
    await writeDb(db)
    return apiSuccess(db.orders[idx])
  } catch (error) {
    return apiError('Failed to update order', 500)
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
      paymentStatus: 'pending',
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
