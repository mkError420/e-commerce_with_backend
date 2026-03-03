'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardDealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        <Link href="/dashboard/deals/new" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Plus className="w-4 h-4" /> Add Deal</Link>
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
            {deals.map((d) => (
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
                  <Link href={`/dashboard/deals/${d.id}`} className="inline p-2 text-blue-600 hover:bg-blue-50 rounded mr-2">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(d.id, d.title)} className="inline p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
