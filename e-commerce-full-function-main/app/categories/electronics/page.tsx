'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import CategorySearch from '@/components/CategorySearch';
import { Smartphone, Headphones, Camera, Watch, Tablet, Laptop } from 'lucide-react';

const ElectronicsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['electronics'])
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

  // Electronics subcategories
  const electronicsCategories = [
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone, count: 45 },
    { id: 'laptops', name: 'Laptops', icon: Laptop, count: 38 },
    { id: 'headphones', name: 'Headphones', icon: Headphones, count: 52 },
    { id: 'cameras', name: 'Cameras', icon: Camera, count: 29 },
    { id: 'tablets', name: 'Tablets', icon: Tablet, count: 18 },
    { id: 'watches', name: 'Smart Watches', icon: Watch, count: 24 }
  ]

  // Sample electronics products
  const electronicsProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones Premium',
      price: 89.99,
      originalPrice: 149.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 128,
      badge: 'Best Seller',
      category: 'Electronics',
      subcategory: 'Headphones',
      size: 'One Size',
      description: 'Premium wireless headphones with active noise cancellation'
    },
    {
      id: 2,
      name: 'Smartphone Pro Max 128GB',
      price: 699.99,
      originalPrice: 899.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 234,
      badge: 'New',
      category: 'Electronics',
      subcategory: 'Smartphones',
      size: '128GB',
      description: 'Latest flagship smartphone with advanced camera system'
    },
    {
      id: 3,
      name: 'Laptop Ultra 15" Intel Core i7',
      price: 1299.99,
      originalPrice: 1599.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 189,
      badge: 'Hot Deal',
      category: 'Electronics',
      subcategory: 'Laptops',
      size: '15"',
      description: 'High-performance laptop for professionals and creators'
    },
    {
      id: 4,
      name: 'Digital Camera 4K Mirrorless',
      price: 899.99,
      originalPrice: 1199.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 67,
      badge: 'Premium',
      category: 'Electronics',
      subcategory: 'Cameras',
      size: 'Body Only',
      description: 'Professional mirrorless camera with 4K video recording'
    },
    {
      id: 5,
      name: 'Smart Watch Series 7',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 156,
      badge: 'Popular',
      category: 'Electronics',
      subcategory: 'Smart Watches',
      size: '42mm',
      description: 'Advanced fitness and health tracking smartwatch'
    },
    {
      id: 6,
      name: 'Tablet Pro 11" WiFi',
      price: 549.99,
      originalPrice: 699.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 98,
      badge: 'Sale',
      category: 'Electronics',
      subcategory: 'Tablets',
      size: '11"',
      description: 'Powerful tablet for work and entertainment'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = electronicsProducts.filter(product => {
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
            Electronics
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Discover our wide range of electronics including smartphones, laptops, headphones, cameras, and more. Find the latest technology at competitive prices.
          </p>
        </div>

        {/* Search Section */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onQuickFilter={handleQuickFilter}
          quickFilters={[
            { label: 'All', value: 'electronics', color: 'bg-gray-100 text-gray-700' },
            { label: 'Smartphones', value: 'Mobile Phones', color: 'bg-blue-100 text-blue-700' },
            { label: 'Laptops', value: 'Laptops', color: 'bg-purple-100 text-purple-700' },
            { label: 'Headphones', value: 'Headphones', color: 'bg-green-100 text-green-700' },
            { label: 'Cameras', value: 'Cameras', color: 'bg-orange-100 text-orange-700' }
          ]}
          searchSuggestions={['smartphone', 'laptop', 'headphones', 'tablet', 'smart watch']}
          placeholder='Search for electronics, brands, or models...'
          categoryColor='blue'
          resultCount={filteredAndSortedProducts.length}
        />

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {electronicsCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-3 mx-auto'>
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
              categories={[{ id: 'electronics', name: 'Electronics', count: 206 }]}
              dealTypes={[]}
              selectedCategories ={selectedCategory}
              setSelectedCategories ={setSelectedCategory}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
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

export default ElectronicsPage
