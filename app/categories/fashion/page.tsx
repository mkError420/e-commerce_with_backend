'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import CategorySearch from '@/components/CategorySearch';
import { Shirt, ShoppingBag, Watch, Package } from 'lucide-react';

const FashionPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['fashion'])
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

  // Fashion subcategories
  const fashionCategories = [
    { id: 'mens', name: "Men's Clothing", icon: Shirt, count: 89 },
    { id: 'womens', name: "Women's Clothing", icon: ShoppingBag, count: 112 },
    { id: 'accessories', name: 'Accessories', icon: Watch, count: 67 },
    { id: 'shoes', name: 'Shoes', icon: Package, count: 45 }
  ]

  // Sample fashion products
  const fashionProducts = [
    {
      id: 7,
      name: 'Classic Cotton T-Shirt',
      price: 24.99,
      originalPrice: 39.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 89,
      badge: 'Popular',
      category: 'Fashion',
      subcategory: "Men's Clothing",
      size: 'L',
      description: 'Comfortable cotton t-shirt perfect for everyday wear'
    },
    {
      id: 8,
      name: 'Designer Handbag Premium',
      price: 149.99,
      originalPrice: 249.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 156,
      badge: 'Luxury',
      category: 'Fashion',
      subcategory: 'Accessories',
      size: 'One Size',
      description: 'Elegant designer handbag made from premium leather'
    },
    {
      id: 9,
      name: 'Running Shoes Pro',
      price: 89.99,
      originalPrice: 129.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 234,
      badge: 'Best Seller',
      category: 'Fashion',
      subcategory: 'Shoes',
      size: '10',
      description: 'Professional running shoes with advanced cushioning'
    },
    {
      id: 10,
      name: 'Summer Dress Floral',
      price: 59.99,
      originalPrice: 89.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 178,
      badge: 'New',
      category: 'Fashion',
      subcategory: "Women's Clothing",
      size: 'M',
      description: 'Beautiful floral dress perfect for summer occasions'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = fashionProducts.filter(product => {
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
            Fashion
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Discover the latest fashion trends with our curated collection of clothing, accessories, and shoes. Find your perfect style with quality products at great prices.
          </p>
        </div>

        {/* Search Section */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onQuickFilter={handleQuickFilter}
          quickFilters={[
            { label: 'All', value: 'fashion', color: 'bg-gray-100 text-gray-700' },
            { label: 'Men', value: "Men's Clothing", color: 'bg-blue-100 text-blue-700' },
            { label: 'Women', value: "Women's Clothing", color: 'bg-pink-100 text-pink-700' },
            { label: 'Accessories', value: 'Accessories', color: 'bg-purple-100 text-purple-700' },
            { label: 'Shoes', value: 'Shoes', color: 'bg-green-100 text-green-700' }
          ]}
          searchSuggestions={['cotton t-shirt', 'designer handbag', 'summer dress', 'casual shoes', 'fashion accessories']}
          placeholder='Search for products, brands, or styles...'
          categoryColor='pink'
          resultCount={filteredAndSortedProducts.length}
        />

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {fashionCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-pink-100 text-pink-600 mb-3 mx-auto'>
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
              categories={[{ id: 'fashion', name: 'Fashion', count: 313 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
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
                  className='bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors'
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

export default FashionPage
