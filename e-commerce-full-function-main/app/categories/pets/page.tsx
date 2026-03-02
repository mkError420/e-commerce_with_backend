'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { Dog, Cat, Bird, Fish, Heart, Package } from 'lucide-react';

const PetsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['pets'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Pets subcategories
  const petsCategories = [
    { id: 'dog-supplies', name: 'Dog Supplies', icon: Dog, count: 456 },
    { id: 'cat-supplies', name: 'Cat Supplies', icon: Cat, count: 389 },
    { id: 'bird-supplies', name: 'Bird Supplies', icon: Bird, count: 234 },
    { id: 'pet-food', name: 'Pet Food', icon: Package, count: 567 },
    { id: 'toys', name: 'Pet Toys', icon: Heart, count: 345 },
    { id: 'fish-supplies', name: 'Fish Supplies', icon: Fish, count: 123 }
  ]

  // Sample pet products
  const petProducts = [
    {
      id: 1,
      name: 'Premium Dog Food Adult Formula',
      price: 49.99,
      originalPrice: 69.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      badge: 'Premium',
      category: 'Pet Supplies',
      subcategory: 'Pet Food',
      size: '15kg',
      description: 'Premium adult dog food with balanced nutrition'
    },
    {
      id: 2,
      name: 'Interactive Cat Toy Set',
      price: 24.99,
      originalPrice: 34.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 189,
      badge: 'Interactive',
      category: 'Pet Supplies',
      subcategory: 'Pet Toys',
      size: '5 Pieces',
      description: 'Interactive cat toy set for mental stimulation'
    },
    {
      id: 3,
      name: 'Dog Bed Memory Foam Large',
      price: 79.99,
      originalPrice: 99.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 156,
      badge: 'Comfort',
      category: 'Pet Supplies',
      subcategory: 'Dog Supplies',
      size: 'Large',
      description: 'Memory foam dog bed for ultimate comfort'
    },
    {
      id: 4,
      name: 'Cat Scratching Post Modern',
      price: 59.99,
      originalPrice: 79.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 98,
      badge: 'Modern',
      category: 'Pet Supplies',
      subcategory: 'Cat Supplies',
      size: 'Tall',
      description: 'Modern cat scratching post with multiple levels'
    },
    {
      id: 5,
      name: 'Bird Cage Premium Stainless Steel',
      price: 129.99,
      originalPrice: 169.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 145,
      badge: 'Premium',
      category: 'Pet Supplies',
      subcategory: 'Bird Supplies',
      size: 'Large',
      description: 'Premium stainless steel bird cage with accessories'
    },
    {
      id: 6,
      name: 'Fish Tank Filter Quiet',
      price: 34.99,
      originalPrice: 44.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 67,
      badge: 'Quiet',
      category: 'Pet Supplies',
      subcategory: 'Fish Supplies',
      size: 'Medium',
      description: 'Quiet and efficient fish tank filter'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = petProducts.filter(product => {
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
            Pet Supplies
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Everything for your beloved pets - from premium food and comfortable beds to interactive toys and essential supplies. Quality products for happy, healthy pets.
          </p>
        </div>

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {petsCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 mb-3 mx-auto'>
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
              categories={[{ id: 'pets', name: 'Pet Supplies', count: 2114 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
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
                  className='bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors'
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

export default PetsPage
