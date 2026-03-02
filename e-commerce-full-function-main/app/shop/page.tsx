'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container';
import ShopHeader from '@/components/ShopHeader';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

// Categories and deal types for filters
const categories = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    count: 206,
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', count: 85 },
      { id: 'laptops', name: 'Laptops', count: 45 },
      { id: 'tablets', name: 'Tablets', count: 32 },
      { id: 'accessories', name: 'Accessories', count: 44 }
    ]
  },
  { 
    id: 'fashion', 
    name: 'Fashion', 
    count: 313,
    subcategories: [
      { id: 'mens-clothing', name: "Men's Clothing", count: 120 },
      { id: 'womens-clothing', name: "Women's Clothing", count: 135 },
      { id: 'shoes', name: 'Shoes', count: 58 }
    ]
  },
  { 
    id: 'computers', 
    name: 'Computers', 
    count: 38,
    subcategories: [
      { id: 'desktops', name: 'Desktops', count: 15 },
      { id: 'monitors', name: 'Monitors', count: 12 },
      { id: 'components', name: 'Components', count: 11 }
    ]
  },
  { 
    id: 'home', 
    name: 'Home & Living', 
    count: 105,
    subcategories: [
      { id: 'furniture', name: 'Furniture', count: 45 },
      { id: 'decor', name: 'Home Decor', count: 35 },
      { id: 'kitchen', name: 'Kitchen', count: 25 }
    ]
  },
  { 
    id: 'books', 
    name: 'Books', 
    count: 67,
    subcategories: [
      { id: 'fiction', name: 'Fiction', count: 25 },
      { id: 'non-fiction', name: 'Non-Fiction', count: 22 },
      { id: 'educational', name: 'Educational', count: 20 }
    ]
  },
  { 
    id: 'health', 
    name: 'Health', 
    count: 63,
    subcategories: [
      { id: 'supplements', name: 'Supplements', count: 28 },
      { id: 'fitness', name: 'Fitness Equipment', count: 20 },
      { id: 'personal-care', name: 'Personal Care', count: 15 }
    ]
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    count: 45,
    subcategories: [
      { id: 'outdoor', name: 'Outdoor Sports', count: 20 },
      { id: 'indoor', name: 'Indoor Sports', count: 15 },
      { id: 'fitness', name: 'Fitness', count: 10 }
    ]
  },
  { 
    id: 'toys', 
    name: 'Toys & Games', 
    count: 78,
    subcategories: [
      { id: 'educational-toys', name: 'Educational Toys', count: 30 },
      { id: 'board-games', name: 'Board Games', count: 25 },
      { id: 'action-figures', name: 'Action Figures', count: 23 }
    ]
  },
  { 
    id: 'gaming', 
    name: 'Gaming', 
    count: 52,
    subcategories: [
      { id: 'consoles', name: 'Gaming Consoles', count: 18 },
      { id: 'video-games', name: 'Video Games', count: 22 },
      { id: 'accessories', name: 'Gaming Accessories', count: 12 }
    ]
  },
  { 
    id: 'photography', 
    name: 'Photography', 
    count: 29,
    subcategories: [
      { id: 'cameras', name: 'Cameras', count: 15 },
      { id: 'lenses', name: 'Lenses', count: 8 },
      { id: 'accessories', name: 'Photography Accessories', count: 6 }
    ]
  }
]

const dealTypes = [
  { name: 'Lightning Deal', slug: 'lightning', icon: '🌩' },
  { name: 'Daily Deal', slug: 'daily', icon: '📅' }
]

// Sample product data - in a real app, this would come from an API
const sampleProducts = [
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
    size: 'M',
    description: 'Premium wireless headphones with noise cancellation and superior sound quality.'
  },
  {
    id: 2,
    name: 'Smart Watch Pro Series 5',
    price: 199.99,
    originalPrice: 299.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 89,
    badge: 'New',
    category: 'Electronics',
    size: 'M',
    description: 'Advanced fitness tracking and health monitoring in a sleek design.'
  },
  {
    id: 3,
    name: 'Premium Leather Jacket Classic',
    price: 149.99,
    originalPrice: 249.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 56,
    badge: 'Limited',
    category: 'Fashion',
    size: 'L',
    description: 'Genuine leather jacket with timeless style and exceptional craftsmanship.'
  },
  {
    id: 4,
    name: 'Organic Skincare Set Complete',
    price: 59.99,
    originalPrice: 119.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 278,
    badge: 'Books',
    category: 'Beauty',
    size: 'S',
    description: 'Complete organic skincare routine for radiant skin.'
  },
  {
    id: 5,
    name: 'Yoga Mat Premium Non-Slip',
    price: 49.99,
    originalPrice: 79.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 89,
    badge: 'Sports',
    category: 'Sports',
    size: 'M',
    description: 'Extra thick yoga mat with superior grip and cushioning.'
  },
  {
    id: 6,
    name: 'Smart Home Security Camera',
    price: 159.99,
    originalPrice: 249.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 156,
    badge: 'Smart',
    category: 'Electronics',
    size: 'M',
    description: 'HD security camera with night vision and mobile app control.'
  },
  {
    id: 7,
    name: 'Kids Educational Building Blocks',
    price: 34.99,
    originalPrice: 54.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 234,
    badge: 'Toys',
    category: 'Toys',
    size: 'S',
    description: 'Creative building blocks that enhance problem-solving skills.'
  },
  {
    id: 8,
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    originalPrice: 39.99,
    image: '/api/placeholder/300/300',
    rating: 4.3,
    reviews: 67,
    badge: 'Eco',
    category: 'Sports',
    size: 'S',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours.'
  },
  {
    id: 9,
    name: 'Classic Literature Collection',
    price: 59.99,
    originalPrice: 99.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 278,
    badge: 'Books',
    category: 'Books',
    size: 'M',
    description: 'Collection of award-winning novels from various genres.'
  },
  {
    id: 10,
    name: 'Yoga Mat Premium Non-Slip',
    price: 49.99,
    originalPrice: 79.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 89,
    badge: 'Sports',
    category: 'Sports',
    size: 'M',
    description: 'Extra thick yoga mat with superior grip and cushioning.'
  },
  {
    id: 11,
    name: 'Smart Home Security Camera',
    price: 159.99,
    originalPrice: 249.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 156,
    badge: 'Smart',
    category: 'Electronics',
    size: 'M',
    description: 'HD security camera with night vision and mobile app control.'
  },
  {
    id: 12,
    name: 'Kids Educational Building Blocks',
    price: 34.99,
    originalPrice: 54.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 234,
    badge: 'Toys',
    category: 'Toys',
    size: 'S',
    description: 'Creative building blocks that enhance problem-solving skills.'
  }
]

// Hero carousel data
const heroSlides = [
  {
    id: 1,
    title: 'Summer Sale Collection',
    subtitle: 'Up to 50% off on selected items',
    description: 'Discover amazing deals on your favorite products this summer',
    image: '/api/placeholder/1920/600',
    ctaText: 'Shop Now',
    ctaLink: '/shop?category=fashion',
    backgroundColor: 'bg-gradient-to-r from-shop_dark_green to-shop_light_green'
  },
  {
    id: 2,
    title: 'Tech Innovation Week',
    subtitle: 'Latest gadgets and electronics',
    description: 'Explore cutting-edge technology with exclusive discounts',
    image: '/api/placeholder/1920/600',
    ctaText: 'Explore Tech',
    ctaLink: '/shop?category=electronics',
    backgroundColor: 'bg-gradient-to-r from-shop_orange to-shop_light_green'
  },
  {
    id: 3,
    title: 'Home Essentials',
    subtitle: 'Transform your living space',
    description: 'Premium home and living products at unbeatable prices',
    image: '/api/placeholder/1920/600',
    ctaText: 'Discover More',
    ctaLink: '/shop?category=home',
    backgroundColor: 'bg-gradient-to-r from-shop_dark_green to-shop_orange'
  },
  {
    id: 4,
    title: 'Sports & Fitness',
    subtitle: 'Gear up for your active lifestyle',
    description: 'Professional sports equipment and fitness accessories',
    image: '/api/placeholder/1920/600',
    ctaText: 'Get Active',
    ctaLink: '/shop?category=sports',
    backgroundColor: 'bg-gradient-to-r from-shop_light_green to-shop_orange'
  }
]

const ShopPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['all'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Manual carousel controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory.includes('all') || selectedCategory.some(cat => product.category.toLowerCase() === cat.toLowerCase())
      
      const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max
      
      const matchesRatings = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating))
      
      const matchesSizes = selectedSizes.length === 0 || selectedSizes.includes(product.size || '')
      
      return matchesSearch && matchesCategory && matchesPriceRange && matchesRatings && matchesSizes
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
        // featured - keep original order
        return filtered
    }
  }, [searchTerm, sortBy, selectedCategory, selectedRatings, selectedSizes, priceRange])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='min-h-screen bg-shop_light_bg'>
      {/* Hero Carousel Section */}
      <div className='relative h-80 sm:h-96 md:h-[500px] overflow-hidden'>
        {/* Carousel Slides */}
        <div className='relative h-full'>
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`h-full ${slide.backgroundColor}`}>
                <div className='container mx-auto px-4 sm:px-6 h-full flex items-center'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center h-full w-full'>
                    {/* Left Content - Hidden on Mobile */}
                    <div className='hidden md:block text-white space-y-3 sm:space-y-4 md:space-y-6 text-center md:text-left'>
                      <h1 className='text-2xl sm:text-3xl md:text-5xl font-bold leading-tight'>
                        {slide.title}
                      </h1>
                      <p className='text-base sm:text-lg md:text-xl font-medium opacity-90'>
                        {slide.subtitle}
                      </p>
                      <p className='text-xs sm:text-sm md:text-base opacity-80 max-w-xs sm:max-w-md md:max-w-lg'>
                        {slide.description}
                      </p>
                      <Link
                        href={slide.ctaLink}
                        className='inline-flex items-center bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg text-sm sm:text-base cursor-pointer'
                      >
                        {slide.ctaText}
                      </Link>
                    </div>

                    {/* Right Content - Image on All Screens */}
                    <div className='relative h-48 sm:h-56 md:h-80 lg:h-96 w-full'>
                      <div className='w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/20'>
                        <div className='w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center'>
                          <div className='text-white/80 text-center'>
                            <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-white/20 rounded-xl mx-auto mb-2 sm:mb-4'></div>
                            <p className='text-xs sm:text-sm md:text-base'>Hero Image</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile CTA Button - Centered Below Image */}
                    <div className='block md:hidden text-center mt-4'>
                      <Link
                        href={slide.ctaLink}
                        className='inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg cursor-pointer'
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-10'>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Shop Header */}
      <ShopHeader
        totalProducts={filteredAndSortedProducts.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <Container className='py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <aside className='lg:w-80 flex-shrink-0'>
            <FilterSidebar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              categories={categories}
              dealTypes={dealTypes}
              selectedCategories={selectedCategory}
              setSelectedCategories={setSelectedCategory}
              selectedDealType="all"
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
            {/* Products Grid/List */}
            {currentProducts.length > 0 ? (
              <>
                <div className={`
                  grid gap-6
                  ${viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                  }
                `}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredAndSortedProducts.length}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </>
            ) : (
              <div className='text-center py-16'>
                <div className='text-shop_dark_green text-6xl mb-4'>🔍</div>
                <h3 className='text-xl font-semibold text-shop_light_green mb-2'>
                  No products found
                </h3>
                <p className='text-shop_dark_green mb-6'>
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setCurrentPage(1)
                    setSelectedCategory(['all'])
                    setSelectedRatings([])
                    setSelectedSizes([])
                    setPriceRange({ min: 0, max: 1000 })
                    setSortBy('featured')
                  }}
                  className='bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  )
}

export default ShopPage;