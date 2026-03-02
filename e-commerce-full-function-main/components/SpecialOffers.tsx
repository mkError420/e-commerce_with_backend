"use client"

import { useState, useEffect } from 'react'
import { Clock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import DealCard from './DealCard'

// Sample hot deals data - in a real app, this would come from an API
const hotDeals = [
  {
    id: 1,
    title: 'Lightning Deal: Premium Wireless Headphones',
    originalPrice: 199.99,
    dealPrice: 89.99,
    discount: 55,
    image: '/images/products/product_1.png',
    category: 'Electronics',
    dealType: 'lightning' as const,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    stock: 15,
    sold: 85,
    rating: 4.5,
    reviews: 128,
    description: 'Premium noise-cancelling wireless headphones with superior sound quality',
    features: ['Noise Cancelling', '30hr Battery', 'Premium Sound'],
    freeShipping: true
  },
  {
    id: 2,
    title: 'Daily Deal: Smart Watch Pro',
    originalPrice: 349.99,
    dealPrice: 199.99,
    discount: 43,
    image: '/images/products/product_2.png',
    category: 'Electronics',
    dealType: 'daily' as const,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    stock: 8,
    sold: 42,
    rating: 4.8,
    reviews: 89,
    description: 'Advanced fitness tracking and health monitoring smartwatch',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant'],
    freeShipping: true
  },
  {
    id: 3,
    title: 'Lightning Deal: Gaming Mechanical Keyboard',
    originalPrice: 189.99,
    dealPrice: 99.99,
    discount: 47,
    image: '/images/products/product_5.png',
    category: 'Gaming',
    dealType: 'lightning' as const,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    stock: 12,
    sold: 38,
    rating: 4.6,
    reviews: 167,
    description: 'RGB mechanical gaming keyboard with customizable lighting',
    features: ['Mechanical Switches', 'RGB Lighting', 'Programmable Keys'],
    freeShipping: true
  },
  {
    id: 4,
    title: 'Daily Deal: Organic Skincare Set',
    originalPrice: 119.99,
    dealPrice: 59.99,
    discount: 50,
    image: '/images/products/product_4.png',
    category: 'Beauty',
    dealType: 'daily' as const,
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours from now
    stock: 25,
    sold: 75,
    rating: 4.9,
    reviews: 203,
    description: 'Complete organic skincare routine for radiant skin',
    features: ['Organic Ingredients', 'Cruelty Free', 'All Skin Types'],
    freeShipping: true
  },
  {
    id: 5,
    title: 'Lightning Deal: Professional Camera Lens',
    originalPrice: 899.99,
    dealPrice: 449.99,
    discount: 50,
    image: '/images/products/product_6.png',
    category: 'Photography',
    dealType: 'lightning' as const,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    stock: 3,
    sold: 17,
    rating: 4.8,
    reviews: 94,
    description: 'Professional 50mm camera lens for photography enthusiasts',
    features: ['50mm Focal Length', 'Wide Aperture', 'Sharp Images'],
    freeShipping: false
  },
  {
    id: 6,
    title: 'Daily Deal: Stainless Steel Water Bottle',
    originalPrice: 49.99,
    dealPrice: 19.99,
    discount: 60,
    image: '/images/products/product_9.png',
    category: 'Sports',
    dealType: 'daily' as const,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    stock: 50,
    sold: 150,
    rating: 4.3,
    reviews: 67,
    description: 'Insulated water bottle that keeps drinks cold for 24 hours',
    features: ['24hr Cold', 'BPA Free', 'Leak Proof'],
    freeShipping: true
  }
]

const SpecialOffers = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [visibleDeals, setVisibleDeals] = useState(6)
  const [endingSoonCount, setEndingSoonCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Update current time every second for countdown timers
  useEffect(() => {
    setIsClient(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update ending soon count on client side only
  useEffect(() => {
    if (isClient) {
      const count = hotDeals.filter(deal => {
        const timeLeft = new Date(deal.endTime).getTime() - currentTime.getTime()
        return timeLeft > 0 && timeLeft < 2 * 60 * 60 * 1000 // Less than 2 hours
      }).length
      setEndingSoonCount(count)
    }
  }, [currentTime, isClient])

  // Filter deals based on selected filter
  const filteredDeals = hotDeals.filter(deal => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'lightning') return deal.dealType === 'lightning'
    if (selectedFilter === 'daily') return deal.dealType === 'daily'
    return true
  })

  // Sort deals by urgency (ending soon first)
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    const timeLeftA = new Date(a.endTime).getTime() - Date.now()
    const timeLeftB = new Date(b.endTime).getTime() - Date.now()
    return timeLeftA - timeLeftB
  })

  // Get deals to display
  const displayedDeals = sortedDeals.slice(0, visibleDeals)

  // Calculate stats
  const totalDeals = hotDeals.length
  const lightningDeals = hotDeals.filter(deal => deal.dealType === 'lightning').length
  const dailyDeals = hotDeals.filter(deal => deal.dealType === 'daily').length
  const avgDiscount = Math.round(hotDeals.reduce((acc, deal) => acc + deal.discount, 0) / hotDeals.length)

  return (
    <section className='py-16 bg-shop_light_bg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Large Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Hot <span className='text-shop_orange'>Deals & Offers</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Amazing limited-time deals with huge savings on your favorite products!
          </p>
        </div>

        {/* Large Stats Bar */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100'>
            <div className='text-4xl font-bold text-shop_dark_green mb-2'>{totalDeals}</div>
            <div className='text-lg text-gray-600'>Active Deals</div>
          </div>
          <div className='bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100'>
            <div className='text-4xl font-bold text-shop_orange mb-2'>{avgDiscount}%</div>
            <div className='text-lg text-gray-600'>Average Discount</div>
          </div>
          <div className='bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100'>
            <div className='text-4xl font-bold text-red-600 mb-2'>{isClient ? endingSoonCount : 0}</div>
            <div className='text-lg text-gray-600'>Ending Soon</div>
          </div>
          <div className='bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100'>
            <div className='text-4xl font-bold text-purple-600 mb-2'>{lightningDeals}</div>
            <div className='text-lg text-gray-600'>Lightning Deals</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className='flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12'>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto ${
              selectedFilter === 'all'
                ? 'bg-shop_dark_green text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            All Deals ({totalDeals})
          </button>
          <button
            onClick={() => setSelectedFilter('lightning')}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto ${
              selectedFilter === 'lightning'
                ? 'bg-purple-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            <Zap className='w-4 h-4 sm:w-5 sm:h-5' />
            Lightning ({lightningDeals})
          </button>
          <button
            onClick={() => setSelectedFilter('daily')}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto ${
              selectedFilter === 'daily'
                ? 'bg-blue-600 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            <Clock className='w-4 h-4 sm:w-5 sm:h-5' />
            Daily ({dailyDeals})
          </button>
        </div>

        {/* Large View All Button */}
        <div className='text-center'>
          <Link
            href='/deals'
            className='inline-flex items-center gap-3 bg-shop_dark_green text-white px-12 py-4 rounded-2xl text-lg font-bold hover:bg-shop_dark_green/90 hover:shadow-xl hoverEffect transform hover:scale-105 transition-all duration-300'
          >
            View All Hot Deals
            <ArrowRight className='w-6 h-6' />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SpecialOffers
