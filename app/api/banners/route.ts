import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  try {
    const db = await getDb()
    return apiSuccess(db.banners || [])
  } catch (error) {
    console.error('Error fetching banners:', error)
    return apiError('Failed to fetch banners', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST banners API called')
    const body = await req.json()
    console.log('Received body:', body)
    
    const { title, subtitle, description, image, category, backgroundColor, gradient, isActive, position } = body
    
    // Validate required fields
    if (!title || !subtitle || !description) {
      return apiError('Title, subtitle, and description are required', 400)
    }
    
    // Validate image URL
    if (!image) {
      return apiError('Image URL is required', 400)
    }
    
    // Basic URL validation
    try {
      new URL(image)
    } catch {
      // If it's not a valid URL, check if it's a local path
      if (!image.startsWith('/')) {
        return apiError('Image URL must be a valid URL or start with /', 400)
      }
    }
    
    const db = await getDb()
    const banner = {
      id: generateId(),
      title,
      subtitle,
      description,
      image,
      category: category || '',
      backgroundColor: backgroundColor || 'from-shop_dark_green',
      gradient: gradient || 'to-shop_light_green',
      isActive: isActive !== false,
      position: position || 0
    }
    
    // Initialize banners array if it doesn't exist
    if (!db.banners) {
      db.banners = []
    }
    
    db.banners.push(banner)
    await writeDb(db)
    
    return apiSuccess(banner, 201)
  } catch (error) {
    console.error('POST banners error:', error)
    return apiError('Failed to create banner', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('PUT banners API called with:', body)
    
    const { id, ...updateData } = body
    
    if (!id) {
      return apiError('Banner ID is required', 400)
    }
    
    const db = await getDb()
    const bannerIndex = db.banners?.findIndex((banner: any) => banner.id === id)
    
    if (bannerIndex === -1) {
      return apiError('Banner not found', 404)
    }
    
    // Update the banner
    db.banners[bannerIndex] = { ...db.banners[bannerIndex], ...updateData }
    await writeDb(db)
    
    return apiSuccess(db.banners[bannerIndex])
  } catch (error) {
    console.error('PUT banners error:', error)
    return apiError('Failed to update banner', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    console.log('DELETE banners API called for id:', id)
    
    if (!id) {
      return apiError('Banner ID is required', 400)
    }
    
    const db = await getDb()
    const bannerIndex = db.banners?.findIndex((banner: any) => banner.id === id)
    
    if (bannerIndex === -1) {
      return apiError('Banner not found', 404)
    }
    
    // Remove the banner
    db.banners.splice(bannerIndex, 1)
    await writeDb(db)
    
    return apiSuccess({ message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('DELETE banners error:', error)
    return apiError('Failed to delete banner', 500)
  }
}
