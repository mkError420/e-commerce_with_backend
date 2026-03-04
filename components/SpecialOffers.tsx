"use client"

import { useState, useEffect } from 'react'
import { Clock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import DealCard from './DealCard'
import { api } from '@/lib/api-client'

const SpecialOffers = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [visibleDeals, setVisibleDeals] = useState(6)
  const [endingSoonCount, setEndingSoonCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [hotDeals, setHotDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const deals = await api.deals.list()
        setHotDeals(deals)
      } catch (error) {
        console.error('Error fetching deals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

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
    if (isClient && hotDeals.length > 0) {
      const count = hotDeals.filter((deal: any) => {
        const timeLeft = new Date(deal.endTime).getTime() - currentTime.getTime()
        return timeLeft > 0 && timeLeft < 2 * 60 * 60 * 1000 // Less than 2 hours
      }).length
      setEndingSoonCount(count)
    }
  }, [currentTime, isClient, hotDeals])

  // Filter deals based on selected filter
  const filteredDeals = hotDeals.filter((deal: any) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'lightning') return deal.dealType === 'lightning'
    if (selectedFilter === 'daily') return deal.dealType === 'daily'
    return true
  })

  // Sort deals by urgency (ending soon first)
  const sortedDeals = [...filteredDeals].sort((a: any, b: any) => {
    const timeLeftA = new Date(a.endTime).getTime() - Date.now()
    const timeLeftB = new Date(b.endTime).getTime() - Date.now()
    return timeLeftA - timeLeftB
  })

  // Get deals to display
  const displayedDeals = sortedDeals.slice(0, visibleDeals)

  // Calculate stats
  const totalDeals = hotDeals.length
  const lightningDeals = hotDeals.filter((deal: any) => deal.dealType === 'lightning').length
  const dailyDeals = hotDeals.filter((deal: any) => deal.dealType === 'daily').length
  const avgDiscount = hotDeals.length > 0 ? Math.round(hotDeals.reduce((acc: number, deal: any) => acc + deal.discount, 0) / hotDeals.length) : 0

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

        {/* Deals Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
            {[...Array(6)].map((_, index) => (
              <div key={index} className='bg-white rounded-2xl shadow-lg p-6 animate-pulse'>
                <div className='h-48 bg-gray-200 rounded-xl mb-4'></div>
                <div className='h-6 bg-gray-200 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded mb-4'></div>
                <div className='flex justify-between items-center'>
                  <div className='h-8 bg-gray-200 rounded w-20'></div>
                  <div className='h-8 bg-gray-200 rounded w-24'></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedDeals.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
            {displayedDeals.map((deal: any) => (
              <DealCard key={deal.id} deal={deal} currentTime={currentTime} />
            ))}
          </div>
        ) : (
          <div className='text-center py-12 mb-12'>
            <p className='text-xl text-gray-600'>No deals available at the moment.</p>
            <p className='text-gray-500 mt-2'>Check back later for amazing offers!</p>
          </div>
        )}

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
