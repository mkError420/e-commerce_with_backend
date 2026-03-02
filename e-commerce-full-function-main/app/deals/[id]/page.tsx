'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RefreshCw,
  Minus,
  Plus,
  Check,
  Clock,
  Bolt,
  Tag,
  Package
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSlideCart } from '@/contexts/SlideCartContext'

// Function to automatically extend deal end time by 2 days if expired
const getAutoRenewedEndTime = (originalEndTime: string): string => {
  const endTime = new Date(originalEndTime)
  const now = new Date()
  
  // If deal has expired, extend it by 2 days from now
  if (endTime <= now) {
    const newEndTime = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000)) // Add 2 days
    return newEndTime.toISOString()
  }
  
  return originalEndTime
}

// Sample deals data - in a real app, this would come from an API
const dealsData = [
  {
    id: 2,
    title: 'Lightning Deal: Smart Watch Pro',
    originalPrice: 349.99,
    dealPrice: 199.99,
    discount: 43,
    image: '/api/placeholder/400/300',
    category: 'Electronics',
    dealType: 'lightning',
    endTime: getAutoRenewedEndTime('2024-01-18T15:30:00'),
    stock: 8,
    sold: 42,
    rating: 4.8,
    reviews: 89,
    description: 'Advanced fitness tracking and health monitoring smartwatch with GPS, heart rate monitor, and water resistance. Perfect for athletes and fitness enthusiasts.',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking', '7-day Battery Life'],
    freeShipping: true
  },
  {
    id: 4,
    title: 'Daily Deal: Organic Skincare Set',
    originalPrice: 119.99,
    dealPrice: 59.99,
    discount: 50,
    image: '/api/placeholder/400/300',
    category: 'Beauty',
    dealType: 'daily',
    endTime: getAutoRenewedEndTime('2024-01-19T23:59:59'),
    stock: 25,
    sold: 75,
    rating: 4.9,
    reviews: 203,
    description: 'Complete organic skincare routine for radiant skin. Includes cleanser, toner, serum, and moisturizer made from natural ingredients.',
    features: ['Organic Ingredients', 'Cruelty Free', 'All Skin Types', 'Dermatologist Tested'],
    freeShipping: true
  },
  {
    id: 9,
    title: 'Daily Deal: Stainless Steel Water Bottle',
    originalPrice: 49.99,
    dealPrice: 19.99,
    discount: 60,
    image: '/api/placeholder/400/300',
    category: 'Sports',
    dealType: 'daily',
    endTime: getAutoRenewedEndTime('2024-01-19T23:59:59'),
    stock: 50,
    sold: 150,
    rating: 4.3,
    reviews: 67,
    description: 'Insulated water bottle that keeps drinks cold for 24 hours and hot for 12 hours. Made from premium stainless steel with leak-proof design.',
    features: ['24hr Cold', 'BPA Free', 'Leak Proof', '500ml Capacity'],
    freeShipping: true
  }
]

const DealDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { openSlideCart } = useSlideCart()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second for countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Find deal by ID
  const deal = dealsData.find(d => d.id === parseInt(params.id as string))

  if (!deal) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Deal Not Found</h2>
          <p className='text-gray-600 mb-8'>The deal you're looking for doesn't exist or has expired.</p>
          <Link 
            href='/deals'
            className='inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all duration-300'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back to Deals
          </Link>
        </div>
      </div>
    )
  }

  const getTimeLeft = (endTime: string, currentTime: Date) => {
    const renewedEndTime = getAutoRenewedEndTime(endTime)
    const end = new Date(renewedEndTime).getTime()
    const now = currentTime.getTime()
    const difference = end - now

    if (difference <= 0) {
      return { expired: true, text: 'Expired' }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    if (days > 0) {
      return { expired: false, text: `${days}d ${hours}h ${minutes}m` }
    } else if (hours > 0) {
      return { expired: false, text: `${hours}h ${minutes}m ${seconds}s` }
    } else if (minutes > 0) {
      return { expired: false, text: `${minutes}m ${seconds}s` }
    } else {
      return { expired: false, text: `${seconds}s` }
    }
  }

  const timeLeft = getTimeLeft(deal.endTime, currentTime)
  const stockPercentage = (deal.sold / (deal.sold + deal.stock)) * 100
  const isUrgent = !timeLeft.expired && (
    deal.dealType === 'lightning' ||
    stockPercentage > 80 ||
    (new Date(deal.endTime).getTime() - currentTime.getTime() < 2 * 60 * 60 * 1000)
  )

  const handleAddToCart = () => {
    const dealToAdd = {
      ...deal,
      quantity: quantity
    }
    addToCart(dealToAdd, 'deal')
    openSlideCart()
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= deal.stock) {
      setQuantity(newQuantity)
    }
  }

  const getDealTypeBadge = () => {
    switch (deal.dealType) {
      case 'lightning':
        return { color: 'bg-purple-500', text: 'Lightning', icon: '🌩' }
      case 'daily':
        return { color: 'bg-blue-500', text: 'Daily Deal', icon: '📅' }
      default:
        return { color: 'bg-red-500', text: 'Hot Deal', icon: '🔥' }
    }
  }

  const dealBadge = getDealTypeBadge()

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-500 mb-8'>
          <Link href='/' className='hover:text-gray-900'>Home</Link>
          <span>/</span>
          <Link href='/deals' className='hover:text-gray-900'>Deals</Link>
          <span>/</span>
          <span className='text-gray-900'>{deal.title}</span>
        </nav>

        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Deal Images */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div className='relative overflow-hidden rounded-xl bg-gray-100 aspect-square'>
              {dealBadge && (
                <div className='absolute top-4 left-4 z-10'>
                  <span className={`${dealBadge.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    <span>{dealBadge.icon}</span>
                    {dealBadge.text}
                  </span>
                </div>
              )}
              
              {isUrgent && (
                <div className='absolute top-4 right-4 z-10'>
                  <span className='bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse'>
                    Ending Soon!
                  </span>
                </div>
              )}

              <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                <div className='text-gray-400 text-center'>
                  <div className='w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4'></div>
                  <p className='text-sm'>Deal Image</p>
                </div>
              </div>

              {/* Discount Overlay */}
              <div className='absolute top-4 right-4 bg-red-600 text-white rounded-lg px-3 py-2 text-center'>
                <div className='text-2xl font-bold'>-{deal.discount}%</div>
                <div className='text-xs'>OFF</div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className='grid grid-cols-4 gap-2'>
              {[...Array(4)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg bg-gray-100 aspect-square border-2 transition-all duration-200 ${
                    selectedImage === index ? 'border-red-600' : 'border-gray-200'
                  }`}
                >
                  <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                    <div className='w-12 h-12 bg-gray-300 rounded'></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deal Info */}
          <div className='space-y-6'>
            {/* Header */}
            <div>
              <div className='text-sm text-red-600 font-semibold mb-2 uppercase tracking-wide'>
                {deal.category}
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>{deal.title}</h1>
              
              {/* Rating */}
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        deal.rating && i < Math.floor(deal.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-sm text-gray-600'>
                  {deal.rating} ({deal.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className='flex items-center gap-4'>
              <span className='text-3xl font-bold text-red-600'>
                ৳{deal.dealPrice}
              </span>
              <span className='text-xl text-gray-400 line-through'>
                ৳{deal.originalPrice}
              </span>
              <span className='text-lg text-green-600 font-semibold'>
                You save ৳{(deal.originalPrice - deal.dealPrice).toFixed(2)}
              </span>
            </div>

            {/* Countdown Timer */}
            <div className={`
              flex items-center justify-between p-4 rounded-lg
              ${timeLeft.expired 
                ? 'bg-gray-100 text-gray-600' 
                : isUrgent 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-orange-100 text-orange-700'
              }
            `}>
              <div className='flex items-center gap-2'>
                <Clock className='w-5 h-5' />
                <span className='font-semibold'>
                  {timeLeft.expired ? 'Deal Ended' : `Ends in: ${timeLeft.text}`}
                </span>
              </div>
              {deal.freeShipping && (
                <div className='flex items-center gap-1 text-sm'>
                  <Truck className='w-4 h-4' />
                  <span>Free Shipping</span>
                </div>
              )}
            </div>

            {/* Stock Progress */}
            <div>
              <div className='flex items-center justify-between text-sm mb-2'>
                <span className='text-gray-600 font-medium'>Stock Progress</span>
                <span className={`
                  font-semibold
                  ${stockPercentage > 80 ? 'text-red-600' : stockPercentage > 50 ? 'text-yellow-600' : 'text-green-600'}
                `}>
                  {deal.stock} left
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                <div
                  className={`
                    h-full transition-all duration-300
                    ${stockPercentage > 80 ? 'bg-red-500' : stockPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}
                  `}
                  style={{ width: `${stockPercentage}%` }}
                ></div>
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                {deal.sold} sold
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Description</h3>
              <p className='text-gray-600 leading-relaxed'>
                {deal.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>Features</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {deal.features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-2 text-sm text-gray-600'>
                    <Check className='w-4 h-4 text-green-500' />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <label className='text-sm font-medium text-gray-700'>Quantity:</label>
                <div className='flex items-center border border-gray-300 rounded-lg'>
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='px-4 py-2 font-medium'>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
                <span className='text-xs text-gray-500'>
                  Max: {deal.stock} available
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={timeLeft.expired || deal.stock === 0}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAddedToCart
                    ? 'bg-green-500 text-white'
                    : timeLeft.expired || deal.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check className='w-5 h-5' />
                    Added to Cart!
                  </>
                ) : timeLeft.expired ? (
                  'Deal Expired'
                ) : deal.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className='w-5 h-5' />
                    Get This Deal
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className='space-y-3 pt-6 border-t border-gray-200'>
              <div className='flex items-center gap-3'>
                <Truck className='w-5 h-5 text-red-600' />
                <span className='text-sm text-gray-600'>Free shipping on this deal</span>
              </div>
              <div className='flex items-center gap-3'>
                <Shield className='w-5 h-5 text-red-600' />
                <span className='text-sm text-gray-600'>30-day return policy</span>
              </div>
              <div className='flex items-center gap-3'>
                <RefreshCw className='w-5 h-5 text-red-600' />
                <span className='text-sm text-gray-600'>1 year warranty included</span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-6 border-t border-gray-200'>
              <button className='flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
                <Heart className='w-5 h-5' />
                Add to Wishlist
              </button>
              <Link
                href='/deals'
                className='flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
              >
                <ArrowLeft className='w-5 h-5' />
                Back to Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealDetailPage
