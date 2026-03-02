'use client'

import React, { useState, useEffect } from 'react'
import { productsData } from '@/constants/data'
import Link from 'next/link'

const TickerScroll = () => {
  const [isPaused, setIsPaused] = useState(false)
  
  // Get products for ticker
  const tickerProducts = productsData.slice(0, 20) // First 20 products
  const duplicatedProducts = [...tickerProducts, ...tickerProducts] // Duplicate for seamless loop

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return

    const ticker = document.getElementById('ticker-scroll')
    if (!ticker) return

    const scrollContent = ticker.querySelector('.ticker-content') as HTMLElement
    if (!scrollContent) return

    let scrollPosition = 0
    let animationId: number

    const scroll = () => {
      if (!isPaused) {
        scrollPosition -= 1
        if (Math.abs(scrollPosition) >= scrollContent.scrollWidth / 2) {
          scrollPosition = 0
        }
        scrollContent.style.transform = `translateX(${scrollPosition}px)`
      }
      animationId = requestAnimationFrame(scroll)
    }

    scroll()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isPaused])

  return (
    <div className='bg-shop_btn_dark_green shadow-lg rounded-r-lg overflow-hidden'>
      <div 
        id='ticker-scroll'
        className='relative overflow-hidden'
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className='overflow-hidden h-8 sm:h-9 md:h-10 flex items-center pl-4 sm:pl-6 md:pl-8'>
          <div className='ticker-content flex items-center whitespace-nowrap'>
            {/* Duplicate products for seamless loop */}
            {duplicatedProducts.map((product, index) => (
              <span 
                key={`${product.id}-${index}`}
                className='inline-block px-3 sm:px-4 md:px-6 text-xs sm:text-sm text-white/90 hover:text-white transition-all duration-300 cursor-pointer'
              >
                <Link href={`/product/${product.id}`} className='flex items-center gap-2'>
                  {/* Product Image */}
                  <div className='w-4 h-4 bg-white/20 rounded flex items-center justify-center'>
                    <div className='w-2 h-2 bg-white/40 rounded'></div>
                  </div>
                  
                  {/* Product Info */}
                  <span className='font-medium'>
                    {product.name}
                  </span>
                  
                  <span className='text-xs bg-white/20 px-1 py-0.5 rounded-full font-bold'>
                    ৳{product.price}
                  </span>
                  
                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <span className='text-xs bg-red-500 text-white px-1 py-0.5 rounded-full font-bold'>
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice * 100))}%
                    </span>
                  )}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className='absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-white/80 text-xs'>
            ⏸ Paused
          </div>
        )}
      </div>
    </div>
  )
}

export default TickerScroll
