'use client'

import React, { useState, useEffect } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { ChevronDown, ChevronRight, Search, Package, Grid3x3, List, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  icon?: string
  subcategories?: Category[]
  count?: number
}

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch products to calculate counts
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => d?.data?.length && setProducts(d.data)).catch(() => {})
  }, [])

  // Calculate product counts for categories
  const categoriesWithCounts = categories.map(cat => {
    // Count products for main category
    const mainCategoryProducts = products.filter(product => 
      product.category?.toLowerCase() === cat.title.toLowerCase()
    ).length
    
    // Count products for subcategories
    const subcategoriesWithCounts = cat.subcategories?.map(sub => {
      const subCategoryProducts = products.filter(product => 
        product.category?.toLowerCase() === sub.title.toLowerCase()
      ).length
      return {
        ...sub,
        count: subCategoryProducts
      }
    }) || []
    
    // Total count includes main category products + all subcategory products
    const totalCount = mainCategoryProducts + subcategoriesWithCounts.reduce((sum, sub) => sum + sub.count, 0)
    
    return {
      ...cat,
      count: totalCount,
      subcategories: subcategoriesWithCounts
    }
  })

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const filterCategories = (categories: Category[], term: string): Category[] => {
    if (!term) return categoriesWithCounts
    
    return categoriesWithCounts.filter(category => {
      const matchesMain = category.title.toLowerCase().includes(term.toLowerCase())
      const matchesSub = category.subcategories?.some(sub => 
        sub.title.toLowerCase().includes(term.toLowerCase())
      )
      
      if (matchesMain || matchesSub) {
        if (matchesSub && !matchesMain) {
          // If only subcategories match, include the parent with filtered subcategories
          return {
            ...category,
            subcategories: category.subcategories?.filter(sub => 
              sub.title.toLowerCase().includes(term.toLowerCase())
            )
          }
        }
        return category
      }
      return false
    })
  }

  const renderCategoryCard = (category: Category & { count?: number }, level: number = 0): React.ReactNode => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0
    const isExpanded = expandedCategories.has(category.id)
    
    return (
      <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-shop_light_green/20 to-shop_dark_green/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {category.icon ? (
                    <img 
                      src={category.icon} 
                      alt={category.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <Package className="w-7 h-7 text-shop_dark_green" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="text-xl font-bold text-gray-900 hover:text-shop_dark_green transition-colors duration-200 block"
                  >
                    {category.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {category.count || 0} products
                    </span>
                    {hasSubcategories && (
                      <span className="text-sm text-shop_orange font-medium">
                        {category.subcategories?.length || 0} subcategories
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                {hasSubcategories && (
                  <button 
                    onClick={() => toggleExpanded(category.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    {isExpanded ? 
                      <ChevronDown className="w-5 h-5 text-gray-600" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    }
                  </button>
                )}
                <Link 
                  href={`/categories/${category.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-shop_dark_green text-white rounded-lg hover:bg-shop_light_green transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  Browse
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Subcategories */}
          {hasSubcategories && isExpanded && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.subcategories?.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-shop_light_green transition-all duration-200 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-shop_light_green/20 rounded-lg flex items-center justify-center">
                        {sub.icon ? (
                          <img 
                            src={sub.icon} 
                            alt={sub.title}
                            className="w-4 h-4 rounded object-cover"
                          />
                        ) : (
                          <Package className="w-4 h-4 text-shop_dark_green" />
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/categories/${sub.slug}`}
                          className="text-sm font-semibold text-gray-900 hover:text-shop_dark_green transition-colors duration-200"
                        >
                          {sub.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          {sub.count || 0} products
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={`/categories/${sub.slug}`}
                      className="text-shop_dark_green hover:text-shop_light_green transition-colors duration-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCategoryList = (categories: (Category & { count?: number })[], level: number = 0): React.ReactNode => {
    return categories.map(category => renderCategoryCard(category, level))
  }

  const filteredCategories = filterCategories(categoriesWithCounts, searchTerm)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Categories</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">All Categories</h1>
              <p className="text-gray-600 text-lg">
                Browse our complete collection of categories and subcategories
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-shop_dark_green shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-shop_dark_green shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-shop_dark_green focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {filteredCategories.length > 0 ? (
            renderCategoryList(filteredCategories)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Expand/Collapse All */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => setExpandedCategories(new Set(categories.map(c => c.id)))}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-shop_dark_green hover:text-shop_dark_green transition-all duration-200 hover:shadow-md font-medium"
          >
            Expand All Categories
          </button>
          <button
            onClick={() => setExpandedCategories(new Set())}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-shop_dark_green hover:text-shop_dark_green transition-all duration-200 hover:shadow-md font-medium"
          >
            Collapse All Categories
          </button>
        </div>
      </div>
    </div>
  )
}
