'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Eye, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSlideCart } from '@/contexts/SlideCartContext'

interface Product {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  badge?: string
  category?: string
  description?: string
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const { addToCart } = useCart()
  const { openSlideCart } = useSlideCart()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const discountPercentage = Math.round(((product.originalPrice || product.price) - product.price) / (product.originalPrice || product.price) * 100)
  
  // Handle both number and string IDs
  const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id
  console.log('ProductCard rendering for product:', product.name, 'ID:', productId, 'Type:', typeof product.id) // Debug log
  
  const handleAddToCart = () => {
    console.log('Add to Cart button clicked for product:', product.name, 'ID:', productId) // Debug log
    console.log('Product object:', product) // Debug log
    const productToAdd = {
      ...product,
      id: productId,
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

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    
    // Get current wishlist from localStorage
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]')
    
    if (!isInWishlist) {
      // Add to wishlist
      const wishlistItem = {
        ...product,
        id: productId,
        addedDate: new Date().toISOString()
      }
      const updatedWishlist = [...currentWishlist, wishlistItem]
      localStorage.setItem('wishlist_items', JSON.stringify(updatedWishlist))
      console.log('Added to wishlist:', product.name)
    } else {
      // Remove from wishlist
      const updatedWishlist = currentWishlist.filter((item: any) => item.id !== productId)
      localStorage.setItem('wishlist_items', JSON.stringify(updatedWishlist))
      console.log('Removed from wishlist:', product.name)
    }
  }

  const handleQuickView = () => {
    setShowQuickView(true)
    console.log('Quick view for product:', product.name)
  }

  const closeQuickView = () => {
    setShowQuickView(false)
  }

  // Check if product is already in wishlist on component mount
  useEffect(() => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]')
    const isInWishlist = currentWishlist.some((item: any) => item.id === productId)
    setIsInWishlist(isInWishlist)
  }, [productId])

  if (viewMode === 'list') {
    return (
      <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden'>
        <div className='flex flex-col md:flex-row'>
          {/* Image */}
          <div className='relative md:w-1/3 lg:w-1/4'>
            <div className='relative overflow-hidden bg-gray-50 h-48 md:h-full'>
              {/* Badge */}
              {product.badge && (
                <div className='absolute top-4 left-4 z-10'>
                  <span className='bg-shop_orange text-white px-3 py-1 rounded-full text-xs font-semibold'>
                    {product.badge}
                  </span>
                </div>
              )}
              
              {/* Discount Badge */}
              <div className='absolute top-4 right-4 z-10'>
                <span className='bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                  -{discountPercentage}%
                </span>
              </div>

              {/* Action Buttons - Desktop (Hover) */}
              <div className='absolute top-4 right-4 z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='flex flex-col gap-2'>
                  <button 
                    onClick={handleWishlistToggle}
                    className={`bg-white p-2 rounded-full shadow-md hover:bg-shop_light_pink hoverEffect transition-colors duration-300 ${
                      isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={handleQuickView}
                    className='bg-white p-2 rounded-full shadow-md hover:bg-shop_light_pink hoverEffect'
                  >
                    <Eye className='w-4 h-4 text-gray-600 hover:text-shop_dark_green' />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Mobile (Always Visible) */}
              <div className='absolute bottom-4 left-4 z-10 md:hidden flex gap-2'>
                <button 
                  onClick={handleWishlistToggle}
                  className={`bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-shop_light_pink hoverEffect transition-colors duration-300 ${
                    isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleQuickView}
                  className='bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-shop_light_pink hoverEffect'
                >
                  <Eye className='w-5 h-5 text-gray-600 hover:text-shop_dark_green' />
                </button>
              </div>

              {/* Placeholder Image */}
              <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                <div className='text-gray-400 text-center'>
                  <div className='w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2'></div>
                  <p className='text-xs'>Product Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 p-6'>
            <div className='flex flex-col h-full justify-between'>
              <div>
                {/* Category */}
                <div className='text-xs text-shop_dark_green font-semibold mb-2 uppercase tracking-wide'>
                  {product.category}
                </div>

                {/* Product Name */}
                <h3 className='text-lg font-semibold text-gray-900 mb-2 hover:text-shop_dark_green transition-colors duration-300'>
                  <Link href={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>

                {/* Description */}
                {product.description && (
                  <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          product.rating && i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {product.rating || 0} ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Price and Actions */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl font-bold text-shop_dark_green'>
                    ৳{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className='text-lg text-gray-400 line-through'>
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>

                <button 
  onClick={handleAddToCart}
  className='bg-shop_btn_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect flex items-center gap-2'
>
  <ShoppingCart className='w-5 h-5' />
  Add to Cart
</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Grid View */}
      <div className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col'>
      {/* Product Image Container */}
      <div className='relative overflow-hidden bg-gray-50 flex-shrink-0'>
        {/* Badge */}
        {product.badge && (
          <div className='absolute top-4 left-4 z-10'>
            <span className='bg-shop_orange text-white px-3 py-1 rounded-full text-xs font-semibold'>
              {product.badge}
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        <div className='absolute top-4 right-4 z-10'>
          <span className='bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
            -{discountPercentage}%
          </span>
        </div>

        {/* Action Buttons - Desktop (Hover) */}
        <div className='absolute top-4 right-4 z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='flex flex-col gap-2'>
            <button 
              onClick={handleWishlistToggle}
              className={`bg-white p-2 rounded-full shadow-md hover:bg-shop_light_pink hoverEffect transition-colors duration-300 ${
                isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleQuickView}
              className='bg-white p-2 rounded-full shadow-md hover:bg-shop_light_pink hoverEffect'
            >
              <Eye className='w-4 h-4 text-gray-600 hover:text-shop_dark_green' />
            </button>
          </div>
        </div>

        {/* Action Buttons - Mobile (Always Visible) */}
        <div className='absolute bottom-4 left-4 z-10 md:hidden flex gap-2'>
          <button 
            onClick={handleWishlistToggle}
            className={`bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-shop_light_pink hoverEffect transition-colors duration-300 ${
              isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className='bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-shop_light_pink hoverEffect'
          >
            <Eye className='w-5 h-5 text-gray-600 hover:text-shop_dark_green' />
          </button>
        </div>

        {/* Placeholder Image */}
        <div className='w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
          <div className='text-gray-400 text-center'>
            <div className='w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-2'></div>
            <p className='text-sm'>Product Image</p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className='p-6 flex-1 flex flex-col'>
        {/* Category */}
        <div className='text-xs text-shop_dark_green font-semibold mb-2 uppercase tracking-wide'>
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-300'>
          <Link href={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className='flex items-center gap-2 mb-3'>
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  product.rating && i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className='text-sm text-gray-600'>
            {product.rating || 0} ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className='flex items-center gap-3 mb-4'>
          <span className='text-xl font-bold text-shop_dark_green'>
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <span className='text-lg text-gray-400 line-through'>
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className='mt-auto pt-4'>
          <button 
            onClick={handleAddToCart}
            className='w-full bg-shop_btn_dark_green text-white py-2 rounded-lg font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect flex items-center justify-center gap-2 group/btn text-sm'
          >
            <ShoppingCart className='w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300' />
            Add to Cart
          </button>
        </div>
      </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h2 className='text-2xl font-semibold text-gray-900'>Quick View</h2>
              <button 
                onClick={closeQuickView}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
              >
                <X className='w-6 h-6 text-gray-600' />
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6'>
              <div className='grid md:grid-cols-2 gap-8'>
                {/* Product Image */}
                <div className='relative'>
                  <div className='w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center'>
                    <div className='text-gray-400 text-center'>
                      <div className='w-32 h-32 bg-gray-300 rounded-xl mx-auto mb-4'></div>
                      <p className='text-lg'>Product Image</p>
                    </div>
                  </div>
                  
                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className='absolute top-4 right-4 bg-red-500 text-white rounded-full px-4 py-2 text-center'>
                      <div className='text-2xl font-bold'>-{discountPercentage}%</div>
                      <div className='text-sm'>OFF</div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className='space-y-6'>
                  {/* Category */}
                  <div className='text-sm text-shop_dark_green font-semibold uppercase tracking-wide'>
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h1 className='text-3xl font-bold text-gray-900'>
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            product.rating && i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-gray-600'>
                      {product.rating || 0} ({product.reviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className='flex items-center gap-4'>
                    <span className='text-4xl font-bold text-shop_dark_green'>
                      ৳{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className='text-2xl text-gray-400 line-through'>
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Description</h3>
                      <p className='text-gray-600 leading-relaxed'>
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Badge */}
                  {product.badge && (
                    <div className='inline-block'>
                      <span className='bg-shop_orange text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex gap-4 pt-6'>
                    <button 
                      onClick={handleAddToCart}
                      className='flex-1 bg-shop_btn_dark_green text-white py-4 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect flex items-center justify-center gap-2'
                    >
                      <ShoppingCart className='w-6 h-6' />
                      Add to Cart
                    </button>
                    <button 
                      onClick={handleWishlistToggle}
                      className={`px-6 py-4 rounded-xl font-semibold hover:shadow-lg hoverEffect flex items-center gap-2 transition-colors duration-300 ${
                        isInWishlist 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                      {isInWishlist ? 'Remove' : 'Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard
