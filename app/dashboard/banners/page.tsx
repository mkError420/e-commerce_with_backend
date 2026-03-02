'use client'

import React, { useState, useEffect } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { api } from '@/lib/api-client'
import { Package, Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  category: string
  backgroundColor: string
  gradient: string
  isActive: boolean
  position: number
}

export default function BannersPage() {
  const { categories, loading: categoriesLoading } = useCategories()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '', // Empty so users can set their own
    category: '',
    backgroundColor: 'from-shop_dark_green',
    gradient: 'to-shop_light_green',
    isActive: true,
    position: 0
  })

  // Color options for banners
  const colorOptions = [
    { value: 'from-shop_dark_green', label: 'Shop Green' },
    { value: 'from-blue-600', label: 'Blue' },
    { value: 'from-purple-600', label: 'Purple' },
    { value: 'from-orange-600', label: 'Orange' },
    { value: 'from-red-600', label: 'Red' },
    { value: 'from-indigo-600', label: 'Indigo' }
  ]

  const gradientOptions = [
    { value: 'to-shop_light_green', label: 'Shop Light Green' },
    { value: 'to-blue-500', label: 'Blue' },
    { value: 'to-pink-500', label: 'Pink' },
    { value: 'to-orange-500', label: 'Orange' },
    { value: 'to-red-500', label: 'Red' },
    { value: 'to-indigo-500', label: 'Indigo' }
  ]

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const data = await api.banners.list()
      setBanners(data)
    } catch (error) {
      console.error('Error fetching banners:', error)
      // For now, create default banners from categories
      const defaultBanners = categories.slice(0, 4).map((category, index) => ({
        id: category.id,
        title: `${category.title} Collection`,
        subtitle: `Explore our ${category.title.toLowerCase()} products`,
        description: `Discover amazing deals on ${category.title.toLowerCase()} products`,
        image: '/api/placeholder/1920/600', // Use placeholder API
        category: category.slug,
        backgroundColor: index === 0 ? 'from-shop_dark_green' : index === 1 ? 'from-blue-600' : index === 2 ? 'from-purple-600' : 'from-orange-600',
        gradient: index === 0 ? 'to-shop_light_green' : index === 1 ? 'to-blue-500' : index === 2 ? 'to-pink-500' : 'to-orange-500',
        isActive: true,
        position: index
      }))
      setBanners(defaultBanners)
    } finally {
      setLoading(false)
    }
  }

  // Add this after the existing handleSubmit function
const testApi = async () => {
  console.log('Testing API...')
  try {
    const response = await fetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data', timestamp: Date.now() })
    })
    console.log('Test API response status:', response.status)
    console.log('Test API response headers:', response.headers)
    
    const text = await response.text()
    console.log('Test API response text:', text)
    
    try {
      const json = JSON.parse(text)
      console.log('Test API response JSON:', json)
    } catch (parseError) {
      console.error('Test API JSON parse error:', parseError)
    }
  } catch (error) {
    console.error('Test API error:', error)
  }
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Banner form submission - formData:', formData)
    
    try {
      if (editingBanner) {
        // Update existing banner
        console.log('Updating banner:', editingBanner.id)
        await api.banners.update(editingBanner.id, formData)
        setBanners(prev => prev.map(banner => 
          banner.id === editingBanner.id 
            ? { ...formData, id: editingBanner.id }
            : banner
        ))
        console.log('Banner updated successfully')
      } else {
        // Add new banner
        console.log('Creating new banner')
        const newBanner = await api.banners.create(formData)
        console.log('Banner created successfully:', newBanner)
        setBanners(prev => [...prev, newBanner])
      }
      
      // Show success message
      alert('Banner saved successfully! Changes will appear on the shop page.')
      
      // Reset form
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '', // Empty so users can set their own
        category: '',
        backgroundColor: 'from-shop_dark_green',
        gradient: 'to-shop_light_green',
        isActive: true,
        position: 0
      })
      setShowForm(false)
      setEditingBanner(null)
    } catch (error) {
      console.error('Error saving banner:', error)
      alert(`Failed to save banner: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      image: banner.image,
      category: banner.category,
      backgroundColor: banner.backgroundColor,
      gradient: banner.gradient,
      isActive: banner.isActive,
      position: banner.position
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.banners.delete(id)
        setBanners(prev => prev.filter(banner => banner.id !== id))
      } catch (error) {
        console.error('Error deleting banner:', error)
        alert('Failed to delete banner. Please try again.')
      }
    }
  }

  const handleToggleActive = (id: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id 
        ? { ...banner, isActive: !banner.isActive }
        : banner
    ))
  }

  const moveBanner = (id: string, direction: 'up' | 'down') => {
    const index = banners.findIndex(b => b.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === banners.length - 1)
    ) {
      return
    }

    const newBanners = [...banners]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap positions
    ;[newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]]
    
    // Update positions
    newBanners.forEach((banner, idx) => {
      banner.position = idx
    })
    
    setBanners(newBanners)
  }

  const handlePreview = () => {
    // Open shop page in new tab to preview banners
    window.open('/shop', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600">Manage shop page banner carousel</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={testApi}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Test API
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/image.jpg or /images/banner.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter any image URL (jpg, png, webp, etc.). Can be external URL or local path.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <select
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gradient Color</label>
                  <select
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {gradientOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBanner(null)
                    setFormData({
                      title: '',
                      subtitle: '',
                      description: '',
                      image: '', // Empty so users can set their own
                      category: '',
                      backgroundColor: 'from-shop_dark_green',
                      gradient: 'to-shop_light_green',
                      isActive: true,
                      position: 0
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{banner.subtitle}</p>
                <p className="text-gray-500 text-sm mb-3">{banner.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Category: {banner.category}</span>
                  <span className="text-gray-500">Position: {banner.position + 1}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Colors:</span>
                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${banner.backgroundColor} ${banner.gradient}`}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => moveBanner(banner.id, 'up')}
                  disabled={banner.position === 0}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveBanner(banner.id, 'down')}
                  disabled={banner.position === banners.length - 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(banner.id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Banners</h3>
            <p className="text-gray-600 mb-4">Create your first banner to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Banner
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
