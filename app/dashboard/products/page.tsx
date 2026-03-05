'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Filter, Search, Download, ChevronDown, Package, AlertCircle, TrendingUp, TrendingDown, PieChart, BarChart3, DollarSign, ShoppingCart, Archive, Tag } from 'lucide-react'
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
  const [stockUpdates, setStockUpdates] = useState<{[key: string]: string}>({})
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)

  // Calculate statistics
  const calculateStats = () => {
    const totalProducts = products.length
    const totalValue = products.reduce((sum, product) => sum + (product.price || 0) * (product.stock || 0), 0)
    const avgPrice = totalProducts > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / totalProducts : 0
    const outOfStock = products.filter(product => (product.stock || 0) === 0).length
    const lowStock = products.filter(product => (product.stock || 0) > 0 && (product.stock || 0) <= 10).length
    const inStock = products.filter(product => (product.stock || 0) > 10).length
    const totalCategories = new Set(products.map(p => p.category)).size
    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0)
    
    // Calculate growth (mock data for demonstration)
    const productsGrowth = 15.2
    const valueGrowth = 8.7
    
    return {
      totalProducts,
      totalValue,
      avgPrice,
      outOfStock,
      lowStock,
      inStock,
      totalCategories,
      totalStock,
      productsGrowth,
      valueGrowth
    }
  }

  const stats = calculateStats()

  // Stock status distribution for charts
  const stockDistribution = [
    { name: 'In Stock', value: stats.inStock, color: '#10b981' },
    { name: 'Low Stock', value: stats.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStock, color: '#ef4444' }
  ]

  // Category distribution
  const categoryDistribution = products.reduce((acc: any[], product) => {
    const category = product.category || 'Uncategorized'
    const existing = acc.find(item => item.name === category)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: category, value: 1, color: '#3b82f6' })
    }
    return acc
  }, []).slice(0, 5) // Top 5 categories

  // Recent products (most recently added)
  const recentProducts = products.slice(0, 5)

  useEffect(() => { 
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const productsData = await api.products.list()
      console.log('Products loaded:', productsData.length, 'items')
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'red', icon: AlertCircle, label: 'Out of Stock' }
    if (stock <= 10) return { status: 'low', color: 'orange', icon: TrendingDown, label: 'Low Stock' }
    if (stock <= 50) return { status: 'medium', color: 'yellow', icon: Package, label: 'Medium Stock' }
    return { status: 'high', color: 'green', icon: TrendingUp, label: 'In Stock' }
  }

  const handleStockUpdate = async (productId: string, newStock: number) => {
    if (newStock < 0) return
    
    setUpdatingStock(productId)
    try {
      const product = products.find(p => p.id === productId)
      if (!product) return
      
      console.log(`Updating stock for product ${productId} from ${product.stock} to ${newStock}`)
      
      // Update via API
      const updatedProduct = await api.products.update(productId, { ...product, stock: newStock })
      
      console.log('Stock update successful:', updatedProduct)
      
      // Update local state with response data
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      ))
      
      // Clear stock update input
      setStockUpdates(prev => ({ ...prev, [productId]: '' }))
      
      // Show success feedback
      console.log(`Stock updated successfully for ${product.name}`)
      
    } catch (error) {
      console.error('Error updating stock:', error)
      alert(`Failed to update stock: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      // Refresh products to ensure data consistency
      try {
        const freshProducts = await api.products.list()
        setProducts(freshProducts)
      } catch (refreshError) {
        console.error('Error refreshing products:', refreshError)
      }
    } finally {
      setUpdatingStock(null)
    }
  }

  const handleQuickStockAdjust = (productId: string, adjustment: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    
    const newStock = Math.max(0, (product.stock || 0) + adjustment)
    handleStockUpdate(productId, newStock)
  }

  const handleStockInputChange = (productId: string, value: string) => {
    setStockUpdates(prev => ({ ...prev, [productId]: value }))
  }

  const handleStockInputSubmit = (productId: string, value: string) => {
    const newStock = parseInt(value)
    if (!isNaN(newStock) && newStock >= 0) {
      handleStockUpdate(productId, newStock)
    }
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
      {/* Dashboard Diagram Section */}
      <div className="mb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products Dashboard</h2>
            <p className="text-gray-600 mt-1">Monitor your inventory and product performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.productsGrowth}%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{stats.totalValue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.valueGrowth}%</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{Math.round(stats.avgPrice).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <Tag className="w-4 h-4 text-gray-600 mr-1" />
                  <span className="text-sm text-gray-600">Per product</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.lowStock + stats.outOfStock}</p>
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm text-yellow-600">Need attention</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Stock Status</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stockDistribution.map((stock) => (
                <div key={stock.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stock.color }}></div>
                    <span className="text-sm text-gray-600">{stock.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalProducts > 0 ? (stock.value / stats.totalProducts) * 100 : 0}%`,
                          backgroundColor: stock.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{stock.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Inventory Overview</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">In Stock</p>
                    <p className="text-xl font-bold text-green-700">{stats.inStock}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Low Stock</p>
                    <p className="text-xl font-bold text-yellow-700">{stats.lowStock}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded">
                    <TrendingDown className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Out of Stock</p>
                    <p className="text-xl font-bold text-red-700">{stats.outOfStock}</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total Stock</p>
                    <p className="text-xl font-bold text-blue-700">{stats.totalStock}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded">
                    <Archive className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
            <Link href="/dashboard/products" className="text-sm text-blue-600 hover:text-blue-700">
              View all products →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-6 h-6 rounded object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category || 'Uncategorized'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800">৳{product.price}</span>
                  <span className="text-sm text-gray-500">
                    {product.stock || 0} units
                  </span>
                  {(() => {
                    const stockStatus = getStockStatus(product.stock || 0)
                    return (
                      <span className={`text-xs px-2 py-1 rounded-full bg-${stockStatus.color}-100 text-${stockStatus.color}-700`}>
                        {stockStatus.label}
                      </span>
                    )
                  })()}
                </div>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-center text-gray-500 py-8">No products found</p>
            )}
          </div>
        </div>
      </div>

      {/* Original Products Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
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
              <th className="text-left px-4 py-3 font-medium text-gray-700">Stock</th>
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
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-2">
                    {/* Stock Status Badge */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const stockStatus = getStockStatus(p.stock || 0)
                        const Icon = stockStatus.icon
                        return (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${stockStatus.color}-100 text-${stockStatus.color}-700`}>
                            <Icon className="w-3 h-3" />
                            {stockStatus.label}
                          </div>
                        )
                      })()}
                    </div>
                    
                    {/* Stock Quantity Display */}
                    <div className="text-sm font-medium text-gray-900">
                      {p.stock || 0} units
                    </div>
                    
                    {/* Stock Management Controls */}
                    <div className="flex items-center gap-1">
                      {/* Quick Decrease Button */}
                      <button
                        onClick={() => handleQuickStockAdjust(p.id, -1)}
                        disabled={updatingStock === p.id}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Decrease stock by 1"
                      >
                        <TrendingDown className="w-3 h-3" />
                      </button>
                      
                      {/* Stock Input */}
                      <input
                        type="number"
                        value={stockUpdates[p.id] || ''}
                        onChange={(e) => handleStockInputChange(p.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleStockInputSubmit(p.id, stockUpdates[p.id] || '')
                          }
                        }}
                        placeholder={(p.stock || 0).toString()}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={updatingStock === p.id}
                      />
                      
                      {/* Quick Increase Button */}
                      <button
                        onClick={() => handleQuickStockAdjust(p.id, 1)}
                        disabled={updatingStock === p.id}
                        className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                        title="Increase stock by 1"
                      >
                        <TrendingUp className="w-3 h-3" />
                      </button>
                      
                      {/* Update Button */}
                      {(stockUpdates[p.id] && stockUpdates[p.id] !== (p.stock || 0).toString()) && (
                        <button
                          onClick={() => handleStockInputSubmit(p.id, stockUpdates[p.id] || '')}
                          disabled={updatingStock === p.id}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updatingStock === p.id ? '...' : 'Update'}
                        </button>
                      )}
                    </div>
                  </div>
                </td>
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
