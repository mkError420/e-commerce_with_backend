'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Save, Download } from 'lucide-react'
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

  const downloadDeliveryVoucher = (order: any) => {
    const voucherContent = `
      <html>
        <head>
          <title>Delivery Voucher - ${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
            .voucher-info { margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .section-title { font-weight: bold; margin: 20px 0 10px 0; color: #059669; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #059669; color: white; padding: 12px; text-align: left; }
            .items-table td { border: 1px solid #ddd; padding: 12px; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; text-align: center; }
            .signature-line { border-bottom: 1px solid #000; margin: 40px 0 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">mk-ShopBD</div>
            <h1>DELIVERY VOUCHER</h1>
          </div>
          
          <div class="voucher-info">
            <div class="info-row">
              <strong>Voucher Number:</strong>
              <span>${order.orderNumber}</span>
            </div>
            <div class="info-row">
              <strong>Order Date:</strong>
              <span>${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <strong>Expected Delivery:</strong>
              <span>${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="section-title">Customer Information</div>
          <div class="voucher-info">
            <div class="info-row">
              <strong>Name:</strong>
              <span>${order.name}</span>
            </div>
            <div class="info-row">
              <strong>Phone:</strong>
              <span>${order.phone}</span>
            </div>
            <div class="info-row">
              <strong>Email:</strong>
              <span>${order.email}</span>
            </div>
            <div class="info-row">
              <strong>Delivery Address:</strong>
              <span>${order.address}, ${order.district || ''}, ${order.zipCode || ''}</span>
            </div>
          </div>

          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any, index: any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>৳${item.price.toLocaleString()}</td>
                  <td>৳${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('') || '<tr><td colspan="4">No items found</td></tr>'}
            </tbody>
          </table>

          <div class="voucher-info">
            <div class="info-row">
              <strong>Subtotal:</strong>
              <span>৳${order.subtotal?.toLocaleString() || '0'}</span>
            </div>
            <div class="info-row">
              <strong>Shipping:</strong>
              <span>৳${order.shipping?.toLocaleString() || '0'}</span>
            </div>
            <div class="info-row" style="font-weight: bold; font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px;">
              <strong>Total Amount:</strong>
              <span>৳${order.total?.toLocaleString() || '0'}</span>
            </div>
          </div>

          <div class="section-title">Payment Information</div>
          <div class="voucher-info">
            <div class="info-row">
              <strong>Payment Method:</strong>
              <span>${order.paymentMethod || 'Cash on Delivery'}</span>
            </div>
            <div class="info-row">
              <strong>Payment Status:</strong>
              <span>${order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}</span>
            </div>
            <div class="info-row">
              <strong>Order Status:</strong>
              <span>${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}</span>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>Delivery Person Signature</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>Customer Signature</p>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated delivery voucher.</p>
            <p>Thank you for choosing mk-ShopBD!</p>
          </div>
        </body>
      </html>
    `
    
    // Create and download PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(voucherContent)
      printWindow.document.close()
      
      // Auto-print to PDF
      setTimeout(() => {
        printWindow.print()
      }, 500)
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
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => downloadDeliveryVoucher(o)}
                      className="inline-flex items-center gap-1 p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Download Delivery Voucher"
                    >
                      <Download className="w-4 h-4" /> Voucher
                    </button>
                    <Link href={`/dashboard/orders/${o.id}`} className="inline-flex items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded" title="View Order Details">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </div>
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
