'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function NewDealPage() {
  const router = useRouter()
  const [form, setForm] = useState({ 
    title: '', 
    originalPrice: '', 
    dealPrice: '', 
    image: '', 
    images: ['', '', '', ''], // Array for 4 additional images
    category: 'Electronics', 
    dealType: 'daily', 
    endTime: '', 
    stock: '10', 
    description: '',
    features: '',
    freeShipping: true,
    rating: '4.5',
    reviews: '0'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Basic validation
    if (!form.title.trim()) {
      setError('Title is required')
      setLoading(false)
      return
    }
    
    if (!form.originalPrice || parseFloat(form.originalPrice) <= 0) {
      setError('Original price must be greater than 0')
      setLoading(false)
      return
    }
    
    if (!form.dealPrice || parseFloat(form.dealPrice) <= 0) {
      setError('Deal price must be greater than 0')
      setLoading(false)
      return
    }
    
    if (parseFloat(form.dealPrice) >= parseFloat(form.originalPrice)) {
      setError('Deal price must be less than original price')
      setLoading(false)
      return
    }
    
    try {
      const dealData = {
        ...form,
        originalPrice: parseFloat(form.originalPrice),
        dealPrice: parseFloat(form.dealPrice),
        stock: parseInt(form.stock),
        rating: parseFloat(form.rating),
        reviews: parseInt(form.reviews),
        images: form.images.filter(img => img.trim() !== ''), // Filter out empty images
        features: form.features ? form.features.split(',').map(f => f.trim()).filter(f => f) : [],
        endTime: form.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        freeShipping: form.freeShipping !== false
      }
      
      console.log('Creating new deal with data:', dealData)
      
      const response = await api.deals.create(dealData)
      console.log('Create response:', response)
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server')
      }
      
      router.push('/dashboard/deals')
    } catch (error: any) {
      console.error('Error creating deal:', error)
      setError(error.message || 'Failed to create deal. Please try again.')
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div>
      <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Deal</h2>
      
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
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Additional Images (Gallery - Max 4)</label>
          <div className="grid grid-cols-2 gap-4">
            {form.images.map((img, index) => (
              <div key={index}>
                <label className="block text-xs text-gray-600 mb-1">Image {index + 1}</label>
                <input
                  value={img}
                  onChange={e => {
                    const newImages = [...form.images]
                    newImages[index] = e.target.value
                    setForm({ ...form, images: newImages })
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder={`Additional image ${index + 1} URL`}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter deal description"></textarea></div>
        
        <div><label className="block text-sm font-medium mb-1">Features (comma-separated)</label><input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Feature 1, Feature 2, Feature 3" /></div>
        
        <div className="flex items-center">
          <input type="checkbox" id="freeShipping" checked={form.freeShipping} onChange={e => setForm({ ...form, freeShipping: e.target.checked })} className="mr-2" />
          <label htmlFor="freeShipping" className="text-sm font-medium">Free Shipping</label>
        </div>
        
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Deal'}
          </button>
          <Link href="/dashboard/deals" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
