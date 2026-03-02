'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { Coffee, Utensils, Microwave, Package, ChefHat } from 'lucide-react';

const KitchenPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['kitchen'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Kitchen subcategories
  const kitchenCategories = [
    { id: 'cookware', name: 'Cookware', icon: Utensils, count: 234 },
    { id: 'small-appliances', name: 'Small Appliances', icon: Package, count: 189 },
    { id: 'dining', name: 'Dining', icon: Coffee, count: 156 },
    { id: 'bakery', name: 'Bakery', icon: ChefHat, count: 145 },
    { id: 'storage', name: 'Storage', icon: Package, count: 123 },
    { id: 'microwaves', name: 'Microwaves', icon: Microwave, count: 98 }
  ]

  // Sample kitchen products
  const kitchenProducts = [
    {
      id: 1,
      name: 'Premium Non-Stick Cookware Set',
      price: 149.99,
      originalPrice: 199.99,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 234,
      badge: 'Premium',
      category: 'Kitchen & Dining',
      subcategory: 'Cookware',
      size: '10 Pieces',
      description: 'Premium non-stick cookware set with durable coating'
    },
    {
      id: 2,
      name: 'Professional Blender High-Speed',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 189,
      badge: 'Professional',
      category: 'Kitchen & Dining',
      subcategory: 'Small Appliances',
      size: '1500W',
      description: 'High-speed professional blender for smoothies and more'
    },
    {
      id: 3,
      name: 'Ceramic Dinner Set Service for 6',
      price: 79.99,
      originalPrice: 99.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 156,
      badge: 'Elegant',
      category: 'Kitchen & Dining',
      subcategory: 'Dining',
      size: '24 Pieces',
      description: 'Elegant ceramic dinner set for 6 people'
    },
    {
      id: 4,
      name: 'Stand Mixer Professional 6Qt',
      price: 299.99,
      originalPrice: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 98,
      badge: 'Professional',
      category: 'Kitchen & Dining',
      subcategory: 'Small Appliances',
      size: '6 Qt',
      description: 'Professional stand mixer for baking enthusiasts'
    },
    {
      id: 5,
      name: 'Food Storage Containers Set',
      price: 34.99,
      originalPrice: 44.99,
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 145,
      badge: 'Organized',
      category: 'Kitchen & Dining',
      subcategory: 'Storage',
      size: '20 Pieces',
      description: 'Complete food storage container set with lids'
    },
    {
      id: 6,
      name: 'Microwave Oven 1.1 Cu Ft',
      price: 129.99,
      originalPrice: 169.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 67,
      badge: 'Efficient',
      category: 'Kitchen & Dining',
      subcategory: 'Microwaves',
      size: '1.1 Cu Ft',
      description: 'Efficient microwave oven with smart features'
    }
  ]

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = kitchenProducts.filter(product => {
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
            Kitchen & Dining
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl'>
            Complete your kitchen with quality cookware, small appliances, dining sets, and storage solutions. Everything you need for cooking, baking, and entertaining.
          </p>
        </div>

        {/* Subcategories */}
        <div className='mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {kitchenCategories.map((subcat) => {
              const Icon = subcat.icon
              return (
                <div key={subcat.id} className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 text-orange-600 mb-3 mx-auto'>
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
              categories={[{ id: 'kitchen', name: 'Kitchen & Dining', count: 945 }]}
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
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
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
                  className='bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors'
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

export default KitchenPage
