'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, ShoppingBag, Heart, MapPin, CreditCard, Settings, Package, TrendingUp, LogOut, ChevronRight, Bell, Shield, HelpCircle, Eye, Download, Truck, Clock } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function UserDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info
        const userData = await api.auth.me()
        setUser(userData.user)

        // Get user orders
        const ordersData = await api.orders.list()
        const userOrders = ordersData.filter(order => order.email === userData.user.email)
        setOrders(userOrders)

        // Calculate stats
        const totalOrders = userOrders.length
        const pendingOrders = userOrders.filter(order => order.status === 'pending' || order.status === 'confirmed').length
        const completedOrders = userOrders.filter(order => order.status === 'delivered').length
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0)

        setStats({
          totalOrders,
          pendingOrders,
          completedOrders,
          totalSpent
        })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await api.auth.logout()
      // Redirect to login page after logout
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const recentOrders = orders.slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.email?.split('@')[0]}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completedOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/account/profile"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Edit Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/account/orders"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">View Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/account/wishlist"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Wishlist</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/account/addresses"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Addresses</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/account/payment-methods"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Payment Methods</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/account/settings"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">Logout</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt || order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                          </span>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ৳{order.total?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4" />
                          <span>{order.items?.length || order.products?.length || 0} items</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          {order.status === 'delivered' && (
                            <button
                              onClick={() => window.print()}
                              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
