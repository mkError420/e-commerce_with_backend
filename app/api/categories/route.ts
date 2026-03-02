import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  const db = await getDb()
  return apiSuccess(db.categories)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, slug, href, parentId } = body
    if (!title) return apiError('Title required', 400)
    const db = await getDb()
    const slugVal = slug || title.toLowerCase().replace(/\s+/g, '-')
    const category = {
      id: generateId(),
      title,
      slug: slugVal,
      href: href || slugVal,
      parentId: parentId || undefined
    }
    db.categories.push(category)
    await writeDb(db)
    return apiSuccess(category, 201)
  } catch {
    return apiError('Failed to create category', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) return apiError('Category ID required', 400)
    
    const db = await getDb()
    const categoryIndex = db.categories.findIndex((cat: any) => cat.id === id)
    
    if (categoryIndex === -1) return apiError('Category not found', 404)
    
    // Remove category and any subcategories
    db.categories = db.categories.filter((cat: any) => cat.id !== id && cat.parentId !== id)
    await writeDb(db)
    
    return apiSuccess({ message: 'Category deleted successfully' })
  } catch {
    return apiError('Failed to delete category', 500)
  }
}
