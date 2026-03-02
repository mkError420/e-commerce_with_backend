const BASE = typeof window !== 'undefined' ? '' : process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}/api${path}`
  const res = await fetch(url, { ...options, credentials: 'include' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'API error')
  return json.data ?? json
}

export const api = {
  products: {
    list: (params?: { category?: string; search?: string }) =>
      fetchApi<any[]>(`/products${params ? '?' + new URLSearchParams(params as any) : ''}`),
    get: (id: string) => fetchApi<any>(`/products/${id}`),
    create: (data: any) => fetchApi<any>('/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/products/${id}`, { method: 'DELETE' })
  },
  categories: {
    list: () => fetchApi<any[]>('/categories'),
    get: (id: string) => fetchApi<any>(`/categories/${id}`),
    create: (data: any) => fetchApi<any>('/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/categories/${id}`, { method: 'DELETE' })
  },
  banners: {
    list: () => fetchApi<any[]>('/api/banners'),
    get: (id: string) => fetchApi<any>(`/api/banners/${id}`),
    create: (data: any) => fetchApi<any>('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/api/banners`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...data }) }),
    delete: (id: string) => fetchApi<any>(`/api/banners?id=${id}`, { method: 'DELETE' })
  },
  deals: {
    list: () => fetchApi<any[]>('/deals'),
    get: (id: string) => fetchApi<any>(`/deals/${id}`),
    create: (data: any) => fetchApi<any>('/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/deals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/deals/${id}`, { method: 'DELETE' })
  },
  blog: {
    list: () => fetchApi<any[]>('/blog'),
    get: (id: string) => fetchApi<any>(`/blog/${id}`),
    create: (data: any) => fetchApi<any>('/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/blog/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/blog/${id}`, { method: 'DELETE' })
  },
  orders: {
    list: () => fetchApi<any[]>('/orders'),
    get: (id: string) => fetchApi<any>(`/orders/${id}`),
    create: (data: any) => fetchApi<any>('/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  },
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; email: string }>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
    logout: () => fetchApi<any>('/auth/logout', { method: 'POST' }),
    me: () => fetchApi<{ user: { id: string; email: string; role: string } }>('/auth/me')
  }
}
