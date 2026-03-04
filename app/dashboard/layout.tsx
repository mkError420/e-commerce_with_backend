'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, Percent, FileText, ShoppingCart, LogOut, Menu } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have a session by trying to get user data
        const response = await api.auth.me()
        setUser(response.user)
        setLoading(false)
      } catch (error) {
        // Silently redirect to login without showing errors
        setLoading(false)
        router.push('/dashboard/login')
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await api.auth.logout().catch(() => {})
    router.push('/dashboard/login')
  }

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/categories', label: 'Categories', icon: Tag },
    { href: '/dashboard/deals', label: 'Deals', icon: Percent },
    { href: '/dashboard/blog', label: 'Blog', icon: FileText },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/dashboard/banners', label: 'Banners', icon: Package }
  ]

  if (pathname === '/dashboard/login') return <>{children}</>
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && <span className="font-bold">Mk Shop Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-700 rounded"><Menu className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 ${pathname === href ? 'bg-slate-600' : ''}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/20 text-red-300">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
