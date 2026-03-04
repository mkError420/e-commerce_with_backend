'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.orders.get(id).then(setOrder).finally(() => setLoading(false)) }, [id])

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
          <p className="text-sm text-gray-600">
            <span className="font-medium">Payment Status:</span> 
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
