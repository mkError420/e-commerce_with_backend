'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Upload, X, Search, TrendingUp, TrendingDown, Folder, FolderOpen, PieChart, BarChart3, Layers, Tag } from 'lucide-react'
import { api } from '@/lib/api-client'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  isMain?: boolean
  icon?: string
  subcategories?: Category[]
}

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', href: '', parentId: '', isMain: false, icon: '' })
  const [iconPreview, setIconPreview] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate statistics
  const calculateStats = () => {
    const allCategories = categories.flatMap(cat => [cat, ...(cat.subcategories || [])])
    const mainCategories = categories.length
    const subcategories = allCategories.length - mainCategories
    const categoriesWithIcons = allCategories.filter(cat => cat.icon).length
    const categoriesWithSubcategories = categories.filter(cat => cat.subcategories && cat.subcategories.length > 0).length
    
    // Calculate growth (mock data for demonstration)
    const categoriesGrowth = 8.3
    const subcategoriesGrowth = 12.7
    
    return {
      totalCategories: allCategories.length,
      mainCategories,
      subcategories,
      categoriesWithIcons,
      categoriesWithSubcategories,
      categoriesGrowth,
      subcategoriesGrowth
    }
  }

  const stats = calculateStats()

  // Category distribution for charts
  const categoryDistribution = [
    { name: 'Main Categories', value: stats.mainCategories, color: '#3b82f6' },
    { name: 'Subcategories', value: stats.subcategories, color: '#10b981' },
    { name: 'With Icons', value: stats.categoriesWithIcons, color: '#f59e0b' },
    { name: 'With Subcategories', value: stats.categoriesWithSubcategories, color: '#8b5cf6' }
  ]

  // Recent categories (most recently added main categories)
  const recentCategories = categories.slice(0, 5)

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
      parentId: form.isMain ? undefined : form.parentId,
      icon: form.icon
    }
    
    if (editingCategory) {
      // Update existing category
      await api.categories.update(editingCategory.id, categoryData)
    } else {
      // Create new category
      await api.categories.create(categoryData)
    }
    
    resetForm()
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

  const resetForm = () => {
    setForm({ title: '', slug: '', href: '', parentId: '', isMain: false, icon: '' })
    setIconPreview('')
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setForm({
      title: category.title,
      slug: category.slug,
      href: category.href,
      parentId: category.parentId || '',
      isMain: !category.parentId,
      icon: category.icon || ''
    })
    setIconPreview(category.icon || '')
    setShowForm(true)
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

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(file)
      setIconPreview(imageUrl)
      
      // In a real application, you would upload this to a service like Cloudinary, AWS S3, or your own server
      // For now, we'll store the file data as base64 or use a placeholder
      const reader = new FileReader()
      reader.onloadend = () => {
        // Store the base64 data or file reference
        setForm({ ...form, icon: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeIcon = () => {
    setForm({ ...form, icon: '' })
    setIconPreview('')
  }

  // Filter categories based on search term
  const filterCategories = (categories: Category[], term: string): Category[] => {
    if (!term.trim()) return categories
    
    return categories.filter(category => {
      const matchesMain = category.title.toLowerCase().includes(term.toLowerCase()) ||
                          category.slug.toLowerCase().includes(term.toLowerCase()) ||
                          category.href.toLowerCase().includes(term.toLowerCase())
      
      const filteredSubcategories = category.subcategories 
        ? filterCategories(category.subcategories, term)
        : []
      
      return matchesMain || filteredSubcategories.length > 0
    }).map(category => ({
      ...category,
      subcategories: category.subcategories 
        ? filterCategories(category.subcategories, term)
        : []
    }))
  }

  const filteredCategories = filterCategories(categories, searchTerm)

  const renderCategoryRow = (category: Category, level: number = 0) => (
    <React.Fragment key={category.id}>
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {category.icon && (
              <img 
                src={category.icon} 
                alt={category.title}
                className="w-6 h-6 mr-2 rounded object-cover"
              />
            )}
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
          <div className="flex items-center gap-2 justify-end">
            <button 
              onClick={() => handleEdit(category)} 
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 text-sm font-medium"
              title="Edit Category"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button 
              onClick={() => handleDelete(category.id, category.title)} 
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 text-sm font-medium"
              title="Delete Category"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
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
      {/* Dashboard Diagram Section */}
      <div className="mb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Categories Dashboard</h2>
            <p className="text-gray-600 mt-1">Monitor your category structure and organization</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.categoriesGrowth}%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Main Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.mainCategories}</p>
                <div className="flex items-center mt-2">
                  <Folder className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-600">Parent categories</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Folder className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subcategories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.subcategories}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.subcategoriesGrowth}%</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FolderOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Icons</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.categoriesWithIcons}</p>
                <div className="flex items-center mt-2">
                  <Tag className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm text-yellow-600">Visual categories</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Tag className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {categoryDistribution.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalCategories > 0 ? (category.value / stats.totalCategories) * 100 : 0}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{category.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Structure Overview</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Main Categories</p>
                    <p className="text-xl font-bold text-blue-700">{stats.mainCategories}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded">
                    <Folder className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Subcategories</p>
                    <p className="text-xl font-bold text-green-700">{stats.subcategories}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded">
                    <FolderOpen className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">With Icons</p>
                    <p className="text-xl font-bold text-yellow-700">{stats.categoriesWithIcons}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded">
                    <Tag className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">With Subcategories</p>
                    <p className="text-xl font-bold text-purple-700">{stats.categoriesWithSubcategories}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded">
                    <Layers className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Categories</h3>
            <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
              View all categories →
            </span>
          </div>
          <div className="space-y-3">
            {recentCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg">
                    {category.icon ? (
                      <img src={category.icon} alt={category.title} className="w-4 h-4 rounded" />
                    ) : (
                      <Folder className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{category.title}</p>
                    <p className="text-sm text-gray-600">{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {category.subcategories && category.subcategories.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {category.subcategories.length} subcategories
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {category.icon ? 'Has icon' : 'No icon'}
                  </span>
                </div>
              </div>
            ))}
            {recentCategories.length === 0 && (
              <p className="text-center text-gray-500 py-8">No categories found</p>
            )}
          </div>
        </div>
      </div>

      {/* Original Categories Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Categories</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" /> {editingCategory ? 'Edit Category' : 'Add Category'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by title, slug, or href..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
        </div>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
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
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Icon</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors relative">
              {iconPreview || form.icon ? (
                <div className="relative">
                  <img 
                    src={iconPreview || form.icon} 
                    alt="Icon preview" 
                    className="w-16 h-16 mx-auto rounded-lg object-cover mb-2"
                  />
                  <button
                    type="button"
                    onClick={removeIcon}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload icon</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
            <button type="button" onClick={() => { resetForm(); setShowForm(false) }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
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
            {filteredCategories.map(category => renderCategoryRow(category))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            {searchTerm 
              ? 'No categories found matching your search.' 
              : 'No categories yet. Add your first category!'
            }
          </p>
        )}
      </div>
    </div>
  )
}
