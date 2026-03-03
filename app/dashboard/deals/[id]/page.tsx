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
  const [error, setError] = useState('')

  useEffect(() => { 
    const fetchDeal = async () => {
      try {
        console.log('=== Edit Deal Fetch Started ===')
        console.log('Fetching deal with ID:', id)
        
        const response = await api.deals.get(id) as any
        console.log('Raw API response:', response)
        console.log('Response type:', typeof response)
        console.log('Response keys:', response ? Object.keys(response) : 'null/undefined')
        
        // The fetchApi function returns json.data ?? json, so response is already the deal object
        if (!response) {
          throw new Error('No response from server')
        }
        
        // Check if response is the deal object directly (has deal properties)
        if (response.id && response.title && response.originalPrice) {
          console.log('Response is deal object directly')
          const dealData = response
          console.log('Deal data received:', dealData)
          
          // Initialize form with deal data
          setForm({
            ...dealData,
            features: dealData.features ? dealData.features.join(', ') : '',
            endTime: dealData.endTime ? new Date(dealData.endTime).toISOString().slice(0, 16) : ''
          })
          
          console.log('Form initialized successfully')
        } else if (response.success && response.data) {
          console.log('Response is wrapped in success/data format')
          const dealData = response.data
          console.log('Deal data received:', dealData)
          
          // Initialize form with deal data
          setForm({
            ...dealData,
            features: dealData.features ? dealData.features.join(', ') : '',
            endTime: dealData.endTime ? new Date(dealData.endTime).toISOString().slice(0, 16) : ''
          })
          
          console.log('Form initialized successfully')
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (error: any) {
        console.error('=== Edit Deal Fetch Error ===')
        console.error('Error details:', error)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        setError('Failed to load deal. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchDeal()
    } else {
      setError('Invalid deal ID')
      setLoading(false)
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    
    try {
      const dealData = {
        ...form,
        originalPrice: parseFloat(form.originalPrice),
        dealPrice: parseFloat(form.dealPrice),
        stock: parseInt(form.stock),
        rating: parseFloat(form.rating),
        reviews: parseInt(form.reviews),
        features: form.features ? form.features.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [],
        endTime: form.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      console.log('Updating deal with ID:', id)
      console.log('Deal data:', dealData)
      
      const response = await api.deals.update(id, dealData)
      console.log('Update response:', response)
      
      // Check if update was successful
      if (response) {
        console.log('Deal updated successfully')
        router.push('/dashboard/deals')
      } else {
        throw new Error('Update failed - no response from server')
      }
    } catch (error: any) {
      console.error('Error updating deal:', error)
      setError(error.message || 'Failed to update deal. Please try again.')
    } finally { 
      setSaving(false) 
    }
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  if (error) {
    return (
      <div>
        <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Deal</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter deal title" /></div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Original Price *</label><input required type="number" step="0.01" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="0.00" /></div>
          <div><label className="block text-sm font-medium mb-1">Deal Price *</label><input required type="number" step="0.01" value={form.dealPrice} onChange={e => setForm({ ...form, dealPrice: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="0.00" /></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Electronics" /></div>
          <div><label className="block text-sm font-medium mb-1">Deal Type</label><select value={form.dealType} onChange={e => setForm({ ...form, dealType: e.target.value })} className="w-full px-4 py-2 border rounded-lg"><option value="daily">Daily Deal</option><option value="lightning">Lightning Deal</option></select></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="10" /></div>
          <div><label className="block text-sm font-medium mb-1">End Time</label><input type="datetime-local" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Rating</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="4.5" /></div>
          <div><label className="block text-sm font-medium mb-1">Reviews</label><input type="number" value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="0" /></div>
        </div>
        
        <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="/api/placeholder/400/300" /></div>
        
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter deal description"></textarea></div>
        
        <div><label className="block text-sm font-medium mb-1">Features (comma-separated)</label><input value={form.features || ''} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Feature 1, Feature 2, Feature 3" /></div>
        
        <div className="flex items-center">
          <input type="checkbox" id="freeShipping" checked={form.freeShipping} onChange={e => setForm({ ...form, freeShipping: e.target.checked })} className="mr-2" />
          <label htmlFor="freeShipping" className="text-sm font-medium">Free Shipping</label>
        </div>
        
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/dashboard/deals" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
