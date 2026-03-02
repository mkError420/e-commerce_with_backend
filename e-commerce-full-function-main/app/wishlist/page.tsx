'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, X, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSlideCart } from '@/contexts/SlideCartContext'
import { productsData } from '@/constants/data'

interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  badge?: string
  category?: string
  description?: string
  addedDate: string
}

const WishlistPage = () => {
  const { addToCart } = useCart()
  const { openSlideCart } = useSlideCart()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist_items')
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist)
        setWishlistItems(parsedWishlist)
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlist_items', JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, isLoaded])

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId))
  }

  const addToCartFromWishlist = (product: WishlistItem) => {
    const productToAdd = {
      ...product,
      originalPrice: product.originalPrice || product.price,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      badge: product.badge || '',
      category: product.category || '',
      description: product.description || ''
    }
    addToCart(productToAdd, 'product')
    openSlideCart()
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  if (!isLoaded) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-shop_dark_green border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Wishlist</h1>
            <p className='text-gray-600'>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className='text-red-600 hover:text-red-700 font-medium transition-colors duration-200'
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty Wishlist */}
        {wishlistItems.length === 0 ? (
          <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
            <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Heart className='w-12 h-12 text-gray-400' />
            </div>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Your wishlist is empty</h2>
            <p className='text-gray-600 mb-8'>
              Start adding items to your wishlist to keep track of products you love
            </p>
            <Link
              href='/shop'
              className='inline-flex items-center bg-shop_btn_dark_green text-white px-8 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Items */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {wishlistItems.map((item) => (
              <div key={item.id} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group'>
                {/* Product Image */}
                <div className='relative overflow-hidden bg-gray-50 aspect-square'>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className='absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100'
                  >
                    <X className='w-4 h-4' />
                  </button>

                  {/* Badge */}
                  {item.badge && (
                    <div className='absolute top-4 left-4 z-10'>
                      <span className='bg-shop_orange text-white px-3 py-1 rounded-full text-xs font-semibold'>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {item.originalPrice && (
                    <div className='absolute bottom-4 right-4 z-10'>
                      <span className='bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}

                  <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                    <div className='text-gray-400 text-center'>
                      <div className='w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2'></div>
                      <p className='text-xs'>Product Image</p>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className='p-4'>
                  {/* Category */}
                  <div className='text-xs text-shop_dark_green font-semibold mb-2 uppercase tracking-wide'>
                    {item.category}
                  </div>

                  {/* Product Name */}
                  <h3 className='text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-300'>
                    <Link href={`/product/${item.id}`}>
                      {item.name}
                    </Link>
                  </h3>

                  {/* Rating */}
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            item.rating && i < Math.floor(item.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-xs text-gray-600'>
                      ({item.reviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='text-lg font-bold text-shop_dark_green'>
                      ৳{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className='text-sm text-gray-400 line-through'>
                        ৳{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => addToCartFromWishlist(item)}
                      className='flex-1 bg-shop_btn_dark_green text-white py-2 rounded-lg font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect flex items-center justify-center gap-1 text-sm'
                    >
                      <ShoppingCart className='w-4 h-4' />
                      Add to Cart
                    </button>
                  </div>

                  {/* Added Date */}
                  <div className='text-xs text-gray-500 mt-3 text-center'>
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
