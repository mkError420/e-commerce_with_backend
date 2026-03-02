'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardDealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.deals.list().then(setDeals).finally(() => setLoading(false)) }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await api.deals.delete(id)
    setDeals(prev => prev.filter(d => d.id !== id))
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Deals</h2>
        <Link href="/dashboard/deals/new" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Plus className="w-4 h-4" /> Add Deal</Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-medium text-gray-700">Title</th><th className="text-left px-4 py-3 font-medium text-gray-700">Price</th><th className="text-left px-4 py-3 font-medium text-gray-700">Deal Price</th><th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th></tr></thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{d.title}</td>
                <td className="px-4 py-3">৳{d.originalPrice}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">৳{d.dealPrice}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/deals/${d.id}`} className="inline p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></Link>
                  <button onClick={() => handleDelete(d.id, d.title)} className="inline p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
