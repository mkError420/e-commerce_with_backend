import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ShoppingCart, Heart, Star, Bolt, Tag, Package, Truck, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface Deal {
  id: number
  title: string
  originalPrice: number
  dealPrice: number
  discount: number
  image: string
  category: string
  dealType: 'lightning' | 'daily'
  endTime: string
  stock: number
  sold: number
  rating: number
  reviews: number
  description: string
  features: string[]
  freeShipping: boolean
}

interface DealCardProps {
  deal: Deal
  currentTime: Date
}

const DealCard = ({ deal, currentTime }: DealCardProps) => {
  const { addToCart, isInCart } = useCart()
  const handleGetDeal = () => {
    addToCart(deal, 'deal')
  }

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
    (new Date(deal.endTime).getTime() - currentTime.getTime() < 2 * 60 * 60 * 1000) // Less than 2 hours
  )

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
    <div className={`
      group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2
      ${isUrgent ? 'border-red-400 animate-pulse shadow-red-200/50' : 'border-gray-100'}
      transform hover:-translate-y-1
    `}>
      {/* Header with Deal Type Badge */}
      <div className='relative'>
        {/* Deal Type Badge */}
        <div className='absolute top-4 left-4 z-10'>
          <span className={`
            ${dealBadge.color} text-white px-3 py-1.5 rounded-full text-xs font-bold
            flex items-center gap-1 shadow-lg backdrop-blur-sm
          `}>
            <span>{dealBadge.icon}</span>
            {dealBadge.text}
          </span>
        </div>

        {/* Urgency Badge */}
        {isUrgent && (
          <div className='absolute top-4 right-4 z-10'>
            <span className='bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse shadow-lg flex items-center gap-1'>
              <Bolt className='w-3 h-3' />
              Ending Soon!
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className='relative overflow-hidden h-44 sm:h-52 bg-gradient-to-br from-gray-50 to-gray-100'>
          <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
            <div className='text-gray-400 text-center'>
              <div className='w-20 h-20 bg-gray-300 rounded-xl mx-auto mb-3 shadow-inner'></div>
              <p className='text-sm font-medium'>Deal Image</p>
            </div>
          </div>

          {/* Discount Overlay */}
          <div className='absolute top-4 right-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl px-3 py-2 text-center shadow-xl transform hover:scale-105 transition-transform duration-300'>
            <div className='text-2xl font-bold'>-{deal.discount}%</div>
            <div className='text-xs font-medium'>OFF</div>
          </div>
        </div>
      </div>

      <div className='p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50/30'>
        {/* Title and Category */}
        <div className='mb-4'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-xs text-red-600 font-bold uppercase tracking-wider bg-red-50 px-2 py-1 rounded-full'>
              {deal.category}
            </span>
            <div className='flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
              <Star className='w-3 h-3 text-yellow-500 fill-current' />
              <span className='font-medium'>{deal.rating}</span>
            </div>
          </div>
          <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300'>
            <Link href={`/deals/${deal.id}`} className='hover:text-red-600'>
              {deal.title}
            </Link>
          </h3>
          <p className='text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed'>
            {deal.description}
          </p>
        </div>

        {/* Features */}
        <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-4'>
          {deal.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className='px-2 sm:px-3 py-1 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 rounded-lg text-xs font-medium border border-red-200'
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Stock Progress */}
        <div className='mb-4'>
          <div className='flex items-center justify-between text-sm mb-2'>
            <span className='text-gray-700 font-medium flex items-center gap-1'>
              <Package className='w-4 h-4 text-gray-500' />
              Stock Progress
            </span>
            <span className={`
              font-bold text-sm px-2 py-1 rounded-full
              ${stockPercentage > 80 ? 'bg-red-100 text-red-600' : stockPercentage > 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
            `}>
              {deal.stock} left
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner'>
            <div
              className={`
                h-full transition-all duration-500 rounded-full
                ${stockPercentage > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : stockPercentage > 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-green-400 to-green-500'}
              `}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
          <div className='text-xs text-gray-500 mt-2 flex items-center justify-between'>
            <span>{deal.sold} sold</span>
            <span>{Math.round(stockPercentage)}% claimed</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className={`
          flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl mb-4 gap-2 sm:gap-0
          ${timeLeft.expired 
            ? 'bg-gray-100 text-gray-600' 
            : isUrgent 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200' 
              : 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border border-orange-200'
          }
        `}>
          <div className='flex items-center gap-2'>
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`} />
            <span className='text-xs sm:text-sm font-bold'>
              {timeLeft.expired ? 'Deal Ended' : `Ends in: ${timeLeft.text}`}
            </span>
          </div>
          {deal.freeShipping && (
            <div className='flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium'>
              <Truck className='w-3 h-3' />
              Free Shipping
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <span className='text-2xl sm:text-3xl font-bold text-red-600 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent'>
                ৳{deal.dealPrice}
              </span>
              <span className='text-lg sm:text-xl text-gray-400 line-through'>
                ৳{deal.originalPrice}
              </span>
            </div>
            <div className='text-xs sm:text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg inline-block'>
              You save ৳{((deal.originalPrice - deal.dealPrice).toFixed(2))}
            </div>
          </div>

          <button 
            onClick={handleGetDeal}
            disabled={isInCart(deal.id, 'deal')}
            className={`w-full sm:w-auto lg:hidden xl:hidden px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold hover:shadow-xl hoverEffect flex items-center justify-center gap-2 group/btn transition-all duration-500 text-sm sm:text-sm transform hover:scale-105 ${
              isInCart(deal.id, 'deal')
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
            }`}
          >
            <ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300' />
            {isInCart(deal.id, 'deal') ? 'In Cart' : 'Get Deal'}
          </button>
        </div>

        {/* Additional Info */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 mt-4 gap-3 sm:gap-0'>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <div className='flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg'>
              <Package className='w-4 h-4 text-gray-500' />
              <span className='font-medium'>{deal.reviews} reviews</span>
            </div>
          </div>
          <Link
            href={`/deals/${deal.id}`}
            className='text-red-600 font-bold hover:text-red-700 transition-colors duration-300 text-xs sm:text-sm flex items-center gap-1 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100'
          >
            View Details 
            <ArrowRight className='w-3 h-3' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DealCard
