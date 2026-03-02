'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import CategorySearch from '@/components/CategorySearch';
import { Baby, Car, Shirt, Home, Heart, Gamepad2 } from 'lucide-react';

const BabyPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['baby'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Quick filter handler
  const handleQuickFilter = (filterValue: string) => {
    setSelectedCategory([filterValue])
    setSearchTerm('')
    setSelectedRatings([])
    setSelectedSizes([])
    setPriceRange({ min: 0, max: 1000 })
  }

  // Baby subcategories
  const babyCategories = [
    { id: 'baby-care', name: 'Baby Care', icon: Heart, count: 89 },
    { id: 'kids-clothing', name: 'Kids Clothing', icon: Shirt, count: 156 },
    { id: 'toys', name: 'Toys', icon: Gamepad2, count: 234 },
    { id: 'furniture', name: 'Furniture', icon: Home, count: 67 },
    { id: 'strollers', name: 'Strollers', icon: Car, count: 45 },
    { id: 'feeding', name: 'Feeding', icon: Baby, count: 78 }
  ]

  // Sample baby products
  const babyProducts = [
    {
      id: 1,
      name: 'Premium Baby Stroller 3-in-1 Travel System',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Baby & Kids',
      subcategory: 'Strollers',
      size: 'One Size',
      description: 'Versatile 3-in-1 travel system with car seat compatibility'
    },
    {
      id: 2,
      name: 'Organic Baby Care Gift Set',
      price: 49.99,
      originalPrice: 69.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 189,
      badge: 'Eco-Friendly',
      category: 'Baby & Kids',
      subcategory: 'Baby Care',
      size: 'Set',
      description: 'Complete organic baby care set with gentle formulas'
    },
    {
      id: 3,
      name: 'Educational Wooden Blocks Set',
      price: 34.99,
      originalPrice: 44.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 156,
      badge: 'Popular',
      category: 'Baby & Kids',
      subcategory: 'Toys',
      size: '100 Pieces',
      description: 'Classic wooden blocks for creative play and learning'
    },
    {
      id: 4,
      name: 'Kids Cotton T-Shirt Pack',
      price: 24.99,
      originalPrice: 34.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 98,
      badge: 'Value Pack',
      category: 'Baby & Kids',
      subcategory: 'Kids Clothing',
      size: '2-3 Years',
      description: 'Soft cotton t-shirts pack for everyday comfort'
    },
    {
      id: 5,
      name: 'Convertible Baby Crib Modern',
      price: 449.99,
      originalPrice: 599.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 67,
      badge: 'Premium',
      category: 'Baby & Kids',
      subcategory: 'Furniture',
      size: 'Standard',
      description: 'Modern convertible crib that grows with your child'
    },
    {
      id: 6,
      name: 'Baby Feeding Bottle Set',
      price: 29.99,
      originalPrice: 39.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 145,
      badge: 'Sale',
      category: 'Baby & Kids',
      subcategory: 'Feeding',
      size: '250ml',
      description: 'Anti-colic feeding bottles with slow flow nipples'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = babyProducts.filter(product => {
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
            Baby & Kids
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Everything you need for your little ones - from baby care essentials to educational toys and comfortable clothing. Quality products for happy, healthy kids.
          </p>
        </div>

        {/* Search Section */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onQuickFilter={handleQuickFilter}
          quickFilters={[
            { label: 'All', value: 'baby', color: 'bg-gray-100 text-gray-700' },
            { label: 'Baby Care', value: 'Baby Care', color: 'bg-rose-100 text-rose-700' },
            { label: 'Kids Clothing', value: 'Kids Clothing', color: 'bg-pink-100 text-pink-700' },
            { label: 'Toys', value: 'Toys', color: 'bg-purple-100 text-purple-700' },
            { label: 'Furniture', value: 'Furniture', color: 'bg-blue-100 text-blue-700' }
          ]}
          searchSuggestions={['baby stroller', 'diapers', 'baby clothes', 'baby toys', 'baby care']}
          placeholder='Search for baby products, brands, or essentials...'
          categoryColor='rose'
          resultCount={filteredAndSortedProducts.length}
        />

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {babyCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-rose-100 text-rose-600 mb-3 mx-auto'>
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
              categories={[{ id: 'baby', name: 'Baby & Kids', count: 669 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
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
                <div className='text-gray-400 text-6xl mb-4'>🔍</div>
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
                  className='bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors'
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

export default BabyPage
