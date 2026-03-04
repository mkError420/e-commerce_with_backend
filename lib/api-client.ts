const BASE = typeof window !== 'undefined' ? '' : process.env.NEXTAUTH_URL || 'http://localhost:3001'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}/api${path}`
  console.log('fetchApi: Calling URL:', url)
  const res = await fetch(url, { ...options, credentials: 'include' })
  if (!res.ok) {
    console.error('fetchApi: Error response:', res.status, res.statusText)
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  console.log('fetchApi: Response data length:', Array.isArray(json) ? json.length : 'not array')
  return json.data ?? json
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
    update: (id: string, data: any) => fetchApi<any>('/banners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...data }) }),
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
    get: (id: string) => fetchApi<any>(`/orders/${encodeURIComponent(id)}`),
    create: (data: any) => fetchApi<any>('/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/orders/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  },
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; email: string }>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
    logout: () => fetchApi<any>('/auth/logout', { method: 'POST' }),
    me: () => fetchApi<{ user: { id: string; email: string; role: string } }>('/auth/me')
  }
}
