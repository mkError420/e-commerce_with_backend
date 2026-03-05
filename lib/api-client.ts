const BASE = typeof window !== 'undefined' ? '' : process.env.NEXTAUTH_URL || 'http://localhost:3001'

// Simple client-side cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCacheKey(path: string, options?: RequestInit): string {
  return `${path}${JSON.stringify(options || {})}`
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Cache HIT for:', key)
    }
    return cached.data
  }
  if (cached) {
    cache.delete(key)
  }
  return null
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
  if (process.env.NODE_ENV === 'development') {
    console.log('Cache SET for:', key)
  }
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const cacheKey = getCacheKey(path, options)
  
  // Only cache GET requests
  if (!options || options.method === 'GET' || !options.method) {
    const cached = getFromCache<T>(cacheKey)
    if (cached) {
      return cached
    }
  }

  const url = path.startsWith('http') ? path : `${BASE}/api${path}`
  if (process.env.NODE_ENV === 'development' && path !== '/auth/me') {
    console.log('fetchApi: Calling URL:', url)
  }
  
  const res = await fetch(url, { ...options, credentials: 'include' })
  if (!res.ok) {
    // Don't log 401 errors for auth me endpoint (expected when not logged in)
    if (!(path === '/auth/me' && res.status === 401)) {
      console.error('fetchApi: Error response:', res.status, res.statusText)
    }
    // For auth me 401, throw a silent error
    if (path === '/auth/me' && res.status === 401) {
      throw new Error('Unauthorized')
    }
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  const data = json.data ?? json
  if (process.env.NODE_ENV === 'development') {
    console.log('fetchApi: Response data length:', Array.isArray(data) ? data.length : 'not array')
  }
  
  // Cache successful GET requests
  if (!options || options.method === 'GET' || !options.method) {
    setCache(cacheKey, data)
  }
  
  return data
}

export const api = {
  products: {
    list: (params?: { category?: string; search?: string; featured?: string }) =>
      fetchApi<any[]>(`/products${params ? '?' + new URLSearchParams(params as any) : ''}`),
    get: (id: string) => fetchApi<any>(`/products/${encodeURIComponent(id)}`),
    create: (data: any) => fetchApi<any>('/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/products/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/products?id=${id}`, { method: 'DELETE' })
  },
  categories: {
    list: () => fetchApi<any[]>('/categories'),
    get: (id: string) => fetchApi<any>(`/categories/${encodeURIComponent(id)}`),
    create: (data: any) => fetchApi<any>('/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/categories/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  banners: {
    list: () => fetchApi<any[]>('/banners'),
    get: (id: string) => fetchApi<any>(`/banners/${id}`),
    create: (data: any) => fetchApi<any>('/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`banners`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...data }) }),
    delete: (id: string) => fetchApi<any>(`/banners?id=${id}`, { method: 'DELETE' })
  },
  deals: {
    list: () => fetchApi<any[]>('/deals'),
    get: (id: string) => fetchApi<any>(`/deals/${encodeURIComponent(id)}`),
    create: (data: any) => fetchApi<any>('/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/deals/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/deals/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  blog: {
    list: () => fetchApi<any[]>('/blog'),
    get: (id: string) => fetchApi<any>(`/blog/${encodeURIComponent(id)}`),
    create: (data: any) => fetchApi<any>('/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/blog/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/blog/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  orders: {
    list: () => fetchApi<any[]>('/orders'),
    get: (id: string) => fetchApi<any>(`/orders?id=${encodeURIComponent(id)}`),
    create: (data: any) => fetchApi<any>('/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/orders?id=${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  },
  coupons: {
    list: (params?: { code?: string; active?: string }) =>
      fetchApi<any[]>(`/coupons${params ? '?' + new URLSearchParams(params as any) : ''}`),
    get: (code: string) => fetchApi<any>(`/coupons?code=${encodeURIComponent(code)}`),
    create: (data: any) => fetchApi<any>('/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/coupons?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/coupons?id=${id}`, { method: 'DELETE' })
  },
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; email: string }>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
    logout: () => fetchApi<any>('/auth/logout', { method: 'POST' }),
    me: () => fetchApi<{ user: { id: string; email: string; role: string } }>('/auth/me')
  },
  clearCache: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Clearing API client cache')
    }
    cache.clear()
  }
}
