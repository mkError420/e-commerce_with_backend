'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api-client'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  isMain?: boolean
  subcategories?: Category[]
}

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', href: '', parentId: '', isMain: false })
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

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
    }).finally(() => setLoading(false)) 
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const categoryData = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
      href: form.href || (form.slug || form.title.toLowerCase().replace(/\s+/g, '-')),
      parentId: form.isMain ? undefined : form.parentId
    }
    
    await api.categories.create(categoryData)
    setForm({ title: '', slug: '', href: '', parentId: '', isMain: false })
    setShowForm(false)
    
    // Refresh categories
    api.categories.list().then((data: Category[]) => {
      const mainCategories = data.filter(cat => !cat.parentId)
      const subcategories = data.filter(cat => cat.parentId)
      
      const structuredCategories = mainCategories.map(main => ({
        ...main,
        subcategories: subcategories.filter(sub => sub.parentId === main.id)
      }))
      
      setCategories(structuredCategories)
    })
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will also delete all subcategories.`)) return
    await api.categories.delete(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategoryRow = (category: Category, level: number = 0) => (
    <React.Fragment key={category.id}>
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {category.subcategories && category.subcategories.length > 0 && (
              <button 
                onClick={() => toggleExpanded(category.id)}
                className="mr-2 p-1 hover:bg-gray-100 rounded"
              >
                {expandedCategories.has(category.id) ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </button>
            )}
            <span className="font-medium">{category.title}</span>
            {level === 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Main</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-gray-600">{category.slug}</td>
        <td className="px-4 py-3 text-gray-600">{category.href}</td>
        <td className="px-4 py-3 text-right">
          <button onClick={() => handleDelete(category.id, category.title)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
        </td>
      </tr>
      {expandedCategories.has(category.id) && category.subcategories?.map(sub => 
        renderCategoryRow(sub, level + 1)
      )}
    </React.Fragment>
  )

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded" />
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="categoryType"
                    checked={form.isMain}
                    onChange={() => setForm({ ...form, isMain: true, parentId: '' })}
                    className="mr-2"
                  />
                  <span>Main Category</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="categoryType"
                    checked={!form.isMain}
                    onChange={() => setForm({ ...form, isMain: false })}
                    className="mr-2"
                  />
                  <span>Subcategory</span>
                </label>
              </div>
            </div>
            {!form.isMain && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  value={form.parentId}
                  onChange={e => setForm({ ...form, parentId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required={!form.isMain}
                >
                  <option value="">Select Parent Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                placeholder="Category title" 
                required 
                value={form.title} 
                onChange={e => setForm({ 
                  ...form, 
                  title: e.target.value, 
                  slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  href: form.href || e.target.value.toLowerCase().replace(/\s+/g, '-')
                })} 
                className="w-full px-4 py-2 border rounded-lg" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input 
                placeholder="url-friendly-name" 
                value={form.slug} 
                onChange={e => setForm({ ...form, slug: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Href</label>
              <input 
                placeholder="category-path" 
                value={form.href} 
                onChange={e => setForm({ ...form, href: e.target.value })} 
                className="w-full px-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Add Category</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Href</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => renderCategoryRow(category))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
