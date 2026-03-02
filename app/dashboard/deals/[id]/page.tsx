'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function EditDealPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { api.deals.get(id).then(setForm).catch(() => router.push('/dashboard/deals')).finally(() => setLoading(false)) }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.deals.update(id, { ...form, originalPrice: parseFloat(form.originalPrice), dealPrice: parseFloat(form.dealPrice), stock: parseInt(form.stock) })
      router.push('/dashboard/deals')
    } finally { setSaving(false) }
  }

  if (loading || !form) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Deal</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Original Price *</label><input required type="number" step="0.01" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Deal Price *</label><input required type="number" step="0.01" value={form.dealPrice} onChange={e => setForm({ ...form, dealPrice: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Changes</button>
          <Link href="/dashboard/deals" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
