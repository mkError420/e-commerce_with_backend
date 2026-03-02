'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import CategorySearch from '@/components/CategorySearch';
import { Music, Headphones, Mic, Radio, Disc, Smartphone } from 'lucide-react';

const MusicPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['music'])
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

  // Music subcategories
  const musicCategories = [
    { id: 'instruments', name: 'Musical Instruments', icon: Music, count: 234 },
    { id: 'audio-equipment', name: 'Audio Equipment', icon: Headphones, count: 189 },
    { id: 'records', name: 'Records', icon: Disc, count: 156 },
    { id: 'accessories', name: 'Accessories', icon: Mic, count: 145 },
    { id: 'streaming', name: 'Streaming Devices', icon: Radio, count: 67 },
    { id: 'portable', name: 'Portable Audio', icon: Smartphone, count: 98 }
  ]

  // Sample music products
  const musicProducts = [
    {
      id: 1,
      name: 'Acoustic Guitar Premium Spruce',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Music & Audio',
      subcategory: 'Musical Instruments',
      size: 'Full Size',
      description: 'Professional acoustic guitar with solid spruce top'
    },
    {
      id: 2,
      name: 'Studio Headphones Professional',
      price: 149.99,
      originalPrice: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 189,
      badge: 'Studio Quality',
      category: 'Music & Audio',
      subcategory: 'Audio Equipment',
      size: 'Over-Ear',
      description: 'Professional studio headphones with accurate sound reproduction'
    },
    {
      id: 3,
      name: 'Vinyl Record Collection Classic Rock',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 156,
      badge: 'Limited Edition',
      category: 'Music & Audio',
      subcategory: 'Records',
      size: '3 LP Set',
      description: 'Classic rock vinyl record collection with remastered tracks'
    },
    {
      id: 4,
      name: 'USB Microphone Studio Kit',
      price: 79.99,
      originalPrice: 99.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 98,
      badge: 'Complete Kit',
      category: 'Music & Audio',
      subcategory: 'Accessories',
      size: 'Complete',
      description: 'Complete USB microphone kit with stand and pop filter'
    },
    {
      id: 5,
      name: 'Bluetooth Speaker Premium',
      price: 129.99,
      originalPrice: 169.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 145,
      badge: 'Wireless',
      category: 'Music & Audio',
      subcategory: 'Audio Equipment',
      size: 'Portable',
      description: 'Premium wireless bluetooth speaker with deep bass'
    },
    {
      id: 6,
      name: 'Digital Piano 88 Keys',
      price: 599.99,
      originalPrice: 799.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 67,
      badge: 'Professional',
      category: 'Music & Audio',
      subcategory: 'Musical Instruments',
      size: '88 Keys',
      description: 'Digital piano with weighted keys and authentic sound'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = musicProducts.filter(product => {
      // Enhanced search functionality
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.badge?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max
      
      const matchesRatings = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating))
      
      const matchesSizes = selectedSizes.length === 0 || selectedSizes.includes(product.size || '')
      
      const matchesCategories = selectedCategory.length === 0 || 
        selectedCategory.some(cat => 
          cat.toLowerCase() === product.category.toLowerCase() ||
          cat.toLowerCase() === product.subcategory.toLowerCase()
        )
      
      return matchesSearch && matchesPriceRange && matchesRatings && matchesSizes && matchesCategories
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
      case 'newest':
        return filtered.sort((a, b) => b.id - a.id)
      case 'popular':
        return filtered.sort((a, b) => b.reviews - a.reviews)
      case 'discount':
        return filtered.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0
          return discountB - discountA
        })
      default:
        return filtered
    }
  }, [searchTerm, sortBy, selectedRatings, selectedSizes, priceRange, selectedCategory])

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
            Music & Audio
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Discover musical instruments, professional audio equipment, vinyl records, and accessories. Everything you need for music creation and enjoyment.
          </p>
        </div>

        {/* Search Section */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onQuickFilter={handleQuickFilter}
          quickFilters={[
            { label: 'All', value: 'music', color: 'bg-gray-100 text-gray-700' },
            { label: 'Instruments', value: 'Musical Instruments', color: 'bg-violet-100 text-violet-700' },
            { label: 'Audio Equipment', value: 'Audio Equipment', color: 'bg-purple-100 text-purple-700' },
            { label: 'Records', value: 'Records', color: 'bg-pink-100 text-pink-700' },
            { label: 'Accessories', value: 'Accessories', color: 'bg-blue-100 text-blue-700' }
          ]}
          searchSuggestions={['acoustic guitar', 'studio headphones', 'microphone', 'piano', 'music stand']}
          placeholder='Search for instruments, audio equipment, or music gear...'
          categoryColor='violet'
          resultCount={filteredAndSortedProducts.length}
        />

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {musicCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 text-violet-600 mb-3 mx-auto'>
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
              categories={[{ id: 'music', name: 'Music & Audio', count: 889 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500'
                >
                  <option value='featured'>Featured</option>
                  <option value='newest'>Newest First</option>
                  <option value='popular'>Most Popular</option>
                  <option value='discount'>Best Discount</option>
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
                  className='bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors'
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

export default MusicPage
