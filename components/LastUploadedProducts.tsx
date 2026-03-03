'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { productsData } from '@/constants/data'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { api } from '@/lib/api-client'

const LastUploadedProducts = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false) // Start with auto-scroll enabled
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const scrollSpeed = 2 // pixels per frame - increased for better visibility
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.list() as any
        const allProducts = Array.isArray(response) ? response : productsData
        
        // Sort by ID (assuming higher IDs are more recent) and take last 10
        const sortedProducts = allProducts.sort((a: any, b: any) => {
          const idA = Number(a.id) || 0
          const idB = Number(b.id) || 0
          return idB - idA // Descending order (newest first)
        })
        
        setProducts(sortedProducts.slice(0, 10))
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts(productsData.slice(0, 10))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  // Infinite scroll animation - completely independent of page scroll
  useEffect(() => {
    if (!scrollContainerRef.current || loading) return

    const scrollContainer = scrollContainerRef.current
    let scrollPosition = 0
    let isAnimating = true
    let lastTimestamp = 0

    const animate = (timestamp: number) => {
      // Ensure consistent animation speed regardless of page scroll
      if (!lastTimestamp) lastTimestamp = timestamp
      const deltaTime = timestamp - lastTimestamp
      
      // Only update if enough time has passed (for consistent 60fps)
      if (deltaTime >= 16) { // ~60fps
        if (!isPaused && isAnimating && scrollContainer) {
          scrollPosition += scrollSpeed
          
          // Get the total scrollable width
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
          
          // Calculate the width of one set of products (original products + view all card)
          const oneSetWidth = maxScroll / 3 // Since we have 3 sets of products
          
          // Reset to start when we reach the end of the first set for infinite loop
          if (scrollPosition >= oneSetWidth) {
            scrollPosition = 0
            // Instantly reset to start without visible jump
            scrollContainer.scrollLeft = 0
          } else {
            scrollContainer.scrollLeft = scrollPosition
          }
        }
        lastTimestamp = timestamp
      }
      
      // Continue the animation loop regardless of page scroll
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation immediately and keep it running
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [loading, isPaused, scrollSpeed, products.length])

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Duplicate products array for infinite scroll effect
  const infiniteProducts = [...products, ...products, ...products]

  if (loading) {
    return (
      <section className='py-8 sm:py-12 md:py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
          <div className='flex justify-between items-center mb-6 sm:mb-8 md:mb-10'>
            <div>
              <div className='h-8 sm:h-10 bg-gray-200 rounded w-48 mb-3'></div>
              <div className='h-4 sm:h-5 bg-gray-200 rounded w-64'></div>
            </div>
          </div>
          <div className='flex gap-4 sm:gap-6 overflow-x-auto'>
            {[...Array(6)].map((_, index) => (
              <div key={index} className='flex-none w-72 sm:w-80 md:w-96'>
                <div className='bg-gray-200 rounded-xl h-96 animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-8 sm:py-12 md:py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex justify-between items-center mb-6 sm:mb-8 md:mb-10'>
          <div>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3'>
              Latest <span className='text-shop_dark_green'>Arrivals</span>
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl'>
              Fresh drops just landed! Check out our newest additions
            </p>
          </div>
          
          {/* Control Buttons */}
          <div className='flex items-center gap-2'>
            <button
              onClick={togglePause}
              className='p-2 rounded-full bg-shop_dark_green text-white hover:bg-shop_orange transition-colors duration-200 shadow-sm'
              aria-label={isPaused ? 'Play auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? <Play className='w-4 h-4' /> : <Pause className='w-4 h-4' />}
            </button>
            <div className='hidden md:flex gap-2'>
              <button
                onClick={() => handleManualScroll('left')}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm'
                aria-label='Scroll left'
              >
                <ChevronLeft className='w-5 h-5 text-gray-700' />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm'
                aria-label='Scroll right'
              >
                <ChevronRight className='w-5 h-5 text-gray-700' />
              </button>
            </div>
          </div>
        </div>

        {/* Infinite Scroll Container */}
        <div className='relative group'>
          {/* Gradient Overlays */}
          <div className='absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <div className='absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          
          {/* Products Infinite Scroll */}
          <div 
            ref={scrollContainerRef}
            className='flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4'
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {infiniteProducts.map((product: any, index: number) => (
              <div 
                key={`${product.id}-${index}`} 
                className='flex-none w-72 sm:w-80 md:w-96'
                style={{ minWidth: '280px' }}
              >
                <ProductCard product={product} viewMode="grid" />
              </div>
            ))}
            
            {/* View All Card - also duplicated for infinite effect */}
            <div className='flex-none w-72 sm:w-80 md:w-96'>
              <Link 
                href='/shop'
                className='h-full flex flex-col items-center justify-center bg-gradient-to-br from-shop_light_pink to-shop_light_pink/50 rounded-xl border-2 border-dashed border-shop_dark_green/30 hover:border-shop_dark_green hover:shadow-lg transition-all duration-300 group min-h-[400px]'
              >
                <div className='text-center p-6'>
                  <div className='w-16 h-16 bg-shop_dark_green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-shop_dark_green/20 transition-colors'>
                    <svg className='w-8 h-8 text-shop_dark_green' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>View All Products</h3>
                  <p className='text-sm text-gray-600 mb-4'>Explore our complete collection</p>
                  <span className='inline-flex items-center gap-2 bg-shop_dark_green text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-shop_orange transition-colors'>
                    Shop Now
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className='md:hidden flex justify-center items-center gap-4 mt-6'>
          <button
            onClick={() => handleManualScroll('left')}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
            aria-label='Scroll left'
          >
            <ChevronLeft className='w-4 h-4 text-gray-700' />
          </button>
          <button
            onClick={togglePause}
            className='p-2 rounded-full bg-shop_dark_green text-white hover:bg-shop_orange transition-colors duration-200'
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className='w-4 h-4' /> : <Pause className='w-4 h-4' />}
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
            aria-label='Scroll right'
          >
            <ChevronRight className='w-4 h-4 text-gray-700' />
          </button>
        </div>

        {/* Status Indicator */}
        <div className='text-center mt-4'>
          <p className='text-xs text-gray-500 flex items-center justify-center gap-2'>
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></span>
            {isPaused ? 'Auto-scroll paused' : 'Auto-scrolling'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LastUploadedProducts
