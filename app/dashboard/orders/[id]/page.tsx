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
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium">{order.name}</p><p className="text-sm">{order.email}</p><p className="text-sm">{order.phone}</p></div>
          <div><p className="text-sm text-gray-500">Shipping</p><p>{order.address}, {order.district}</p><p>{order.zipCode}, {order.country}</p></div>
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
        <div className="mt-4 flex justify-between font-semibold">
          <span>Subtotal</span><span>৳{order.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span><span>৳{order.shipping}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
          <span>Total</span><span className="text-green-600">৳{order.total}</span>
        </div>
        <p className="mt-4 text-sm text-gray-500">Payment: {order.paymentMethod} {order.paymentInfo && `- ${order.paymentInfo}`}</p>
      </div>
    </div>
  )
}
