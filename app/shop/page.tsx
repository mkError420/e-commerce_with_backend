'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Container from '@/components/Container';
import ShopHeader from '@/components/ShopHeader';
import FilterSidebar from '@/components/FilterSidebar';
import CategoriesSidebar from '@/components/CategoriesSidebar';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { useCategories } from '@/hooks/useCategories';
import { api } from '@/lib/api-client';

const ShopPage = () => {
  const { categories, loading: categoriesLoading } = useCategories()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [products, setProducts] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState<any[]>([])
  const [bannersLoading, setBannersLoading] = useState(true)
  
  // Debug: Log categories data
  console.log('Categories data:', categories)
  console.log('Categories loading:', categoriesLoading)
  
  // Fallback categories if API fails
  const fallbackCategories = [
    {
      id: 'electronics',
      title: 'Electronics',
      slug: 'electronics',
      href: 'electronics',
      subcategories: [
        {
          id: 'smartphones-accessories',
          title: 'Smartphones & Accessories',
          slug: 'smartphones-accessories',
          href: 'smartphones-accessories'
        },
        {
          id: 'laptops-computers',
          title: 'Laptops & Computers',
          slug: 'laptops-computers',
          href: 'laptops-computers'
        }
      ]
    },
    {
      id: 'fashion',
      title: 'Fashion',
      slug: 'fashion',
      href: 'fashion',
      subcategories: [
        {
          id: 'mens-clothing',
          title: "Men's Clothing",
          slug: 'mens-clothing',
          href: 'mens-clothing'
        },
        {
          id: 'womens-clothing',
          title: "Women's Clothing",
          slug: 'womens-clothing',
          href: 'womens-clothing'
        }
      ]
    }
  ]
  
  // Use API categories from dashboard first, fallback only if completely empty
  const categoriesToUse = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories;
    }
    console.warn('No categories from API, using fallback categories');
    return fallbackCategories;
  }, [categories]);
  
  // Debug: Log source of categories
  console.log('Using categories from:', categories && categories.length > 0 ? 'Dashboard (API)' : 'Hardcoded fallback')
  console.log('Categories count:', categoriesToUse.length)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['all'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Transform categories for FilterSidebar with proper subcategory structure and real counts
  const transformedCategories = useMemo(() => {
    return categoriesToUse.map(cat => {
      // Count products for main category and its subcategories
      const mainCategoryProducts = products.filter(product => 
        product.category?.toLowerCase() === cat.title.toLowerCase()
      ).length
      
      const subcategoriesWithCounts = cat.subcategories?.map(sub => {
        const subCategoryProducts = products.filter(product => 
          product.category?.toLowerCase() === sub.title.toLowerCase()
        ).length
        return {
          id: sub.slug, // Use slug as ID for consistency
          name: sub.title,
          count: subCategoryProducts
        }
      }) || []
      
      // Total count includes main category products + all subcategory products
      const totalCount = mainCategoryProducts + subcategoriesWithCounts.reduce((sum, sub) => sum + sub.count, 0)
      
      return {
        id: cat.slug, // Use slug as ID for consistency
        name: cat.title,
        count: totalCount,
        subcategories: subcategoriesWithCounts
      }
    })
  }, [categoriesToUse, products])

  const dealTypes = [
    { name: 'Lightning Deal', slug: 'lightning', icon: '' },
    { name: 'Daily Deal', slug: 'daily', icon: '' }
  ]

  // Fetch products from API with fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.list()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to hardcoded products if API fails
        setProducts([
          {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            originalPrice: 149.99,
            image: '/images/products/product_1.png',
            rating: 4.5,
            reviews: 128,
            badge: 'Best Seller',
            category: 'Electronics',
            description: 'Premium wireless headphones with noise cancellation'
          },
          {
            id: 2,
            name: 'Smart Watch Pro',
            price: 199.99,
            originalPrice: 299.99,
            image: '/images/products/product_2.png',
            rating: 4.8,
            reviews: 89,
            badge: 'New',
            category: 'Electronics',
            description: 'Advanced smartwatch with health tracking features'
          }
        ])
      }
    }
    fetchProducts()
  }, [])

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await api.banners.list()
        setBanners(data)
        console.log('Banners fetched:', data)
      } catch (error) {
        console.error('Error fetching banners:', error)
        // Fallback to category-based banners if API fails
        if (categoriesToUse.length > 0) {
          const fallbackBanners = categoriesToUse.slice(0, 4).map((category, index) => ({
            id: category.id,
            title: `${category.title} Collection`,
            subtitle: `Explore our ${category.title.toLowerCase()} products`,
            description: `Discover amazing deals on ${category.title.toLowerCase()} products`,
            image: '/api/placeholder/1920/600',
            category: category.slug,
            backgroundColor: index === 0 ? 'from-shop_dark_green' : index === 1 ? 'from-blue-600' : index === 2 ? 'from-purple-600' : 'from-orange-600',
            gradient: index === 0 ? 'to-shop_light_green' : index === 1 ? 'to-blue-500' : index === 2 ? 'to-pink-500' : 'to-orange-500'
          }))
          setBanners(fallbackBanners)
        }
      } finally {
        setBannersLoading(false)
      }
    }
    fetchBanners()
  }, [categoriesToUse])

  // Add refresh function for manual banner refresh
  const refreshBanners = async () => {
    setBannersLoading(true)
    try {
      const data = await api.banners.list()
      setBanners(data)
      console.log('Banners refreshed:', data)
    } catch (error) {
      console.error('Error refreshing banners:', error)
    } finally {
      setBannersLoading(false)
    }
  }

  // Hero carousel data (using banners from Admin Dashboard)
  const heroSlides = useMemo(() => {
    console.log('Current banners data:', banners)
    console.log('Categories to use:', categoriesToUse)
    
    // Use banners if available, otherwise fallback to categories
    if (banners.length > 0) {
      const activeBanners = banners.filter(banner => banner.isActive).slice(0, 4)
      console.log('Active banners:', activeBanners)
      return activeBanners
    }
    
    // Fallback to categories if no banners
    const fallbackBanners = categoriesToUse.slice(0, 4).map((category, index) => ({
      id: category.id,
      title: `${category.title} Collection`,
      subtitle: `Explore our ${category.title.toLowerCase()} products`,
      description: `Discover amazing deals on ${category.title.toLowerCase()} products`,
      image: '/api/placeholder/1920/600',
      category: category.slug,
      backgroundColor: index === 0 ? 'from-shop_dark_green' : index === 1 ? 'from-blue-600' : index === 2 ? 'from-purple-600' : 'from-orange-600',
      gradient: index === 0 ? 'to-shop_light_green' : index === 1 ? 'to-blue-500' : index === 2 ? 'to-pink-500' : 'to-orange-500'
    }))
    console.log('Fallback banners:', fallbackBanners)
    return fallbackBanners
  }, [banners, categoriesToUse])

  // Auto-sliding functionality
  useEffect(() => {
    if (heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 3000) // Change slide every 3 seconds

      return () => clearInterval(interval)
    }
  }, [heroSlides])

  // Banner carousel navigation
  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    console.log('=== FILTERING DEBUG ===')
    console.log('Selected categories:', selectedCategory)
    console.log('Available products:', products.map(p => ({ name: p.name, category: p.category })))
    console.log('Transformed categories:', transformedCategories)
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Enhanced category filtering to handle both main categories and subcategories
      let matchesCategory = selectedCategory.includes('all')
      if (!matchesCategory) {
        matchesCategory = selectedCategory.some(selectedCatId => {
          console.log('Checking category ID:', selectedCatId)
          // Find the selected category by ID in our transformed categories
          const selectedMainCat = transformedCategories.find(cat => cat.id === selectedCatId)
          console.log('Found main category:', selectedMainCat)
          if (selectedMainCat) {
            // Check if product matches main category name OR any subcategory name
            const mainMatch = product.category?.toLowerCase() === selectedMainCat.name.toLowerCase()
            const subMatch = selectedMainCat.subcategories?.some(sub => 
              product.category?.toLowerCase() === sub.name.toLowerCase()
            )
            console.log('Main category match:', mainMatch, 'subcategory match:', subMatch, 'product category:', product.category, 'main category name:', selectedMainCat.name)
            return mainMatch || subMatch
          }
          
          // Also check if the selected category is a subcategory
          const selectedSubCat = transformedCategories.flatMap(cat => cat.subcategories || [])
            .find(sub => sub.id === selectedCatId)
          console.log('Found subcategory:', selectedSubCat)
          if (selectedSubCat) {
            const subMatch = product.category?.toLowerCase() === selectedSubCat.name.toLowerCase()
            console.log('Direct subcategory match:', subMatch, 'product category:', product.category, 'subcategory name:', selectedSubCat.name)
            return subMatch
          }
          
          return false
        })
      }
      
      const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max
      const matchesRatings = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating || 0))
      const matchesSizes = selectedSizes.length === 0 || selectedSizes.includes(product.size || '')
      
      const finalMatch = matchesSearch && matchesCategory && matchesPriceRange && matchesRatings && matchesSizes
      console.log('Product final match result:', finalMatch, 'for product:', product.name)
      return finalMatch
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
  }, [products, selectedCategory, searchTerm, sortBy, priceRange, selectedRatings, selectedSizes])

  // Pagination
  const totalProducts = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Carousel */}
      <div className="relative overflow-hidden">
        {/* Refresh Button */}
        <button
          onClick={refreshBanners}
          className="absolute top-4 right-4 z-10 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white/90 transition-all duration-200"
          title="Refresh Banners"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 15.357m15.356 2A8.001 8.001 0 014.582 15.357m15.356 2A8.001 8.001 0 004.582 15.357m15.356 2A8.001 8.001 0 004.582 15.357" />
          </svg>
        </button>
        
        <div className="flex transition-transform duration-500 ease-in-out">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`w-full flex-shrink-0 transition-all duration-500 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-96 bg-cover bg-center" style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundColor: '#f3f4f6' // Add fallback background color
              }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.backgroundColor}/90 ${slide.gradient}/80 flex items-center justify-center px-8`}>
                  <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-lg mb-4">{slide.subtitle}</p>
                    <p className="text-base">{slide.description}</p>
                    <button
                      onClick={() => {
                        setSelectedCategory([slide.category])
                        setCurrentPage(1)
                      }}
                      className="mt-6 bg-white text-shop_dark_green px-8 py-3 rounded-lg hover:bg-shop_light_green transition-colors duration-200 font-medium"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <button
          onClick={goToPreviousSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-shop_dark_green/80 text-white p-2 rounded-full shadow-lg hover:bg-shop_dark_green transition-all duration-200 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7" />
          </svg>
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-shop_dark_green/80 text-white p-2 rounded-full shadow-lg hover:bg-shop_dark_green transition-all duration-200 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <CategoriesSidebar
              categories={categoriesToUse}
              selectedCategories={selectedCategory}
              onCategorySelect={(categoryId: string) => {
                setSelectedCategory([categoryId])
                setCurrentPage(1)
              }}
              products={products}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Products Section with Filters */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2"></h2>
                  
                </div>
                
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-shop_dark_green text-white px-4 py-2 rounded-lg hover:bg-shop_light_green transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
              
              {/* Mobile Filter Sidebar */}
              {showFilters && (
                <div className="lg:hidden mb-6">
                  <FilterSidebar
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    categories={transformedCategories}
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
                </div>
              )}

              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between mb-6">
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
              </div>

              {/* Mobile Search */}
              <div className="lg:hidden mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Products Grid */}
              {filteredAndSortedProducts.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="bg-shop_dark_green text-white px-6 py-2 rounded-lg hover:bg-shop_light_green transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalProducts}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </main>
        </div>
      </Container>
    </div>
  )
}

export default ShopPage
