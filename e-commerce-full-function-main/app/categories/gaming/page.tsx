'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { Gamepad2, Monitor, Headphones, Keyboard } from 'lucide-react';

const GamingPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['gaming'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Gaming subcategories
  const gamingCategories = [
    { id: 'consoles', name: 'Gaming Consoles', icon: Gamepad2, count: 18 },
    { id: 'monitors', name: 'Gaming Monitors', icon: Monitor, count: 12 },
    { id: 'headsets', name: 'Gaming Headsets', icon: Headphones, count: 15 },
    { id: 'keyboards', name: 'Gaming Keyboards', icon: Keyboard, count: 7 }
  ]

  // Sample gaming products
  const gamingProducts = [
    {
      id: 26,
      name: 'Gaming Console Pro 2024',
      price: 499.99,
      originalPrice: 599.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Gaming',
      subcategory: 'Consoles',
      size: 'Standard',
      description: 'Latest gaming console with 4K graphics and ray tracing'
    },
    {
      id: 27,
      name: 'Gaming Monitor 27" 144Hz',
      price: 349.99,
      originalPrice: 449.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 189,
      badge: 'Premium',
      category: 'Gaming',
      subcategory: 'Monitors',
      size: '27"',
      description: 'High-refresh gaming monitor with 1ms response time'
    },
    {
      id: 28,
      name: 'Wireless Gaming Headset RGB',
      price: 89.99,
      originalPrice: 129.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 156,
      badge: 'Popular',
      category: 'Gaming',
      subcategory: 'Headsets',
      size: 'One Size',
      description: 'Premium wireless headset with 7.1 surround sound'
    },
    {
      id: 29,
      name: 'Mechanical Gaming Keyboard RGB',
      price: 129.99,
      originalPrice: 179.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 98,
      badge: 'Hot Deal',
      category: 'Gaming',
      subcategory: 'Keyboards',
      size: 'Full Size',
      description: 'Mechanical keyboard with customizable RGB backlighting'
    },
    {
      id: 30,
      name: 'Gaming Laptop RTX 4070',
      price: 1299.99,
      originalPrice: 1599.99,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 267,
      badge: 'Premium',
      category: 'Gaming',
      subcategory: 'Consoles',
      size: '15.6"',
      description: 'High-performance gaming laptop with latest RTX graphics'
    },
    {
      id: 31,
      name: 'Gaming Chair Ergonomic',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 145,
      badge: 'Sale',
      category: 'Gaming',
      subcategory: 'Accessories',
      size: 'Adjustable',
      description: 'Ergonomic gaming chair with lumbar support'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = gamingProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max
      
      const matchesRatings = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating))
      
      const matchesSizes = selectedSizes.length === 0 || selectedSizes.includes(product.size || '')
      
      return matchesSearch && matchesPriceRange && matchesRatings && matchesSizes
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name))
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      default:
        return filtered
    }
  }, [searchTerm, sortBy, selectedRatings, selectedSizes, priceRange])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  return (
    <div className='min-h-screen bg-gray-50'>
      <Container className='py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Gaming
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Level up your gaming experience with our premium gaming gear. From consoles and monitors to headsets and keyboards, find everything you need for the ultimate gaming setup.
          </p>
        </div>

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {gamingCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-600 mb-3 mx-auto'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <h3 className='font-semibold text-gray-900 text-sm mb-1'>{subcat.name}</h3>
                  <p className='text-xs text-gray-500'>{subcat.count} products</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <aside className='lg:w-80 flex-shrink-0'>
            <FilterSidebar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              categories={[{ id: 'gaming', name: 'Gaming', count: 52 }]}
              dealTypes={[]}
              selectedCategories={selectedCategory}
              setSelectedCategories={setSelectedCategory}
              selectedDealType=""
              setSelectedDealType={() => {}}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedRatings={selectedRatings}
              setSelectedRatings={setSelectedRatings}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Results Header */}
            <div className='flex justify-between items-center mb-6'>
              <div className='text-gray-600'>
                Showing {currentProducts.length} of {filteredAndSortedProducts.length} products
              </div>
              
              {/* Sort Dropdown */}
              <div className='flex items-center gap-4'>
                <label className='text-sm font-medium text-gray-700'>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                >
                  <option value='featured'>Featured</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                  <option value='name-asc'>Name: A to Z</option>
                  <option value='name-desc'>Name: Z to A</option>
                  <option value='rating'>Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Empty State */}
            {currentProducts.length === 0 && (
              <div className='text-center py-16'>
                <div className='text-gray-400 text-6xl mb-4'>🎮</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  No products found
                </h3>
                <p className='text-gray-600 mb-6'>
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedRatings([])
                    setSelectedSizes([])
                    setPriceRange({ min: 0, max: 1000 })
                  }}
                  className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center mt-8'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredAndSortedProducts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  )
}

export default GamingPage
