'use client'

import React, { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, Clock, ArrowRight, Filter, Search, Eye, Download } from 'lucide-react'
import Link from 'next/link'

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([])

  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders.filter((order: any) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.products.some((product: any) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className='w-4 h-4' />
      case 'shipped':
        return <Truck className='w-4 h-4' />
      case 'processing':
        return <Clock className='w-4 h-4' />
      default:
        return <Package className='w-4 h-4' />
    }
  }

  const downloadInvoice = (orderId: string) => {
    // Simulate PDF invoice generation
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
            .invoice-info { margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #059669; color: white; padding: 12px; text-align: left; }
            .items-table td { border: 1px solid #ddd; padding: 12px; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">mk-ShopBD</div>
            <h1>INVOICE</h1>
          </div>
          
          <div class="invoice-info">
            <div class="info-row">
              <strong>Invoice Number:</strong>
              <span>${orderId}</span>
            </div>
            <div class="info-row">
              <strong>Order Date:</strong>
              <span>${order.date}</span>
            </div>
            <div class="info-row">
              <strong>Payment Method:</strong>
              <span>${order.paymentMethod}</span>
            </div>
            <div class="info-row">
              <strong>Status:</strong>
              <span>${order.status.toUpperCase()}</span>
            </div>
          </div>

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
              ${order.products.map((product: any, index: any) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>৳${product.price.toLocaleString()}</td>
                  <td>৳${(product.price * product.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="invoice-info">
            <div class="info-row total-row">
              <strong>Subtotal:</strong>
              <span>৳${order.products.reduce((sum: any, product: any) => sum + (product.price * product.quantity), 0).toLocaleString()}</span>
            </div>
            <div class="info-row total-row">
              <strong>Shipping:</strong>
              <span>৳0</span>
            </div>
            <div class="info-row total-row">
              <strong>Total Amount:</strong>
              <span>৳${order.total.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>This is a computer-generated invoice.</p>
          </div>
        </body>
      </html>
    `
    
    // Create PDF from HTML content
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(invoiceContent)
      printWindow.document.close()
      
      // Auto-print to PDF
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Orders</h1>
          
          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search orders...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                />
              </div>
            </div>
            
            <div className='flex gap-2'>
              <Filter className='w-5 h-5 text-gray-400' />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
              >
                <option value='all'>All Orders</option>
                <option value='processing'>Processing</option>
                <option value='shipped'>Shipped</option>
                <option value='delivered'>Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className='space-y-6'>
          {filteredOrders.length === 0 ? (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
              <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>No orders found</h2>
              <p className='text-gray-600 mb-6'>
                {searchTerm ? 'No orders match your search criteria.' : 'You haven\'t placed any orders yet.'}
              </p>
              <Link
                href='/shop'
                className='inline-flex items-center gap-2 bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_btn_dark_green hover:shadow-lg transition-all duration-300'
              >
                Start Shopping
                <ArrowRight className='w-5 h-5' />
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                {/* Order Header */}
                <div className='bg-gradient-to-r from-shop_light_bg to-white p-6 border-b border-gray-200'>
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>Order Number</p>
                      <p className='font-semibold text-gray-900'>{order.id}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>Order Date</p>
                      <p className='font-semibold text-gray-900'>{order.date}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>Total Amount</p>
                      <p className='font-bold text-lg text-shop_dark_green'>৳{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className='flex items-center gap-2'>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className='capitalize'>{order.status}</span>
                    </div>
                    
                    <div className='flex gap-2'>
                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className='p-2 text-gray-600 hover:text-shop_dark_green transition-colors duration-200'
                        title='Download Invoice'
                      >
                        <Download className='w-4 h-4' />
                      </button>
                      
                      <Link
                        href={`/confirmation?order=${order.id}&amount=${order.total}&items=${order.items}&method=${order.paymentMethod}`}
                        className='p-2 text-gray-600 hover:text-shop_dark_green transition-colors duration-200'
                        title='View Details'
                      >
                        <Eye className='w-4 h-4' />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className='p-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Order Items ({order.items} items)</h3>
                  <div className='space-y-4'>
                    {order.products.map((product: any, index: any) => (
                      <div key={index} className='flex gap-4 p-4 bg-gray-50 rounded-lg'>
                        <div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                          <div className='w-8 h-8 bg-gray-300 rounded'></div>
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-gray-900 mb-1'>{product.name}</h4>
                          <div className='flex justify-between items-center'>
                            <div>
                              <p className='text-sm text-gray-500'>Price</p>
                              <p className='font-semibold text-shop_dark_green'>৳{product.price.toLocaleString()}</p>
                            </div>
                            <div className='text-right'>
                              <p className='text-sm text-gray-500 mb-1'>Qty: {product.quantity}</p>
                              <p className='text-sm text-gray-500'>Subtotal: ৳{(product.price * product.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
                  <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <div className='text-center sm:text-left'>
                      <p className='text-sm text-gray-500 mb-1'>Payment Method</p>
                      <p className='font-semibold text-gray-900'>{order.paymentMethod}</p>
                    </div>
                    <div className='text-center sm:text-right'>
                      <p className='text-sm text-gray-500 mb-1'>Tracking Number</p>
                      <p className='font-mono text-sm text-shop_dark_green'>{order.trackingNumber}</p>
                    </div>
                  </div>
                  
                  <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-gray-200'>
                    <div className='text-center sm:text-left'>
                      <p className='text-sm text-gray-500 mb-1'>Estimated Delivery</p>
                      <p className='font-semibold text-gray-900'>{order.estimatedDelivery}</p>
                    </div>
                    <div className='text-center sm:text-right'>
                      <Link
                        href={`/confirmation?order=${order.id}&amount=${order.total}&items=${order.items}&method=${order.paymentMethod}`}
                        className='inline-flex items-center gap-2 bg-shop_dark_green text-white px-4 py-2 rounded-lg font-semibold hover:bg-shop_btn_dark_green transition-all duration-300'
                      >
                        Track Order
                        <ArrowRight className='w-4 h-4' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
