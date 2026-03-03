'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { productsData } from '@/constants/data'
import { Pause, Play } from 'lucide-react'
import { api } from '@/lib/api-client'

const ProductTicker = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const scrollSpeed = 1.5 // pixels per frame for smooth ticker
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.list() as any
        const allProducts = Array.isArray(response) ? response : productsData
        
        // Sort by ID (assuming higher IDs are more recent) and take last 8
        const sortedProducts = allProducts.sort((a: any, b: any) => {
          const idA = Number(a.id) || 0
          const idB = Number(b.id) || 0
          return idB - idA // Descending order (newest first)
        })
        
        setProducts(sortedProducts.slice(0, 8))
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts(productsData.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  // Ticker animation
  useEffect(() => {
    if (!tickerRef.current || loading) return

    const tickerContainer = tickerRef.current
    let scrollPosition = 0
    let isAnimating = true

    const animate = (timestamp: number) => {
      if (!isPaused && isAnimating && tickerContainer) {
        scrollPosition += scrollSpeed
        
        // Get the total scrollable width
        const maxScroll = tickerContainer.scrollWidth - tickerContainer.clientWidth
        
        // Calculate the width of one set of products
        const oneSetWidth = maxScroll / 2 // Since we have 2 sets for seamless loop
        
        // Reset to start when we reach the end of the first set for infinite loop
        if (scrollPosition >= oneSetWidth) {
          scrollPosition = 0
          tickerContainer.scrollLeft = 0
        } else {
          tickerContainer.scrollLeft = scrollPosition
        }
      }
      
      // Continue the animation loop
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation immediately
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [loading, isPaused, scrollSpeed, products.length])

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // Duplicate products array for seamless infinite scroll
  const tickerProducts = [...products, ...products]

  if (loading) {
    return (
      <section className='py-6 bg-gradient-to-r from-shop_dark_green/5 to-shop_orange/5 border-y border-shop_dark_green/10'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
          <div className='mb-4'>
            {/* Empty header for spacing */}
          </div>
          <div className='flex gap-4 overflow-x-auto'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='flex-none w-64'>
                <div className='bg-gray-200 rounded-lg h-48 animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-6 bg-gradient-to-r from-shop_dark_green/5 to-shop_orange/5 border-y border-shop_dark_green/10'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Ticker Header */}
        <div className='mb-4'>
          {/* Empty header for spacing */}
        </div>

        {/* Ticker Container */}
        <div 
          className='relative overflow-hidden'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={tickerRef}
            className='flex gap-4 overflow-x-auto scrollbar-hide'
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {tickerProducts.map((product: any, index: number) => (
              <div 
                key={`${product.id}-${index}`} 
                className='flex-none w-64'
              >
                <ProductCard product={product} viewMode="grid" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductTicker
