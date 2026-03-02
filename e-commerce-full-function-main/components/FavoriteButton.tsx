'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const FavoriteButton = () => {
  const [wishlistCount, setWishlistCount] = useState(0)

  // Load wishlist count from localStorage on component mount
  useEffect(() => {
    const updateWishlistCount = () => {
      const storedWishlist = localStorage.getItem('wishlist_items')
      if (storedWishlist) {
        try {
          const parsedWishlist = JSON.parse(storedWishlist)
          setWishlistCount(parsedWishlist.length)
        } catch (error) {
          console.error('Error loading wishlist count:', error)
          setWishlistCount(0)
        }
      } else {
        setWishlistCount(0)
      }
    }

    // Initial load
    updateWishlistCount()

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wishlist_items') {
        updateWishlistCount()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check periodically for local changes
    const interval = setInterval(updateWishlistCount, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <Link href="/wishlist" className='group relative'>
      <Heart className='w-5 h-5 hover:text-shop_light_green hoverEffect' />
      {wishlistCount > 0 && (
        <span className='absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center'>
          {wishlistCount > 99 ? '99+' : wishlistCount}
        </span>
      )}
    </Link>
  )
}

export default FavoriteButton
