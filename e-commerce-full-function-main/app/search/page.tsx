'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/Container'
import { productsData } from '@/constants/data'
import ProductCard from '@/components/ProductCard'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const SearchPageContent = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(productsData.map(product => product.category))]
    return cats
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    console.log('Filtering products with query:', query, 'category filter:', selectedCategory) // Debug log
    
    // If no search query, show all products
    if (!query.trim()) {
      console.log('No search query, showing all products') // Debug log
      return productsData
    }

    // If there's a search query, search across ALL categories
    let filtered = productsData.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query.toLowerCase())
      const categoryMatch = product.category.toLowerCase().includes(query.toLowerCase())
      const descriptionMatch = product.description?.toLowerCase().includes(query.toLowerCase())
      const badgeMatch = product.badge?.toLowerCase().includes(query.toLowerCase())
      
      console.log(`Product: ${product.name}, Name: ${nameMatch}, Category: ${categoryMatch}, Desc: ${descriptionMatch}, Badge: ${badgeMatch}`) // Debug log
      
      // Return product if it matches ANY field (name, category, description, or badge)
      return nameMatch || categoryMatch || descriptionMatch || badgeMatch
    })

    // Apply category filter only if a specific category is selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
      console.log(`Applied category filter "${selectedCategory}", results:`, filtered) // Debug log
    }
    
    // Apply price range filter
    filtered = filtered.filter(product => product.price >= priceRange.min && product.price <= priceRange.max)
    
    console.log('Filtered results before sorting:', filtered) // Debug log

    // Sort products
    let sorted = [...filtered]
    switch (sortBy) {
      case 'price-low':
        sorted = filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sorted = filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sorted = filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        sorted = filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // Keep original order for relevance
        break
    }

    console.log('Final sorted results:', sorted) // Debug log
    return sorted
  }, [searchQuery, selectedCategory, priceRange, sortBy, query])

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    }
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    window.history.pushState(null, '', `/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange({ min: 0, max: 1000 })
    setSortBy('relevance')
    // Reset URL to just search query
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    }
    window.history.pushState(null, '', `/search?${params.toString()}`)
  }

  const hasActiveFilters = selectedCategory || priceRange.min > 0 || priceRange.max < 1000

  return (
    <div className='min-h-screen bg-gray-50'>
      <Container className='py-8'>
        {/* Search Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Search Results
            {query && <span className='text-gray-600'> for "{query}"</span>}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className='mb-6'>
            <div className='relative max-w-2xl'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for products...'
                className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg'
              />
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400' />
              <button
                type='submit'
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
              >
                Search
              </button>
            </div>
          </form>

          {/* Results Count and Filters Toggle */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <p className='text-gray-600'>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
            
            <div className='flex items-center gap-4'>
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                <SlidersHorizontal className='w-5 h-5' />
                Filters
                {hasActiveFilters && (
                  <span className='bg-indigo-600 text-white text-xs px-2 py-1 rounded-full'>Active</span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                <option value='relevance'>Sort by: Relevance</option>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='rating'>Highest Rated</option>
                <option value='reviews'>Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        <div className='flex gap-8'>
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1'
                  >
                    <X className='w-4 h-4' />
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className='mb-6'>
                <h4 className='font-medium text-gray-900 mb-3'>Category</h4>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='category'
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory('')}
                      className='mr-2 text-indigo-600 focus:ring-indigo-500'
                    />
                    <span className='text-gray-700'>All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className='flex items-center'>
                      <input
                        type='radio'
                        name='category'
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className='mr-2 text-indigo-600 focus:ring-indigo-500'
                      />
                      <span className='text-gray-700'>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className='mb-6'>
                <h4 className='font-medium text-gray-900 mb-3'>Price Range</h4>
                <div className='space-y-3'>
                  <div>
                    <label className='text-sm text-gray-600'>Min: ৳{priceRange.min}</label>
                    <input
                      type='range'
                      min='0'
                      max='1000'
                      step='10'
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Max: ৳{priceRange.max}</label>
                    <input
                      type='range'
                      min='0'
                      max='1000'
                      step='10'
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className='w-full'
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className='flex-1'>
            {filteredProducts.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className='text-center py-16'>
                <div className='w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center'>
                  <Search className='w-12 h-12 text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>No products found</h3>
                <p className='text-gray-600 mb-6'>
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearFilters}
                  className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}

export default SearchPage
