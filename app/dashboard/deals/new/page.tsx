'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function NewDealPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', originalPrice: '', dealPrice: '', image: '', category: 'Electronics', dealType: 'daily', endTime: '', stock: '10', description: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.deals.create({
        ...form,
        originalPrice: parseFloat(form.originalPrice),
        dealPrice: parseFloat(form.dealPrice),
        stock: parseInt(form.stock),
        endTime: form.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      router.push('/dashboard/deals')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Deal</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Original Price *</label><input required type="number" step="0.01" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Deal Price *</label><input required type="number" step="0.01" value={form.dealPrice} onChange={e => setForm({ ...form, dealPrice: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Deal Type</label><select value={form.dealType} onChange={e => setForm({ ...form, dealType: e.target.value })} className="w-full px-4 py-2 border rounded-lg"><option value="daily">Daily</option><option value="lightning">Lightning</option></select></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Deal</button>
          <Link href="/dashboard/deals" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
