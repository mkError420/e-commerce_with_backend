'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Filter, Search } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useCategories } from '@/hooks/useCategories'

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { 
    api.products.list().then(setProducts).finally(() => setLoading(false)) 
  }, [])

  useEffect(() => {
    api.categories.list().then((data: any[]) => {
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

  const getCategoryName = (categoryTitle: string) => {
    // Find the category and return its display name
    const allCategories = [...categories, ...categories.flatMap(cat => cat.subcategories || [])]
    const category = allCategories.find(cat => cat.title === categoryTitle)
    return category ? category.title : categoryTitle
  }

  const getCategoryHierarchy = (categoryTitle: string) => {
    // Find the category and return its hierarchy
    const allCategories = [...categories, ...categories.flatMap(cat => cat.subcategories || [])]
    const category = allCategories.find(cat => cat.title === categoryTitle)
    
    if (!category) return categoryTitle
    
    // If it's a subcategory, find its parent
    if (category.parentId) {
      const parent = categories.find(cat => cat.id === category.parentId)
      if (parent) {
        return `${parent.title} → ${category.title}`
      }
    }
    
    return category.title
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await api.products.delete(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Get all categories for filter dropdown
  const allCategories = [
    { id: 'all', title: 'All Categories' },
    ...categories,
    ...categories.flatMap(cat => cat.subcategories || [])
  ]

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
        <Link href="/dashboard/products/new" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
            >
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Price</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-gray-900">{getCategoryName(p.category)}</span>
                    {p.category !== getCategoryName(p.category) && (
                      <span className="text-xs text-gray-500">{getCategoryHierarchy(p.category)}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">৳{p.price}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/products/${p.id}`} className="inline p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(p.id, p.name)} 
                    className="inline p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No products found matching your criteria.' 
              : 'No products yet. Add your first product!'
            }
          </p>
        )}
      </div>
    </div>
  )
}
