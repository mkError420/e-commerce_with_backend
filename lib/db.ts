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

export interface DbSchema {
  products: Product[]
  categories: Category[]
  deals: Deal[]
  blogPosts: BlogPost[]
  orders: Order[]
  users: { id: string; email: string; password: string; name: string; role: string }[]
  banners: Banner[]
}

let cachedDb: DbSchema | null = null

async function readDb(): Promise<DbSchema> {
  if (cachedDb) return cachedDb
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    cachedDb = JSON.parse(data)
    return cachedDb!
  } catch (err) {
    cachedDb = {
      products: [],
      categories: [],
      deals: [],
      blogPosts: [],
      orders: [],
      users: [],
      banners: []
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

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
