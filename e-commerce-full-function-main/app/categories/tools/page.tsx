'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { Wrench, Hammer, Drill, Package, Home } from 'lucide-react';

const ToolsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['tools'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Tools subcategories
  const toolsCategories = [
    { id: 'power-tools', name: 'Power Tools', icon: Drill, count: 234 },
    { id: 'hand-tools', name: 'Hand Tools', icon: Hammer, count: 189 },
    { id: 'hardware', name: 'Hardware', icon: Wrench, count: 156 },
    { id: 'garden-tools', name: 'Garden Tools', icon: Home, count: 145 },
    { id: 'tool-sets', name: 'Tool Sets', icon: Package, count: 123 },
    { id: 'cutting-tools', name: 'Cutting Tools', icon: Wrench, count: 98 }
  ]

  // Sample tools products
  const toolsProducts = [
    {
      id: 1,
      name: 'Cordless Drill Driver 20V',
      price: 149.99,
      originalPrice: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Tools & Hardware',
      subcategory: 'Power Tools',
      size: '20V',
      description: 'Powerful cordless drill with long battery life'
    },
    {
      id: 2,
      name: 'Professional Socket Set 150 Pieces',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 189,
      badge: 'Professional',
      category: 'Tools & Hardware',
      subcategory: 'Tool Sets',
      size: '150 Pieces',
      description: 'Complete socket set for professional mechanics'
    },
    {
      id: 3,
      name: 'Electric Saw Circular 7-1/4"',
      price: 129.99,
      originalPrice: 169.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 156,
      badge: 'Powerful',
      category: 'Tools & Hardware',
      subcategory: 'Power Tools',
      size: '7-1/4"',
      description: 'Powerful circular saw for precise cutting'
    },
    {
      id: 4,
      name: 'Garden Tool Set 5 Pieces',
      price: 49.99,
      originalPrice: 69.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 98,
      badge: 'Garden',
      category: 'Tools & Hardware',
      subcategory: 'Garden Tools',
      size: '5 Pieces',
      description: 'Essential garden tool set for home gardening'
    },
    {
      id: 5,
      name: 'Adjustable Wrench Set 3 Pieces',
      price: 34.99,
      originalPrice: 44.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 145,
      badge: 'Essential',
      category: 'Tools & Hardware',
      subcategory: 'Hand Tools',
      size: '3 Pieces',
      description: 'Adjustable wrench set for various applications'
    },
    {
      id: 6,
      name: 'Screwdriver Set Precision',
      price: 24.99,
      originalPrice: 34.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 67,
      badge: 'Precision',
      category: 'Tools & Hardware',
      subcategory: 'Hand Tools',
      size: '32 Pieces',
      description: 'Precision screwdriver set for electronics'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = toolsProducts.filter(product => {
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
            Tools & Hardware
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Professional power tools, hand tools, hardware, and garden equipment. Quality tools for DIY projects, home improvement, and professional work.
          </p>
        </div>

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {toolsCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-stone-100 text-stone-600 mb-3 mx-auto'>
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
              categories={[{ id: 'tools', name: 'Tools & Hardware', count: 945 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500'
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
                  className='bg-stone-600 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors'
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

export default ToolsPage
