'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Tag, Percent, FileText, ShoppingCart, TrendingUp, Activity, Users, DollarSign, ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, deals: 0, blog: 0, orders: 0, banners: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const [products, categories, deals, blog, orders] = await Promise.all([
          api.products.list(),
          api.categories.list(),
          api.deals.list(),
          api.blog.list(),
          api.orders.list()
        ])
        
        const bannerCount = categories?.slice(0, 4).length || 0
        
        setStats({
          products: products?.length ?? 0,
          categories: categories?.length ?? 0,
          deals: deals?.length ?? 0,
          blog: blog?.length ?? 0,
          orders: orders?.length ?? 0,
          banners: bannerCount
        })

        // Fetch recent orders
        const recentOrdersData = await api.orders.list()
        setRecentOrders(recentOrdersData?.slice(0, 5) || [])

        // Fetch top products (mock data for now)
        const productsData = await api.products.list()
        setTopProducts(productsData?.slice(0, 5) || [])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const cards = [
    { label: 'Products', value: stats.products, href: '/dashboard/products', icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: stats.categories, href: '/dashboard/categories', icon: Tag, color: 'bg-green-500' },
    { label: 'Deals', value: stats.deals, href: '/dashboard/deals', icon: Percent, color: 'bg-orange-500' },
    { label: 'Blog Posts', value: stats.blog, href: '/dashboard/blog', icon: FileText, color: 'bg-purple-500' },
    { label: 'Orders', value: stats.orders, href: '/dashboard/orders', icon: ShoppingCart, color: 'bg-amber-500' },
    { label: 'Banners', value: stats.banners, href: '/dashboard/banners', icon: Package, color: 'bg-indigo-500' }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(({ label, value, href, icon: Icon, color }) => (
          <Link key={label} href={href} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center gap-4">
            <div className={`${color} p-3 rounded-lg text-white`}><Icon className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* New Section: Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Recent Orders
            </h3>
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:underline">View All →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customer?.name || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Products
            </h3>
            <Link href="/dashboard/products" className="text-sm text-blue-600 hover:underline">View All →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Stock: {product.stock || 'N/A'}</p>
                      <p className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {product.badge || 'Available'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No products available</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Revenue Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Today's Revenue</p>
            <p className="text-2xl font-bold text-blue-900">$0.00</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-green-600">This Week</p>
            <p className="text-2xl font-bold text-green-900">$0.00</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-purple-600">This Month</p>
            <p className="text-2xl font-bold text-purple-900">$0.00</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="text-green-600 hover:underline">View Store →</Link>
          <Link href="/shop" className="text-green-600 hover:underline">Shop Page →</Link>
          <Link href="/dashboard/products" className="text-green-600 hover:underline">Add Product →</Link>
          <Link href="/dashboard/orders" className="text-green-600 hover:underline">View Orders →</Link>
          <Link href="/dashboard/categories" className="text-green-600 hover:underline">Manage Categories →</Link>
          <Link href="/dashboard/deals" className="text-green-600 hover:underline">Create Deals →</Link>
          <Link href="/dashboard/banners" className="text-green-600 hover:underline">Manage Banners →</Link>
        </div>
      </div>
    </div>
  )
}
