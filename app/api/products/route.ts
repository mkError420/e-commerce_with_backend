import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId, clearCache } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')
  const db = await getDb()
  let products = [...db.products]
  
  console.log('API - Original products count:', products.length)
  console.log('API - Category filter:', category)
  console.log('API - Search filter:', search)
  console.log('API - Featured filter:', featured)
  
  // Auto-mark products with valid categories as featured
  products = products.map(product => ({
    ...product,
    featured: product.category && product.category !== 'Uncategorized' ? true : product.featured
  }))
  
  console.log('API - After marking featured:', products.map(p => ({ name: p.name, category: p.category, featured: p.featured })))
  
  // Apply category filter if provided
  if (category && category !== 'all') {
    // Create a mapping of category slugs to titles
    const categorySlugToTitleMap: { [key: string]: string } = {}
    db.categories.forEach((cat: any) => {
      categorySlugToTitleMap[cat.slug] = cat.title
      // Also map subcategories
      if (cat.subcategories) {
        cat.subcategories.forEach((sub: any) => {
          categorySlugToTitleMap[sub.slug] = sub.title
        })
      }
    })
    
    console.log('API - Category slug to title map:', categorySlugToTitleMap)
    
    // Get the actual category title from the slug
    const categoryTitle = categorySlugToTitleMap[category] || category
    console.log('API - Converted category slug to title:', category, '->', categoryTitle)
    
    // Enhanced category filtering to support both exact match and partial matching for subcategories
    products = products.filter(p => {
      const productCategory = p.category?.toLowerCase() || ''
      const searchCategory = categoryTitle.toLowerCase()
      
      console.log('API - Filtering product:', p.name, 'productCategory:', productCategory, 'searchCategory:', searchCategory)
      
      // Exact match
      if (productCategory === searchCategory) {
        console.log('API - Exact match found')
        return true
      }
      
      // Check if this is a subcategory match (contains the category name)
      if (productCategory.includes(searchCategory) || searchCategory.includes(productCategory)) {
        console.log('API - Partial match found')
        return true
      }
      
      console.log('API - No match found')
      return false
    })
    console.log('API - After category filter:', products.length)
  }
  
  // Apply search filter
  if (search) {
    products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    console.log('API - After search filter:', products.length)
  }
  
  // Apply featured filter
  if (featured === 'true') {
    products = products.filter(p => p.featured)
    console.log('API - After featured filter:', products.length)
  }
  
  console.log('API - Final products count:', products.length)
  return apiSuccess(products)
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Product ID required', 400)
    
    const body = await req.json()
    const { name, price, originalPrice, image, rating, reviews, badge, category, description, size, stock } = body
    
    if (!name || price == null) return apiError('Name and price required', 400)
    
    const db = await getDb()
    const productIndex = db.products.findIndex((product: any) => product.id === id)
    
    if (productIndex === -1) return apiError('Product not found', 404)
    
    // Update product
    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      price: price != null ? Number(price) : db.products[productIndex].price,
      originalPrice: originalPrice ? Number(originalPrice) : db.products[productIndex].originalPrice,
      image: image || db.products[productIndex].image,
      rating: rating != null ? Number(rating) : db.products[productIndex].rating,
      reviews: reviews != null ? Number(reviews) : db.products[productIndex].reviews,
      badge: badge || db.products[productIndex].badge,
      category: category || db.products[productIndex].category,
      description: description || db.products[productIndex].description,
      size: size || db.products[productIndex].size,
      stock: stock != null ? Number(stock) : db.products[productIndex].stock
    }
    
    await writeDb(db)
    clearCache() // Clear cache after write
    return apiSuccess(db.products[productIndex])
  } catch (error) {
    console.error('Error updating product:', error)
    return apiError('Failed to update product', 500)
  }
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
    clearCache() // Clear cache after write
    return apiSuccess(product, 201)
  } catch (e) {
    return apiError('Failed to create product', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Product ID required', 400)
    
    const db = await getDb()
    const productIndex = db.products.findIndex((product: any) => product.id === id)
    
    if (productIndex === -1) return apiError('Product not found', 404)
    
    // Remove product
    db.products.splice(productIndex, 1)
    
    await writeDb(db)
    clearCache() // Clear cache after write
    return apiSuccess({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return apiError('Failed to delete product', 500)
  }
}
