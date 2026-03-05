import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  badge?: string
  category: string
  description?: string
  size?: string
  stock?: number
  featured?: boolean
}

export interface Category {
  id: string
  title: string
  slug: string
  href?: string
  parentId?: string
}

export interface Deal {
  id: string
  title: string
  originalPrice: number
  dealPrice: number
  discount: number
  image: string
  images: string[] // Array of additional images for gallery (max 4)
  category: string
  dealType: string
  endTime: string
  stock: number
  sold: number
  rating?: number
  reviews?: number
  description?: string
  features?: string[]
  freeShipping?: boolean
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  authorName?: string
  authorBio?: string
  category: string
  tags?: string[]
  publishedAt: string
  readTime?: string
  featured?: boolean
  likes?: number
  comments?: number
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  itemType: 'product' | 'deal'
}

export interface Order {
  id: string
  orderNumber: string
  status: string
  name: string
  email: string
  phone: string
  address: string
  district: string
  zipCode: string
  country: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  paymentInfo?: string
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  category: string
  backgroundColor: string
  gradient: string
  isActive: boolean
  position: number
}

export interface Coupon {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minAmount: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  expiresAt?: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DbSchema {
  products: Product[]
  categories: Category[]
  deals: Deal[]
  blogPosts: BlogPost[]
  orders: Order[]
  users: { id: string; email: string; password: string; name: string; role: string }[]
  banners: Banner[]
  coupons: Coupon[]
}

let cachedDb: DbSchema | null = null

async function readDb(): Promise<DbSchema> {
  if (cachedDb) {
    console.log('DB: Returning cached database with', cachedDb.products.length, 'products')
    return cachedDb
  }
  try {
    console.log('DB: Reading from file:', DB_PATH)
    const data = await fs.readFile(DB_PATH, 'utf-8')
    console.log('DB: Raw data length:', data.length)
    const parsed = JSON.parse(data)
    console.log('DB: Parsed database with', parsed.products?.length || 0, 'products')
    console.log('DB: Parsed database with', parsed.categories?.length || 0, 'categories')
    cachedDb = parsed
    return cachedDb!
  } catch (err) {
    console.error('DB: Error reading database:', err)
    cachedDb = {
      products: [],
      categories: [],
      deals: [],
      blogPosts: [],
      orders: [],
      users: [],
      banners: [],
      coupons: []
    }
    return cachedDb
  }
}

export async function writeDb(data: DbSchema): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
  cachedDb = data
}

export async function getDb(): Promise<DbSchema> {
  return readDb()
}

export function clearCache(): void {
  console.log('DB: Clearing cache')
  cachedDb = null
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
