import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId, clearCache } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const active = searchParams.get('active')
    
    const db = await getDb()
    let coupons = [...(db.coupons || [])]
    
    // Filter by specific code
    if (code) {
      const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase())
      if (!coupon) {
        return apiError('Coupon not found', 404)
      }
      
      // Check if coupon is valid
      const now = new Date()
      const isValid = coupon.isActive && 
                    (!coupon.expiresAt || new Date(coupon.expiresAt) > now) &&
                    (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
      
      if (!isValid) {
        return apiError('Coupon is expired or inactive', 400)
      }
      
      return apiSuccess(coupon)
    }
    
    // Filter by active status
    if (active === 'true') {
      const now = new Date()
      coupons = coupons.filter(coupon => 
        coupon.isActive && 
        (!coupon.expiresAt || new Date(coupon.expiresAt) > now)
      )
    }
    
    return apiSuccess(coupons)
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return apiError('Failed to fetch coupons', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      code, 
      discountType, 
      discountValue, 
      minAmount, 
      maxDiscount, 
      usageLimit, 
      expiresAt, 
      description,
      isActive = true 
    } = body
    
    // Validation
    if (!code) return apiError('Coupon code is required', 400)
    if (!discountType || !['percentage', 'fixed'].includes(discountType)) {
      return apiError('Discount type must be percentage or fixed', 400)
    }
    if (!discountValue || discountValue <= 0) {
      return apiError('Discount value must be greater than 0', 400)
    }
    if (discountType === 'percentage' && discountValue > 100) {
      return apiError('Percentage discount cannot exceed 100', 400)
    }
    
    const db = await getDb()
    
    // Check if coupon code already exists
    const existingCoupon = (db.coupons || []).find(c => c.code.toLowerCase() === code.toLowerCase())
    if (existingCoupon) {
      return apiError('Coupon code already exists', 400)
    }
    
    const coupon = {
      id: generateId(),
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minAmount: minAmount ? Number(minAmount) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: 0,
      expiresAt: expiresAt || undefined,
      description: description || '',
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Initialize coupons array if it doesn't exist
    if (!db.coupons) {
      db.coupons = []
    }
    
    db.coupons.push(coupon)
    await writeDb(db)
    clearCache()
    
    return apiSuccess(coupon, 201)
  } catch (error) {
    console.error('Error creating coupon:', error)
    return apiError('Failed to create coupon', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Coupon ID is required', 400)
    
    const body = await req.json()
    const { 
      code, 
      discountType, 
      discountValue, 
      minAmount, 
      maxDiscount, 
      usageLimit, 
      expiresAt, 
      description,
      isActive 
    } = body
    
    const db = await getDb()
    const couponIndex = (db.coupons || []).findIndex((coupon: any) => coupon.id === id)
    
    if (couponIndex === -1) return apiError('Coupon not found', 404)
    
    // Validation
    if (code && code !== db.coupons[couponIndex].code) {
      const existingCoupon = (db.coupons || []).find(c => 
        c.code.toLowerCase() === code.toLowerCase() && c.id !== id
      )
      if (existingCoupon) {
        return apiError('Coupon code already exists', 400)
      }
    }
    
    if (discountType && !['percentage', 'fixed'].includes(discountType)) {
      return apiError('Discount type must be percentage or fixed', 400)
    }
    
    if (discountValue && discountValue <= 0) {
      return apiError('Discount value must be greater than 0', 400)
    }
    
    if (discountType === 'percentage' && discountValue > 100) {
      return apiError('Percentage discount cannot exceed 100', 400)
    }
    
    // Update coupon
    db.coupons[couponIndex] = {
      ...db.coupons[couponIndex],
      code: code ? code.toUpperCase() : db.coupons[couponIndex].code,
      discountType: discountType || db.coupons[couponIndex].discountType,
      discountValue: discountValue ? Number(discountValue) : db.coupons[couponIndex].discountValue,
      minAmount: minAmount !== undefined ? Number(minAmount) : db.coupons[couponIndex].minAmount,
      maxDiscount: maxDiscount !== undefined ? (maxDiscount ? Number(maxDiscount) : undefined) : db.coupons[couponIndex].maxDiscount,
      usageLimit: usageLimit !== undefined ? (usageLimit ? Number(usageLimit) : undefined) : db.coupons[couponIndex].usageLimit,
      expiresAt: expiresAt !== undefined ? expiresAt : db.coupons[couponIndex].expiresAt,
      description: description !== undefined ? description : db.coupons[couponIndex].description,
      isActive: isActive !== undefined ? isActive : db.coupons[couponIndex].isActive,
      updatedAt: new Date().toISOString()
    }
    
    await writeDb(db)
    clearCache()
    
    return apiSuccess(db.coupons[couponIndex])
  } catch (error) {
    console.error('Error updating coupon:', error)
    return apiError('Failed to update coupon', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Coupon ID is required', 400)
    
    const db = await getDb()
    const couponIndex = (db.coupons || []).findIndex((coupon: any) => coupon.id === id)
    
    if (couponIndex === -1) return apiError('Coupon not found', 404)
    
    // Remove coupon
    db.coupons.splice(couponIndex, 1)
    
    await writeDb(db)
    clearCache()
    
    return apiSuccess({ message: 'Coupon deleted successfully' })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return apiError('Failed to delete coupon', 500)
  }
}
