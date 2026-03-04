'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => { 
    api.orders.get(id).then((orderData) => {
      setOrder(orderData)
      setNewStatus(orderData.status || 'pending')
    }).finally(() => setLoading(false)) 
  }, [id])

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) return
    
    setUpdating(true)
    try {
      const updatedOrder = await api.orders.update(order.id, { status: newStatus })
      setOrder(updatedOrder)
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading || !order) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Orders</Link>
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order {order.orderNumber}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Customer Information</p>
            <p className="font-medium">{order.name}</p>
            <p className="text-sm text-gray-600">{order.email}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
            <p className="text-sm">{order.address}</p>
            <p className="text-sm">{order.district}</p>
            <p className="text-sm">{order.zipCode}, {order.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Payment Details</p>
            <p className="text-sm"><span className="font-medium">Method:</span> {order.paymentMethod}</p>
            <p className="text-sm"><span className="font-medium">Payment Phone:</span> {order.phone}</p>
            {order.paymentInfo && <p className="text-sm"><span className="font-medium">Info:</span> {order.paymentInfo}</p>}
          </div>
        </div>
        <div className="border-t pt-4">
          <p className="font-medium mb-2">Items</p>
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b">
              <span>{item.name} x {item.quantity}</span>
              <span>৳{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-6">
          <h4 className="font-medium text-gray-700 mb-4">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">৳{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">৳{order.shipping}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-green-600">৳{order.total}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  statusOptions.find(s => s.value === order.status)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {statusOptions.find(s => s.value === order.status)?.label || order.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Order Status
            </label>
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.status}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
