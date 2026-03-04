'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Save } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => { api.orders.list().then(setOrders).finally(() => setLoading(false)) }, [])

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ]

  const statusColor: Record<string, string> = { 
    pending: 'bg-yellow-100 text-yellow-800', 
    confirmed: 'bg-blue-100 text-blue-800', 
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800', 
    cancelled: 'bg-red-100 text-red-800' 
  }

  const paymentStatusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700'
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const updatedOrder = await api.orders.update(orderId, { status: newStatus })
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ))
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingId(orderId)
    try {
      const updatedOrder = await api.orders.update(orderId, { paymentStatus: newPaymentStatus })
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ))
    } catch (error) {
      console.error('Failed to update payment status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Order #</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Payment Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.name}<br /><span className="text-xs text-gray-500">{o.email}</span></td>
                <td className="px-4 py-3 font-semibold">৳{o.total}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[o.status] || 'bg-gray-100 text-gray-800'}`}>
                      {o.status}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                      disabled={updatingId === o.id}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === o.id && (
                      <Save className="w-3 h-3 text-blue-600 animate-spin" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColor[o.paymentStatus || 'pending']}`}>
                      {o.paymentStatus || 'Pending'}
                    </span>
                    <select
                      value={o.paymentStatus || 'pending'}
                      onChange={(e) => handlePaymentStatusUpdate(o.id, e.target.value)}
                      disabled={updatingId === o.id}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {paymentStatusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === o.id && (
                      <Save className="w-3 h-3 text-blue-600 animate-spin" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/orders/${o.id}`} className="inline-flex items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /> View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-gray-500">No orders yet.</p>}
      </div>
    </div>
  )
}
