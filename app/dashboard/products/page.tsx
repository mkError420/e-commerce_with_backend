'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Filter, Search, Download, ChevronDown } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useCategories } from '@/hooks/useCategories'

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)

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

  const exportToCSV = () => {
    const productsToExport = searchTerm || selectedCategory !== 'all' ? filteredProducts : products
    const headers = [
      'Product Name', 'Category', 'Price', 'Stock', 'Description', 'Created Date', 'Updated Date'
    ]
    
    const csvContent = [
      headers.join(','),
      ...productsToExport.map(product => [
        `"${product.name || ''}"`,
        `"${product.category || ''}"`,
        `"${product.price || 0}"`,
        `"${product.stock || 0}"`,
        `"${(product.description || '').replace(/"/g, '""')}"`,
        `"${new Date(product.createdAt).toLocaleDateString()}"`,
        `"${new Date(product.updatedAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportDropdown(false)
  }

  const exportToPDF = () => {
    const productsToExport = searchTerm || selectedCategory !== 'all' ? filteredProducts : products
    const pdfContent = `
      <html>
        <head>
          <title>Products Export - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 10px; }
            .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .products-table th { background: #059669; color: white; padding: 12px; text-align: left; }
            .products-table td { border: 1px solid #ddd; padding: 12px; }
            .products-table tr:nth-child(even) { background: #f9f9f9; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
            .summary { margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; }
            .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">mk-ShopBD</div>
            <h1>PRODUCTS EXPORT REPORT</h1>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Products: ${productsToExport.length}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Products: ${productsToExport.length}</p>
            <p>Total Categories: ${new Set(productsToExport.map(p => p.category)).size}</p>
            <p>Average Price: ৳${productsToExport.length > 0 ? (productsToExport.reduce((sum, p) => sum + (p.price || 0), 0) / productsToExport.length).toFixed(2) : '0'}</p>
            <p>Low Price: ৳${productsToExport.length > 0 ? Math.min(...productsToExport.map(p => p.price || 0)).toFixed(2) : '0'}</p>
            <p>High Price: ৳${productsToExport.length > 0 ? Math.max(...productsToExport.map(p => p.price || 0)).toFixed(2) : '0'}</p>
          </div>
          
          <table class="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${productsToExport.map((product, index) => `
                <tr>
                  <td>
                    <img src="${product.image || '/api/placeholder/60/60'}" alt="${product.name}" class="product-image" />
                  </td>
                  <td>
                    <strong>${product.name}</strong>
                  </td>
                  <td>${product.category || 'Uncategorized'}</td>
                  <td>৳${(product.price || 0).toLocaleString()}</td>
                  <td>${product.stock || 0}</td>
                  <td>${(product.description || '').substring(0, 100)}${product.description && product.description.length > 100 ? '...' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is a computer-generated report.</p>
            <p>© ${new Date().getFullYear()} mk-ShopBD. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(pdfContent)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
    setShowExportDropdown(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportDropdown && !(event.target as Element).closest('.export-dropdown')) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportDropdown])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Check if selected category matches either the main category or subcategory
    const matchesCategory = selectedCategory === 'all' || 
                         product.category === selectedCategory ||
                         getCategoryHierarchy(product.category).includes(selectedCategory)
    
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
        <div className="flex items-center gap-4">
          <div className="relative export-dropdown">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={exportToCSV}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Download className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>
            )}
          </div>
          <Link href="/dashboard/products/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">Filters</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
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
        )}
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
                  <div className="flex items-center gap-2 justify-end">
                    <Link 
                      href={`/dashboard/products/${encodeURIComponent(p.id)}`} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 text-sm font-medium"
                      title="Edit Product"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 text-sm font-medium"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
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
