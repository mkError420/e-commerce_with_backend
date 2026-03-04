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
        // Fetch all data in parallel - single call for each endpoint
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

        // Use already fetched data instead of making new API calls
        setRecentOrders(orders?.slice(0, 5) || [])
        setTopProducts(products?.slice(0, 5) || [])

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
                  <div key={order.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{order.orderNumber}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Order Date: {order.orderDate || new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">৳{order.total}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="border-t pt-4 mb-4">
                      <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Customer Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Name:</p>
                          <p className="font-medium text-gray-900">{order.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email:</p>
                          <p className="font-medium text-gray-900">{order.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone:</p>
                          <p className="font-medium text-gray-900">{order.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Address:</p>
                          <p className="font-medium text-gray-900">{order.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Details
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Method:</p>
                          <p className="font-medium text-gray-900">{order.paymentMethod || 'Cash on Delivery'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status:</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                            order.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-600">Transaction ID:</p>
                          <p className="font-medium text-gray-900">{order.paymentInfo || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Items: {order.items?.length || 0} products</p>
                          <p className="text-xs text-gray-500">Order ID: #{order.id}</p>
                        </div>
                        <Link 
                          href={`/dashboard/orders/${order.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No recent orders</p>
                  <p className="text-gray-400 text-sm mt-1">Orders will appear here once customers start shopping</p>
                </div>
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
                        <p className="text-sm text-gray-500">৳{product.price}</p>
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
            <p className="text-2xl font-bold text-blue-900">৳0.00</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-green-600">This Week</p>
            <p className="text-2xl font-bold text-green-900">৳0.00</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-purple-600">This Month</p>
            <p className="text-2xl font-bold text-purple-900">৳0.00</p>
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
