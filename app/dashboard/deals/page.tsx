'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Download, ChevronDown, Search } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardDealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  const fetchDeals = async () => {
    try {
      const response = await api.deals.list() as any
      const dealsData = Array.isArray(response) ? response : (response?.data || [])
      setDeals(dealsData)
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchDeals()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return
    try {
      await api.deals.delete(id)
      await fetchDeals() // Refresh the list
    } catch (error) {
      console.error('Error deleting deal:', error)
      alert('Failed to delete deal. Please try again.')
    }
  }

  const exportToCSV = () => {
    const dealsToExport = searchTerm ? filteredDeals : deals
    const headers = [
      'Title', 'Category', 'Original Price', 'Deal Price', 'Discount', 
      'Stock', 'Sold', 'Deal Type', 'Created Date', 'Updated Date'
    ]
    
    const csvContent = [
      headers.join(','),
      ...dealsToExport.map(deal => [
        `"${deal.title || ''}"`,
        `"${deal.category || ''}"`,
        `"${deal.originalPrice || 0}"`,
        `"${deal.dealPrice || 0}"`,
        `"${deal.discount || 0}%"`,
        `"${deal.stock || 0}"`,
        `"${deal.sold || 0}"`,
        `"${deal.dealType || ''}"`,
        `"${new Date(deal.createdAt).toLocaleDateString()}"`,
        `"${new Date(deal.updatedAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `deals_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportDropdown(false)
  }

  const exportToPDF = () => {
    const dealsToExport = searchTerm ? filteredDeals : deals
    const pdfContent = `
      <html>
        <head>
          <title>Deals Export - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
            .deals-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .deals-table th { background: #059669; color: white; padding: 12px; text-align: left; }
            .deals-table td { border: 1px solid #ddd; padding: 12px; }
            .deals-table tr:nth-child(even) { background: #f9f9f9; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
            .summary { margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; }
            .deal-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
            .discount-badge { background: #dc2626; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
            .stock-low { color: #dc2626; font-weight: bold; }
            .stock-medium { color: #d97706; font-weight: bold; }
            .stock-good { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">mk-ShopBD</div>
            <h1>DEALS EXPORT REPORT</h1>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Deals: ${dealsToExport.length}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Deals: ${dealsToExport.length}</p>
            <p>Total Stock: ${dealsToExport.reduce((sum, deal) => sum + (deal.stock || 0), 0)}</p>
            <p>Total Sold: ${dealsToExport.reduce((sum, deal) => sum + (deal.sold || 0), 0)}</p>
            <p>Average Discount: ${dealsToExport.length > 0 ? (dealsToExport.reduce((sum, deal) => sum + (deal.discount || 0), 0) / dealsToExport.length).toFixed(1) : '0'}%</p>
            <p>Total Revenue Potential: ৳${dealsToExport.reduce((sum, deal) => sum + ((deal.dealPrice || 0) * (deal.stock || 0)), 0).toLocaleString()}</p>
          </div>
          
          <table class="deals-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Original Price</th>
                <th>Deal Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${dealsToExport.map((deal, index) => `
                <tr>
                  <td>
                    <strong>${deal.title}</strong>
                    <div style="font-size: 12px; color: #666;">ID: ${deal.id}</div>
                  </td>
                  <td>${deal.category || 'Uncategorized'}</td>
                  <td>৳${(deal.originalPrice || 0).toLocaleString()}</td>
                  <td>৳${(deal.dealPrice || 0).toLocaleString()}</td>
                  <td><span class="discount-badge">-${deal.discount || 0}%</span></td>
                  <td class="${(deal.stock || 0) <= 5 ? 'stock-low' : (deal.stock || 0) <= 10 ? 'stock-medium' : 'stock-good'}">${deal.stock || 0} left</td>
                  <td>${deal.sold || 0} sold</td>
                  <td>${deal.dealType === 'lightning' ? '⚡ Lightning' : '📅 Daily'}</td>
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportDropdown && !(event.target as Element).closest('.export-dropdown')) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportDropdown])

  const filteredDeals = deals.filter(deal => {
    const searchLower = searchTerm.toLowerCase()
    return (
      deal.title?.toLowerCase().includes(searchLower) ||
      deal.category?.toLowerCase().includes(searchLower) ||
      deal.dealType?.toLowerCase().includes(searchLower) ||
      deal.id?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Deals</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchDeals} 
          className="bg-shop_dark_green text-white px-6 py-2 rounded-lg hover:bg-shop_light_green"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Deals</h2>
        <div className="flex items-center gap-4">
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
                <button
                  onClick={exportToCSV}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>
            )}
          </div>
          <Link href="/dashboard/deals/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Deal
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals by title, category, type, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
        </div>
      </div>
      
      {deals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Deals Found</h2>
          <p className="text-gray-600 mb-6">Start by creating your first deal!</p>
          <Link 
            href="/dashboard/deals/new" 
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Deal
          </Link>
        </div>
      ) : (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Original Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Deal Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Discount</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Stock</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">{d.title}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {d.id}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {d.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">৳{d.originalPrice}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">৳{d.dealPrice}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    -{d.discount}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <span className={`font-medium ${
                      d.stock <= 5 ? 'text-red-600' : d.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {d.stock}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">left</span>
                  </div>
                  <div className="text-xs text-gray-500">{d.sold} sold</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    d.dealType === 'lightning' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {d.dealType === 'lightning' ? '⚡ Lightning' : '📅 Daily'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Link 
                      href={`/dashboard/deals/${d.id}`} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 text-sm font-medium"
                      title="Edit Deal"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(d.id, d.title)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 text-sm font-medium"
                      title="Delete Deal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDeals.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            {searchTerm 
              ? 'No deals found matching your search.' 
              : 'No deals yet. Add your first deal!'
            }
          </p>
        )}
      </div>
      )}
    </div>
  )
}
