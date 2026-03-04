'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { api } from '@/lib/api-client'

const ProductTicker = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const scrollSpeed = 1.5
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.list()
        const allProducts = Array.isArray(response) ? response : []
        
        if (allProducts.length === 0) {
          console.warn('No products available from API')
          setProducts([])
          return
        }
        
        const sortedProducts = allProducts.sort((a: any, b: any) => {
          const idA = Number(a.id) || 0
          const idB = Number(b.id) || 0
          return idB - idA
        })
        
        setProducts(sortedProducts.slice(0, 8))
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!tickerRef.current || loading) return

    const tickerContainer = tickerRef.current
    let scrollPosition = 0
    let isAnimating = true

    const animate = (timestamp: number) => {
      if (!isPaused && isAnimating && tickerContainer) {
        scrollPosition += scrollSpeed
        
        const maxScroll = tickerContainer.scrollWidth - tickerContainer.clientWidth
        const oneSetWidth = maxScroll / 2
        
        if (scrollPosition >= oneSetWidth) {
          scrollPosition = 0
          tickerContainer.scrollLeft = 0
        } else {
          tickerContainer.scrollLeft = scrollPosition
        }
      }
      
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start the animation immediately
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [loading, isPaused, scrollSpeed, products.length])

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const TickerProductCard = ({ product }: { product: any }) => {
    const imageUrl = product.image || null
    
    return (
      <Link href={`/product/${product.id}`}>
        <div className='flex-none w-56 h-64 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:shadow-lg flex flex-col'>
          {/* Product Image - Fixed height */}
          <div className='w-full h-32 bg-gray-100 rounded-md overflow-hidden mb-3 flex-shrink-0'>
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-400 text-xs'>No Image</span>
              </div>
            )}
          </div>

          {/* Product Name - Fixed height */}
          <h4 className='text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight h-8 flex-shrink-0'>
            {product.name}
          </h4>

          {/* Rating - Fixed height */}
          <div className='flex items-center mb-2 h-5 flex-shrink-0'>
            {product.rating ? (
              <>
                <div className='flex text-yellow-400'>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.floor(Number(product.rating)) ? 'fill-current' : 'fill-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className='text-xs text-gray-600 ml-1'>
                  {Number(product.rating).toFixed(1)} ({product.reviews || 0})
                </span>
              </>
            ) : (
              <div className="h-5" />
            )}
          </div>

          {/* Price - Fixed height */}
          <div className='flex items-center justify-between h-6 flex-shrink-0 mt-auto'>
            <span className='text-lg font-bold text-shop_dark_green'>
              ${Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className='text-xs text-gray-500 line-through'>
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  const tickerProducts = [...products, ...products]

  if (loading) {
    return (
      <section className='py-6 bg-gradient-to-r from-shop_dark_green/5 to-shop_orange/5 border-y border-shop_dark_green/10'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
          <div className='mb-4' />
          <div className='flex gap-4 overflow-x-auto'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='flex-none w-56'>
                <div className='bg-gray-200 rounded-lg h-32 animate-pulse' />
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
        <div className='mb-4' />
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
                className='flex-none w-56'
              >
                <TickerProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductTicker
