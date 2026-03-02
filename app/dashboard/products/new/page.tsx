'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api-client'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  subcategories?: Category[]
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    originalPrice: '', 
    image: '', 
    mainCategory: '',
    category: '', 
    subcategory: '',
    description: '', 
    badge: '', 
    rating: '4.5', 
    reviews: '0' 
  })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    api.categories.list().then((data: Category[]) => {
      // Build hierarchical structure
      const mainCategories = data.filter(cat => !cat.parentId)
      const subcategories = data.filter(cat => cat.parentId)
      
      const structuredCategories = mainCategories.map(main => ({
        ...main,
        subcategories: subcategories.filter(sub => sub.parentId === main.id)
      }))
      
      setCategories(structuredCategories)
    })
  }, [])

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategoryOptions = (categories: Category[], level: number = 0): any[] => {
    const options: any[] = []
    
    categories.forEach(category => {
      options.push(
        <option key={category.id} value={category.title}>
          {'  '.repeat(level) + (level > 0 ? '└─ ' : '') + category.title}
        </option>
      )
      
      if (expandedCategories.has(category.id) && category.subcategories) {
        options.push(...renderCategoryOptions(category.subcategories, level + 1))
      }
    })
    
    return options
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Determine the final category value
      const finalCategory = form.subcategory || form.mainCategory
      
      await api.products.create({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        category: finalCategory
      })
      router.push('/dashboard/products')
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div>
      <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input 
            required 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input 
              required 
              type="number" 
              step="0.01" 
              value={form.price} 
              onChange={e => setForm({ ...form, price: e.target.value })} 
              className="w-full px-4 py-2 border rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
            <input 
              type="number" 
              step="0.01" 
              value={form.originalPrice} 
              onChange={e => setForm({ ...form, originalPrice: e.target.value })} 
              className="w-full px-4 py-2 border rounded-lg" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <div className="space-y-3">
            {/* Main Category Selection */}
            <div>
              <select 
                value={form.mainCategory || ''} 
                onChange={(e) => {
                  const selectedMainCategory = e.target.value
                  setForm({ 
                    ...form, 
                    mainCategory: selectedMainCategory,
                    category: '', // Reset subcategory when main category changes
                    subcategory: '' // Reset subcategory field
                  })
                  // Auto-expand the selected category
                  if (selectedMainCategory) {
                    const category = categories.find(cat => cat.title === selectedMainCategory)
                    if (category && category.subcategories && category.subcategories.length > 0) {
                      setExpandedCategories(new Set([category.id]))
                    }
                  }
                }} 
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select a main category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.title}>
                    {category.title}
                    {category.subcategories && category.subcategories.length > 0 && ` (${category.subcategories.length} subcategories)`}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection - Only show if main category has subcategories */}
            {form.mainCategory && (() => {
              const selectedMainCat = categories.find(cat => cat.title === form.mainCategory)
              return selectedMainCat?.subcategories && selectedMainCat.subcategories.length > 0
            })() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                <select 
                  value={form.subcategory || ''} 
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value, category: e.target.value })} 
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {(() => {
                    const selectedMainCat = categories.find(cat => cat.title === form.mainCategory)
                    return selectedMainCat?.subcategories?.map(sub => (
                      <option key={sub.id} value={sub.title}>
                        {sub.title}
                      </option>
                    )) || []
                  })()}
                </select>
              </div>
            )}

            {/* Visual Category Overview */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center gap-2">
                  {category.subcategories && category.subcategories.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => {
                        const newExpanded = new Set(expandedCategories)
                        if (newExpanded.has(category.id)) {
                          newExpanded.delete(category.id)
                        } else {
                          newExpanded.add(category.id)
                        }
                        setExpandedCategories(newExpanded)
                        // Auto-select this category if it's not selected
                        if (!form.mainCategory) {
                          setForm({ ...form, mainCategory: category.title, category: '', subcategory: '' })
                        }
                      }}
                      className={`p-1 rounded text-xs transition-colors ${
                        expandedCategories.has(category.id) 
                          ? 'bg-shop_dark_green text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {expandedCategories.has(category.id) ? 
                        <ChevronDown className="w-3 h-3" /> : 
                        <ChevronRight className="w-3 h-3" />
                      }
                    </button>
                  )}
                  <span className={`text-xs px-2 py-1 rounded transition-colors ${
                    form.mainCategory === category.title
                      ? 'bg-shop_dark_green text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {category.title}
                  </span>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <span className="text-xs text-gray-500">
                      ({category.subcategories.length} subcats)
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Show Selected Category Info */}
            {(form.mainCategory || form.subcategory) && (
              <div className="bg-shop_light_green/10 border border-shop_light_green/30 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Selected:</span> {' '}
                  {form.mainCategory && (
                    <span className="text-shop_dark_green font-semibold">{form.mainCategory}</span>
                  )}
                  {form.subcategory && (
                    <>
                      <span className="mx-2">→</span>
                      <span className="text-shop_dark_green font-semibold">{form.subcategory}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input 
            value={form.image} 
            onChange={e => setForm({ ...form, image: e.target.value })} 
            className="w-full px-4 py-2 border rounded-lg" 
            placeholder="/images/products/product_1.png" 
          />
          {form.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                <img 
                  src={form.image} 
                  alt="Product preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><div class="text-gray-400 text-center"><div class="w-8 h-8 bg-gray-300 rounded mx-auto mb-1"></div><p class="text-xs">Invalid URL</p></div></div>';
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
            rows={3} 
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>
        <div className="flex gap-3">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Save Product
          </button>
          <Link 
            href="/dashboard/products" 
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
