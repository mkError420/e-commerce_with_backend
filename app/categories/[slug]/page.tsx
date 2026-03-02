'use client'

import React, { useState, useEffect } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/ProductCard'
import { useCategories, useFlatCategories } from '@/hooks'
import { api } from '@/lib/api-client'
import { ArrowLeft, Filter, Grid, List } from 'lucide-react'
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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  
  const { categories } = useCategories()
  const { categories: flatCategories } = useFlatCategories()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Find current category
  const currentCategory = flatCategories.find(cat => cat.slug === slug)
  
  useEffect(() => {
    if (slug) {
      fetchProducts()
    }
  }, [slug])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Fetch all products and filter client-side
      const data = await api.products.list()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Enhanced category filtering to handle both main categories and subcategories
    let matchesCategory = true
    if (currentCategory) {
      // Check if product matches the selected category or any of its subcategories
      const selectedMainCat = categories.find(cat => cat.title === currentCategory.title)
      if (selectedMainCat) {
        // Check if product matches main category
        if (product.category === currentCategory.title) {
          matchesCategory = true
        } else {
          // Check if product matches any subcategory
          matchesCategory = selectedMainCat.subcategories?.some(sub => 
            product.category === sub.title
          ) || false
        }
      }
    }
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
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

  if (loading) {
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

  if (!currentCategory) {
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
            {(() => {
              const parentCat = categories.find(cat => cat.subcategories?.some(sub => sub.title === currentCategory.title))
              if (parentCat) {
                return (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Link href={`/categories/${parentCat.slug}`} className="hover:text-shop_dark_green transition-colors">
                      {parentCat.title}
                    </Link>
                    <span>→</span>
                    <span className="text-gray-900 font-medium">{currentCategory.title}</span>
                  </div>
                )
              }
              return null
            })()}
          </div>
          
          <p className="text-lg text-gray-600 max-w-3xl mb-4">
            Browse our collection of {currentCategory.title.toLowerCase()} products
          </p>
          
          {/* Product Count */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {filteredAndSortedProducts.length} products found
            </span>
            {(() => {
              const parentCat = categories.find(cat => cat.subcategories?.some(sub => sub.title === currentCategory.title))
              if (parentCat) {
                return (
                  <span>
                    • Subcategory of {parentCat.title}
                  </span>
                )
              }
              return null
            })()}
          </div>
        </div>

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
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="bg-shop_dark_green text-white px-6 py-2 rounded-lg hover:bg-shop_light_green transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </Container>
    </div>
  )
}
