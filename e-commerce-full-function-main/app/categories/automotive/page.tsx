'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { Car, Wrench, Smartphone, Shield, Battery, Gauge } from 'lucide-react';

const AutomotivePage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['automotive'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Automotive subcategories
  const automotiveCategories = [
    { id: 'car-parts', name: 'Car Parts', icon: Wrench, count: 234 },
    { id: 'accessories', name: 'Accessories', icon: Car, count: 189 },
    { id: 'tools', name: 'Tools', icon: Wrench, count: 156 },
    { id: 'electronics', name: 'Electronics', icon: Smartphone, count: 145 },
    { id: 'maintenance', name: 'Maintenance', icon: Shield, count: 98 },
    { id: 'performance', name: 'Performance', icon: Gauge, count: 67 }
  ]

  // Sample automotive products
  const automotiveProducts = [
    {
      id: 1,
      name: 'Professional Car Diagnostic Scanner',
      price: 189.99,
      originalPrice: 259.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Automotive',
      subcategory: 'Electronics',
      size: 'Universal',
      description: 'Advanced OBD2 scanner with full system diagnostics'
    },
    {
      id: 2,
      name: 'Premium Car Cover Weatherproof',
      price: 79.99,
      originalPrice: 109.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 189,
      badge: 'Durable',
      category: 'Automotive',
      subcategory: 'Accessories',
      size: 'Sedan',
      description: 'All-weather car cover with UV protection'
    },
    {
      id: 3,
      name: 'Mechanic Tool Set 200 Pieces',
      price: 149.99,
      originalPrice: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 156,
      badge: 'Professional',
      category: 'Automotive',
      subcategory: 'Tools',
      size: 'Complete Set',
      description: 'Complete mechanic tool set with case'
    },
    {
      id: 4,
      name: 'Car Battery Charger 12V',
      price: 59.99,
      originalPrice: 79.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 98,
      badge: 'Essential',
      category: 'Automotive',
      subcategory: 'Electronics',
      size: '12V',
      description: 'Smart battery charger with maintenance mode'
    },
    {
      id: 5,
      name: 'LED Headlight Conversion Kit',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 145,
      badge: 'Bright',
      category: 'Automotive',
      subcategory: 'Electronics',
      size: 'H4',
      description: 'Ultra-bright LED headlight conversion kit'
    },
    {
      id: 6,
      name: 'Car Engine Oil Filter Set',
      price: 24.99,
      originalPrice: 34.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 67,
      badge: 'Value Pack',
      category: 'Automotive',
      subcategory: 'Car Parts',
      size: 'Standard',
      description: 'Premium oil filter set for most vehicles'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = automotiveProducts.filter(product => {
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
            Automotive
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Complete automotive solutions including car parts, accessories, tools, and electronics. Quality products for vehicle maintenance, repair, and enhancement.
          </p>
        </div>

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {automotiveCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 text-slate-600 mb-3 mx-auto'>
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
              categories={[{ id: 'automotive', name: 'Automotive', count: 889 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
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
                  className='bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors'
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

export default AutomotivePage
