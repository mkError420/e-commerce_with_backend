'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, X, Upload, Image as ImageIcon } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => { 
    console.log('Loading blog post with ID:', id)
    api.blog.get(id).then(post => {
      console.log('Blog post loaded:', post)
      console.log('Featured status from API:', post.featured)
      console.log('Featured type from API:', typeof post.featured)
      setForm(post)
    }).catch(error => {
      console.error('Error loading blog post:', error)
      router.push('/dashboard/blog')
    }).finally(() => {
      console.log('Loading completed')
      setLoading(false)
    })
  }, [id, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      
      // Read the file as base64
      const reader = new FileReader()
      reader.onloadend = () => {
        // Store the base64 data
        setForm({ ...form, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setForm({ ...form, image: '' })
    setImagePreview('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    
    // Basic validation
    if (!form.title?.trim()) {
      setError('Title is required')
      return
    }
    if (!form.excerpt?.trim()) {
      setError('Excerpt is required')
      return
    }
    if (!form.content?.trim()) {
      setError('Content is required')
      return
    }
    
    setSaving(true)
    try {
      // Create update data with all important fields
      const updateData: any = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category || 'General',
        authorName: form.authorName !== undefined ? form.authorName : '', // Don't override with fallback
        authorBio: form.authorBio !== undefined ? form.authorBio : '',
        publishedAt: form.publishedAt || new Date().toISOString().split('T')[0],
        readTime: form.readTime || '5 min read',
        featured: form.featured || false,
        tags: Array.isArray(form.tags) ? form.tags : (form.tags || '').toString().split(',').map((t: string) => t.trim()).filter((t: string) => t),
        image: form.image || '',
        updatedAt: new Date().toISOString() // Add current timestamp for edit time
      }
      
      // Only include likes and comments if they exist (preserve existing values)
      if (form.likes !== undefined) updateData.likes = form.likes
      if (form.comments !== undefined) updateData.comments = form.comments
      
      console.log('Updating blog post with data:', updateData)
      console.log('Featured field in updateData:', updateData.featured)
      console.log('Featured field type:', typeof updateData.featured)
      
      const updatedPost = await api.blog.update(id, updateData)
      console.log('Blog post updated successfully:', updatedPost)
      console.log('Featured field in response:', updatedPost.featured)
      
      setSuccess(true)
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        router.push('/dashboard/blog')
      }, 2000)
      
    } catch (error) {
      console.error('Error updating blog post:', error)
      setError(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally { 
      setSaving(false) 
    }
  }

  if (loading || !form) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  
  return (
    <div>
      <Link href="/dashboard/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Blog Post</h2>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                Changes saved successfully! Redirecting...
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                required 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Enter blog post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt *</label>
              <textarea 
                required 
                value={form.excerpt} 
                onChange={e => setForm({ ...form, excerpt: e.target.value })} 
                rows={3} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Brief description of the blog post"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <textarea 
                required 
                value={form.content} 
                onChange={e => setForm({ ...form, content: e.target.value })} 
                rows={12} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Write your blog post content here..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input 
                value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')} 
                onChange={e => setForm({ ...form, tags: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="e-commerce, tips, success" 
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors relative">
                {imagePreview || form.image ? (
                  <div className="relative">
                    <img 
                      src={imagePreview || form.image} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                value={form.category || 'General'} 
                onChange={e => setForm({ ...form, category: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="General">General</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
                <option value="Tips">Tips</option>
                <option value="News">News</option>
              </select>
            </div>
            
            {/* Author Info */}
            <div>
              <label className="block text-sm font-medium mb-1">Author Name</label>
              <input 
                value={form.authorName || ''} 
                onChange={e => setForm({ ...form, authorName: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Author Bio</label>
              <textarea 
                value={form.authorBio || ''} 
                onChange={e => setForm({ ...form, authorBio: e.target.value })} 
                rows={3} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Brief author bio"
              />
            </div>
            
            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium mb-1">Read Time</label>
              <input 
                value={form.readTime || '5 min read'} 
                onChange={e => setForm({ ...form, readTime: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="5 min read"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured === true}
                onChange={(e) => {
                  console.log('Featured checkbox changed:', e.target.checked)
                  setForm({ ...form, featured: e.target.checked })
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                Featured Post
              </label>
            </div>
            
            {/* Published Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Published Date</label>
              <input 
                type="date"
                value={form.publishedAt || ''} 
                onChange={e => setForm({ ...form, publishedAt: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t">
          <button 
            type="submit" 
            disabled={saving} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/dashboard/blog" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
