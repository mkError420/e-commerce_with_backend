'use client'

import React, { useState, useEffect, use } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/Pagination'
import { useCategories, useFlatCategories } from '@/hooks'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  icon?: string
  subcategories?: Category[]
}
import { api } from '@/lib/api-client'
import { ArrowLeft, Filter, Grid, List, Package } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  category: string
  description?: string
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = decodeURIComponent(resolvedParams.slug)
  
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { categories: flatCategories, loading: flatCategoriesLoading, error: flatCategoriesError } = useFlatCategories()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Find current category and its parent
  const currentCategory = flatCategories.find(cat => cat.slug === slug)
  const parentCategory = currentCategory?.parentId ? 
    flatCategories.find(cat => cat.id === currentCategory.parentId) : null
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Category Page Debug:', {
      slug,
      flatCategories: flatCategories.map(cat => ({ id: cat.id, title: cat.title, slug: cat.slug })),
      currentCategory,
      parentCategory
    })
  }
  
  // Get main category data if this is a subcategory
  const mainCategory = currentCategory?.parentId ? 
    categories.find(cat => cat.id === currentCategory.parentId) : 
    categories.find(cat => cat.slug === slug)
  
  // Combined loading state
  const isLoading = categoriesLoading || flatCategoriesLoading || productsLoading
  
  // Simple debug log
  if (process.env.NODE_ENV === 'development') {
    console.log('Category Page:', { slug, isLoading, hasCategory: !!currentCategory, productsCount: products.length })
  }
  
  useEffect(() => {
    if (slug) {
      fetchProducts()
    }
  }, [slug])

  useEffect(() => {
    // Reset page when filters change
    setCurrentPage(1)
  }, [searchTerm, sortBy])

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      setProductsError(null)
      // Fetch all products and filter client-side
      const data = await api.products.list()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProductsError('Failed to load products')
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const filteredAndSortedProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Enhanced category filtering to handle both main categories and subcategories
    let matchesCategory = false
    if (currentCategory) {
      // Check if product matches the selected category by title
      if (product.category?.toLowerCase() === currentCategory.title.toLowerCase()) {
        matchesCategory = true
      } else {
        // Check if this is a main category and product matches any of its subcategories
        const selectedMainCat = categories.find(cat => cat.slug === currentCategory.slug)
        if (selectedMainCat) {
          // Check if product matches main category title or any subcategory title
          const mainMatch = product.category?.toLowerCase() === selectedMainCat.title.toLowerCase()
          const subMatch = selectedMainCat.subcategories?.some(sub => 
            product.category?.toLowerCase() === sub.title.toLowerCase()
          )
          matchesCategory = mainMatch || subMatch || false
        } else {
          // This might be a subcategory, check if product matches it directly
          matchesCategory = product.category?.toLowerCase() === currentCategory.title.toLowerCase()
        }
      }
    }
    
    return matchesSearch && matchesCategory
  })

  // Sort products
  const sortedProducts = [...filteredAndSortedProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  // Pagination
  const totalProducts = sortedProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = sortedProducts.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (categoriesError || flatCategoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Categories</h1>
            <p className="text-gray-600 mb-6">
              {categoriesError || flatCategoriesError || 'Failed to load category information'}
            </p>
            <Link href="/categories" className="text-shop_dark_green hover:text-shop_light_green">
              ← Back to Categories
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  if (!currentCategory && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/categories" className="text-shop_dark_green hover:text-shop_light_green">
              ← Back to Categories
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  // If still loading or category not found, don't render content
  if (!currentCategory && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category "{slug}" doesn't exist.</p>
            <Link href="/categories" className="text-shop_dark_green hover:text-shop_light_green">
              ← Back to Categories
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  // Additional safety check
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
            <p className="text-gray-600">Please wait while we load the category.</p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          
          {/* Category Hierarchy */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {currentCategory.title}
            </h1>
            {parentCategory && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Link href={`/categories/${parentCategory.slug}`} className="hover:text-shop_dark_green transition-colors">
                  {parentCategory.title}
                </Link>
                <span>→</span>
                <span className="text-gray-900 font-medium">{currentCategory.title}</span>
              </div>
            )}
          </div>
          
          <p className="text-lg text-gray-600 max-w-3xl mb-4">
            Browse our collection of {currentCategory.title.toLowerCase()} products
          </p>
          
          {/* Product Count */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {filteredAndSortedProducts.length} products found
            </span>
            {parentCategory && (
              <span>
                • Subcategory of {parentCategory.title}
              </span>
            )}
          </div>
        </div>

        {/* Subcategories Navigation - Only show for main categories */}
        {mainCategory && mainCategory.subcategories && mainCategory.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mainCategory.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-shop_dark_green hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-shop_light_green/20 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-shop_dark_green" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{sub.title}</h3>
                      <p className="text-xs text-gray-500">
                        {products.filter(p => p.category?.toLowerCase() === sub.title.toLowerCase()).length} products
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>
            
            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-shop_dark_green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-shop_dark_green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        {totalProducts > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {currentProducts.length} of {totalProducts} products
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {totalProducts > 0 ? (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalProducts}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">�</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Empty Category
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This category currently has no products available. 
              Check back later or browse other categories for amazing products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/categories"
                className="bg-shop_dark_green text-white px-6 py-3 rounded-lg hover:bg-shop_light_green transition-colors font-medium"
              >
                Browse All Categories
              </Link>
              <Link 
                href="/shop"
                className="border border-shop_dark_green text-shop_dark_green px-6 py-3 rounded-lg hover:bg-shop_light_green hover:text-white transition-colors font-medium"
              >
                Shop All Products
              </Link>
            </div>
            
            {/* Show related categories if this is a main category with subcategories */}
            {mainCategory && mainCategory.subcategories && mainCategory.subcategories.length > 0 && (
              <div className="mt-12">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Explore Subcategories</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {mainCategory.subcategories.map((sub) => {
                    const subProductCount = products.filter(p => 
                      p.category?.toLowerCase() === sub.title.toLowerCase()
                    ).length
                    return (
                      <Link
                        key={sub.id}
                        href={`/categories/${sub.slug}`}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-shop_dark_green hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          {sub.icon ? (
                            <img 
                              src={sub.icon} 
                              alt={sub.title}
                              className="w-6 h-6 rounded object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-shop_light_green/20 rounded-lg flex items-center justify-center">
                              <Package className="w-3 h-3 text-shop_dark_green" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{sub.title}</h5>
                            <p className="text-xs text-gray-500">
                              {subProductCount} {subProductCount === 1 ? 'product' : 'products'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
