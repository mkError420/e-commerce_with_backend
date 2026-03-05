'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Save, Download, Search, ChevronDown, TrendingUp, TrendingDown, Package, DollarSign, Users, ShoppingCart, BarChart3, PieChart, Calendar, Filter } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [dateRange, setDateRange] = useState('all')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tableStartDate, setTableStartDate] = useState('')
  const [tableEndDate, setTableEndDate] = useState('')
  const [showTableCalendar, setShowTableCalendar] = useState(false)

  // Filter orders by date range
  const filterOrdersByDate = (orders: any[], range: string, startDate?: string, endDate?: string) => {
    if (range === 'all') return orders
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (range === 'custom' && startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Include end date fully
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= start && orderDate <= end
      })
    }
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      
      switch (range) {
        case 'today':
          return orderDate >= today
        case '7days':
          const sevenDaysAgo = new Date(today)
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          return orderDate >= sevenDaysAgo
        case '30days':
          const thirtyDaysAgo = new Date(today)
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return orderDate >= thirtyDaysAgo
        default:
          return true
      }
    })
  }

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    const paidOrders = orders.filter(order => order.paymentStatus === 'paid').length
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length
    
    // Calculate growth (mock data for demonstration)
    const revenueGrowth = 12.5
    const ordersGrowth = 8.3
    
    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders,
      completedOrders,
      paidOrders,
      cancelledOrders,
      revenueGrowth,
      ordersGrowth
    }
  }

  const stats = calculateStats()

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#eab308' },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: '#3b82f6' },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#8b5cf6' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#6366f1' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' }
  ]

  // Recent orders for timeline
  const recentOrders = orders.slice(0, 5)

  useEffect(() => { 
    api.orders.list().then(orders => {
      // Sort orders by creation date (newest first)
      const sortedOrders = orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sortedOrders)
    }).finally(() => setLoading(false)) 
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportDropdown && !(event.target as Element).closest('.export-dropdown')) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportDropdown])

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.phone?.toLowerCase().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower)
    )
    
    // Apply date filtering
    const dateFilteredOrders = filterOrdersByDate([order], dateRange, tableStartDate, tableEndDate)
    const matchesDate = dateFilteredOrders.length > 0
    
    return matchesSearch && matchesDate
  })

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
      setOrders(prev => {
        const updatedOrders = prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
        // Re-sort to maintain order (newest first)
        return updatedOrders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      })
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
      setOrders(prev => {
        const updatedOrders = prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
        // Re-sort to maintain order (newest first)
        return updatedOrders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      })
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
            @page { margin: 15mm; size: A4; }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 10px;
              font-size: 12px;
              line-height: 1.2;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px; 
              border-bottom: 2px solid #059669; 
              padding-bottom: 10px; 
            }
            .logo { font-size: 20px; font-weight: bold; color: #059669; margin-bottom: 5px; }
            .logo h1 { font-size: 16px; margin: 5px 0; }
            .voucher-info { margin: 10px 0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .section-title { font-weight: bold; margin: 10px 0 5px 0; color: #059669; font-size: 13px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
            .items-table th { background: #059669; color: white; padding: 6px; text-align: left; }
            .items-table td { border: 1px solid #ddd; padding: 6px; }
            .footer { text-align: center; margin-top: 15px; color: #666; font-size: 10px; }
            .signature-section { margin-top: 20px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; text-align: center; font-size: 10px; }
            .signature-line { border-bottom: 1px solid #000; margin: 20px 0 5px 0; }
            .total-row { font-weight: bold; font-size: 14px; border-top: 1px solid #ddd; padding-top: 5px; }
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
              <strong>Address:</strong>
              <span>${order.address}, ${order.district || ''}, ${order.zipCode || ''}</span>
            </div>
          </div>

          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Qty</th>
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
            <div class="info-row total-row">
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

  const exportToCSV = () => {
    const filteredBySearch = searchTerm ? filteredOrders : orders
    const ordersToExport = filterOrdersByDate(filteredBySearch, dateRange, tableStartDate, tableEndDate)
    
    const headers = [
      'Order Number', 'Customer Name', 'Email', 'Phone', 'Address', 
      'Total Amount', 'Payment Method', 'Payment Status', 'Order Status', 
      'Order Date', 'Items Count'
    ]
    
    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(order => [
        `"${order.orderNumber || ''}"`,
        `"${order.name || ''}"`,
        `"${order.email || ''}"`,
        `"${order.phone || ''}"`,
        `"${order.address || ''}"`,
        `"${order.total || 0}"`,
        `"${order.paymentMethod || ''}"`,
        `"${order.paymentStatus || ''}"`,
        `"${order.status || ''}"`,
        `"${new Date(order.createdAt).toLocaleDateString()}"`,
        `"${order.items?.length || 0}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    let dateRangeText = dateRange
    if (dateRange === 'custom' && tableStartDate && tableEndDate) {
      dateRangeText = `${tableStartDate}_to_${tableEndDate}`
    }
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_export_${dateRangeText}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportDropdown(false)
  }

  const exportToPDF = () => {
    const filteredBySearch = searchTerm ? filteredOrders : orders
    const ordersToExport = filterOrdersByDate(filteredBySearch, dateRange, tableStartDate, tableEndDate)
    
    let dateRangeText = 'All Dates'
    if (dateRange === 'custom' && tableStartDate && tableEndDate) {
      dateRangeText = `${new Date(tableStartDate).toLocaleDateString()} - ${new Date(tableEndDate).toLocaleDateString()}`
    } else if (dateRange === 'today') {
      dateRangeText = 'Today'
    } else if (dateRange === '7days') {
      dateRangeText = 'Last 7 Days'
    } else if (dateRange === '30days') {
      dateRangeText = 'Last 30 Days'
    }
    
    const pdfContent = `
      <html>
        <head>
          <title>Orders Export - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
            .orders-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .orders-table th { background: #059669; color: white; padding: 12px; text-align: left; }
            .orders-table td { border: 1px solid #ddd; padding: 12px; }
            .orders-table tr:nth-child(even) { background: #f9f9f9; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
            .summary { margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">mk-ShopBD</div>
            <h1>ORDERS EXPORT REPORT</h1>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Date Range: ${dateRangeText}</p>
            <p>Total Orders: ${ordersToExport.length}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Revenue: ৳${ordersToExport.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}</p>
            <p>Pending Orders: ${ordersToExport.filter(order => order.status === 'pending').length}</p>
            <p>Completed Orders: ${ordersToExport.filter(order => order.status === 'delivered').length}</p>
            <p>Paid Orders: ${ordersToExport.filter(order => order.paymentStatus === 'paid').length}</p>
          </div>
          
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${ordersToExport.map((order, index) => `
                <tr>
                  <td>${order.orderNumber}</td>
                  <td>
                    <strong>${order.name}</strong><br>
                    <small>${order.address}</small>
                  </td>
                  <td>
                    <div>${order.phone}</div>
                    <small>${order.email}</small>
                  </td>
                  <td>৳${(order.total || 0).toLocaleString()}</td>
                  <td>
                    <span style="background: ${order.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7'}; color: ${order.paymentStatus === 'paid' ? '#065f46' : '#92400e'}; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                      ${order.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td>
                    <span style="background: ${order.status === 'delivered' ? '#d1fae5' : order.status === 'cancelled' ? '#fee2e2' : '#fef3c7'}; color: ${order.status === 'delivered' ? '#065f46' : order.status === 'cancelled' ? '#991b1b' : '#92400e'}; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                      ${order.status || 'pending'}
                    </span>
                  </td>
                  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is a computer-generated report.</p>
            <p>© ${new Date().getFullYear()} mk-ShopBD. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(pdfContent)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
    setShowExportDropdown(false)
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      {/* Dashboard Diagram Section */}
      <div className="mb-8">
        {/* Header with Date Filter */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Orders Dashboard</h2>
            <p className="text-gray-600 mt-1">Monitor your orders and sales performance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {dateRange === '7days' ? 'Last 7 Days' : dateRange === '30days' ? 'Last 30 Days' : 'Today'}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => { setDateRange('today'); setShowDatePicker(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => { setDateRange('7days'); setShowDatePicker(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => { setDateRange('30days'); setShowDatePicker(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    Last 30 Days
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.revenueGrowth}%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.ordersGrowth}%</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{Math.round(stats.avgOrderValue).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <Package className="w-4 h-4 text-gray-600 mr-1" />
                  <span className="text-sm text-gray-600">Per order</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                <div className="flex items-center mt-2">
                  <Users className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm text-yellow-600">Need attention</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Order Status Distribution</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {statusDistribution.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm text-gray-600">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalOrders > 0 ? (status.value / stats.totalOrders) * 100 : 0}%`,
                          backgroundColor: status.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{status.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-xl font-bold text-green-700">{stats.completedOrders}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Paid</p>
                    <p className="text-xl font-bold text-blue-700">{stats.paidOrders}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-700">{stats.pendingOrders}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded">
                    <Package className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Cancelled</p>
                    <p className="text-xl font-bold text-red-700">{stats.cancelledOrders}</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700">
              View all orders →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.name} • ৳{order.total?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recent orders found</p>
            )}
          </div>
        </div>
      </div>

      {/* Original Orders Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Orders</h2>
        <div className="flex items-center gap-4">
          {/* Date Filter for Table */}
          <div className="relative">
            <button
              onClick={() => setShowTableCalendar(!showTableCalendar)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {dateRange === 'all' ? 'All Dates' : 
                 dateRange === 'today' ? 'Today' : 
                 dateRange === '7days' ? 'Last 7 Days' : 
                 dateRange === '30days' ? 'Last 30 Days' :
                 dateRange === 'custom' && tableStartDate && tableEndDate ?
                 `${new Date(tableStartDate).toLocaleDateString()} - ${new Date(tableEndDate).toLocaleDateString()}` :
                 'Custom Range'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTableCalendar ? 'rotate-180' : ''}`} />
            </button>
            {showTableCalendar && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3">
                  <div className="space-y-2">
                    <button
                      onClick={() => { setDateRange('all'); setShowTableCalendar(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      All Dates
                    </button>
                    <button
                      onClick={() => { setDateRange('today'); setShowTableCalendar(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => { setDateRange('7days'); setShowTableCalendar(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => { setDateRange('30days'); setShowTableCalendar(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                    >
                      Last 30 Days
                    </button>
                    <button
                      onClick={() => { setDateRange('custom'); setShowTableCalendar(false); setTimeout(() => setShowTableCalendar(true), 100) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded border-t border-gray-200"
                    >
                      Custom Range
                    </button>
                  </div>
                  
                  {/* Custom Date Picker for Table */}
                  {dateRange === 'custom' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Start Date</label>
                          <input
                            type="date"
                            value={tableStartDate}
                            onChange={(e) => setTableStartDate(e.target.value)}
                            max={tableEndDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">End Date</label>
                          <input
                            type="date"
                            value={tableEndDate}
                            onChange={(e) => setTableEndDate(e.target.value)}
                            min={tableStartDate}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => { setDateRange('all'); setTableStartDate(''); setTableEndDate('') }}
                            className="flex-1 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => setShowTableCalendar(false)}
                            disabled={!tableStartDate || !tableEndDate}
                            className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by order number, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
            />
          </div>
          
          <div className="relative export-dropdown">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-xs text-gray-600">
                    Exporting: {dateRange === 'all' ? 'All Dates' : 
                               dateRange === 'today' ? 'Today' : 
                               dateRange === '7days' ? 'Last 7 Days' : 
                               dateRange === '30days' ? 'Last 30 Days' :
                               dateRange === 'custom' && tableStartDate && tableEndDate ?
                               `${new Date(tableStartDate).toLocaleDateString()} - ${new Date(tableEndDate).toLocaleDateString()}` :
                               'Custom Range'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{filteredOrders.length} orders</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 rounded"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export as CSV</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 rounded"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export as PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
            {filteredOrders.map((o) => (
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
                <td className="px-4 py-3 text-gray-600">
                  <div>{new Date(o.createdAt).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleTimeString()}</div>
                </td>
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
        {filteredOrders.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            {searchTerm ? 'No orders found matching your search.' : 'No orders yet.'}
          </p>
        )}
      </div>
    </div>
  )
}
