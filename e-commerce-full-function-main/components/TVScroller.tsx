'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSlideCart } from '@/contexts/SlideCartContext'
import { productsData } from '@/constants/data'
import Link from 'next/link'

const TVScroller = () => {
  const { addToCart } = useCart()
  const { openSlideCart } = useSlideCart()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Get featured products for the scroller
  const scrollerProducts = productsData.slice(0, 12) // First 12 products
  // Duplicate products for seamless looping
  const duplicatedProducts = [...scrollerProducts, ...scrollerProducts]

  const handleAddToCart = (product: any) => {
    const productToAdd = {
      ...product,
      quantity: 1
    }
    addToCart(productToAdd, 'product')
    openSlideCart()
  }

  // Continuous scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollAmount = 0
    const scrollSpeed = 1 // pixels per frame
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth

    const scroll = () => {
      if (!isPaused) {
        scrollAmount += scrollSpeed
        
        // Reset to start when reaching the end for seamless loop
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0
        }
        
        scrollContainer.scrollLeft = scrollAmount
      }
      requestAnimationFrame(scroll)
    }

    // Start the continuous scroll
    const animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className='bg-gradient-to-r from-shop_light_bg to-white py-12 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          {/* Empty header - removed as requested */}
        </div>

        {/* Continuous Scrolling Carousel */}
        <div 
          className='relative overflow-hidden'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={scrollRef}
            className='flex gap-4 sm:gap-6 overflow-x-hidden scrollbar-hide'
            style={{ 
              scrollBehavior: 'auto',
              cursor: 'grab'
            }}
          >
            {duplicatedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className='flex-none w-[calc(33.333%-16px)] sm:w-[calc(25%-20px)] lg:w-[calc(20%-24px)]'
              >
                <Link href={`/product/${product.id}`} className='block h-full'>
                  <div className='flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity duration-300 bg-white rounded-xl p-3 shadow-sm hover:shadow-lg h-full min-h-[180px] sm:min-h-[200px] justify-center'>
                    {/* Product Image */}
                    <div className='relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 mb-2'>
                      <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center'>
                        <div className='text-gray-400 text-center'>
                          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded mx-auto mb-1'></div>
                          <p className='text-xs'>Product</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className='text-xs sm:text-sm font-bold text-gray-900 mb-2 line-clamp-2 text-center'>
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className='flex items-center justify-center gap-1 sm:gap-2'>
                      <span className='text-sm sm:text-base font-bold text-shop_dark_green'>
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className='text-xs sm:text-sm text-gray-400 line-through'>
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TVScroller
