'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import CategorySearch from '@/components/CategorySearch';
import { Plane, Package, Map, Compass, Camera, Shield } from 'lucide-react';

const TravelPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['travel'])
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

  // Travel subcategories
  const travelCategories = [
    { id: 'luggage', name: 'Luggage', icon: Package, count: 189 },
    { id: 'backpacks', name: 'Backpacks', icon: Package, count: 145 },
    { id: 'accessories', name: 'Travel Accessories', icon: Compass, count: 234 },
    { id: 'gear', name: 'Travel Gear', icon: Shield, count: 98 },
    { id: 'electronics', name: 'Travel Electronics', icon: Camera, count: 67 },
    { id: 'organizers', name: 'Organizers', icon: Map, count: 78 }
  ]

  // Sample travel products
  const travelProducts = [
    {
      id: 1,
      name: 'Premium Hardshell Luggage Set 3-Piece',
      price: 249.99,
      originalPrice: 349.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Travel',
      subcategory: 'Luggage',
      size: '3-Piece Set',
      description: 'Durable hardshell luggage set with TSA locks'
    },
    {
      id: 2,
      name: 'Travel Backpack 40L Water-Resistant',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 189,
      badge: 'Adventure',
      category: 'Travel',
      subcategory: 'Backpacks',
      size: '40L',
      description: 'Water-resistant travel backpack with laptop compartment'
    },
    {
      id: 3,
      name: 'Universal Travel Adapter 200W',
      price: 34.99,
      originalPrice: 49.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 156,
      badge: 'Essential',
      category: 'Travel',
      subcategory: 'Travel Accessories',
      size: 'Universal',
      description: 'International travel adapter with USB ports'
    },
    {
      id: 4,
      name: 'Travel Pillow Memory Foam',
      price: 29.99,
      originalPrice: 39.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 98,
      badge: 'Comfort',
      category: 'Travel',
      subcategory: 'Travel Accessories',
      size: 'One Size',
      description: 'Ergonomic memory foam travel pillow with carrying case'
    },
    {
      id: 5,
      name: 'Packing Cubes Set 6 Pieces',
      price: 24.99,
      originalPrice: 34.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 145,
      badge: 'Organizer',
      category: 'Travel',
      subcategory: 'Organizers',
      size: '6-Piece Set',
      description: 'Compression packing cubes for efficient luggage organization'
    },
    {
      id: 6,
      name: 'Portable Travel Safe',
      price: 79.99,
      originalPrice: 99.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 67,
      badge: 'Security',
      category: 'Travel',
      subcategory: 'Travel Gear',
      size: 'Portable',
      description: 'Portable safe for securing valuables while traveling'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = travelProducts.filter(product => {
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
            Travel
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Everything you need for your next adventure - from durable luggage and comfortable backpacks to essential travel accessories and security gear.
          </p>
        </div>

        {/* Search Section */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onQuickFilter={handleQuickFilter}
          quickFilters={[
            { label: 'All', value: 'travel', color: 'bg-gray-100 text-gray-700' },
            { label: 'Luggage', value: 'Luggage', color: 'bg-sky-100 text-sky-700' },
            { label: 'Backpacks', value: 'Backpacks', color: 'bg-blue-100 text-blue-700' },
            { label: 'Travel Accessories', value: 'Travel Accessories', color: 'bg-green-100 text-green-700' },
            { label: 'Travel Gear', value: 'Travel Gear', color: 'bg-purple-100 text-purple-700' }
          ]}
          searchSuggestions={['suitcase', 'backpack', 'travel pillow', 'luggage set', 'passport holder']}
          placeholder='Search for luggage, travel gear, or accessories...'
          categoryColor='sky'
          resultCount={filteredAndSortedProducts.length}
        />

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {travelCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-sky-100 text-sky-600 mb-3 mx-auto'>
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
              categories={[{ id: 'travel', name: 'Travel', count: 811 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500'
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
                  className='bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors'
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

export default TravelPage
