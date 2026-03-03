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
      group bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100
      ${isUrgent ? 'border-red-400 shadow-red-100/50' : 'border-gray-100'}
      hover:border-shop_dark_green hover:bg-gradient-to-br hover:from-shop_light_green/5 hover:to-shop_dark_green/5 cursor-pointer
      h-full flex flex-col
    `}>
      {/* Header with Deal Type Badge */}
      <div className='relative'>
        {/* Deal Type Badge */}
        <div className='absolute top-3 left-3 z-10'>
          <span className={`
            ${dealBadge.color} text-white px-2 py-1 rounded-full text-xs font-bold
            flex items-center gap-1 shadow-sm
          `}>
            <span>{dealBadge.icon}</span>
            {dealBadge.text}
          </span>
        </div>

        {/* Urgency Badge */}
        {isUrgent && (
          <div className='absolute top-3 right-3 z-10'>
            <span className='bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1'>
              <Bolt className='w-3 h-3' />
              Ending Soon!
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className='relative overflow-hidden h-40 bg-gradient-to-br from-gray-50 to-gray-100'>
          {deal.image && deal.image !== '/api/placeholder/400/300' ? (
            <Image
              src={deal.image.startsWith('http') ? deal.image : `/images/${deal.image}`}
              alt={deal.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              onError={(e) => {
                // Fallback to sample product image if image fails to load
                const target = e.target as HTMLImageElement;
                const sampleImages = [
                  '/images/products/product_1.png',
                  '/images/products/product_2.jpg',
                  '/images/products/product_3.png',
                  '/images/products/product_4.png',
                  '/images/products/product_5.png'
                ];
                const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                target.src = randomImage;
              }}
              onLoadingComplete={(result) => {
                // If Next.js Image fails to load, use regular img as fallback
                if (!result.naturalWidth || result.naturalWidth === 0) {
                  const img = document.createElement('img');
                  img.src = result.src;
                  img.alt = deal.title;
                  img.className = 'w-full h-full object-cover';
                  img.onerror = () => {
                    // Final fallback to a working image
                    img.src = '/images/products/product_1.png';
                  };
                  const parent = result.currentSrc ? document.querySelector(`img[src="${result.currentSrc}"]`)?.parentElement : null;
                  if (parent) {
                    parent.replaceChild(img, parent.querySelector('img')!);
                  }
                }
              }}
            />
          ) : (
            // Use sample product image as default
            <img
              src="/images/products/product_1.png"
              alt={deal.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallbackImages = [
                  '/images/products/product_2.jpg',
                  '/images/products/product_3.png',
                  '/images/products/product_4.png',
                  '/images/products/product_5.png'
                ];
                target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
              }}
            />
          )}

          {/* Discount Overlay */}
          <div className='absolute top-3 right-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg px-2 py-1 text-center shadow-sm transform hover:scale-105 transition-transform duration-300'>
            <div className='text-lg font-bold'>-{deal.discount}%</div>
            <div className='text-xs font-medium'>OFF</div>
          </div>
        </div>
      </div>

      <div className='p-4 flex-1 flex flex-col'>
        {/* Title and Category */}
        <div className='mb-3'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs text-red-600 font-bold uppercase tracking-wider bg-red-50 px-2 py-1 rounded-full'>
              {deal.category}
            </span>
            <div className='flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
              <Star className='w-3 h-3 text-yellow-500 fill-current' />
              <span className='font-medium'>{deal.rating}</span>
            </div>
          </div>
          <h3 className='text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-300'>
            <Link href={`/deals/${deal.id}`} className='hover:text-shop_dark_green'>
              {deal.title}
            </Link>
          </h3>
          <p className='text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed'>
            {deal.description}
          </p>
        </div>

        {/* Features */}
        <div className='flex flex-wrap gap-1 mb-3'>
          {deal.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className='px-2 py-1 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 rounded text-xs font-medium border border-red-200'
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Stock Progress */}
        <div className='mb-3'>
          <div className='flex items-center justify-between text-xs mb-1'>
            <span className='text-gray-700 font-medium flex items-center gap-1'>
              <Package className='w-3 h-3 text-gray-500' />
              Stock
            </span>
            <span className={`
              font-bold text-xs px-2 py-1 rounded-full
              ${stockPercentage > 80 ? 'bg-red-100 text-red-600' : stockPercentage > 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
            `}>
              {deal.stock} left
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner'>
            <div
              className={`
                h-full transition-all duration-500 rounded-full
                ${stockPercentage > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : stockPercentage > 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-green-400 to-green-500'}
              `}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
          <div className='text-xs text-gray-500 mt-1 flex items-center justify-between'>
            <span>{deal.sold} sold</span>
            <span>{Math.round(stockPercentage)}% claimed</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className={`
          flex items-center justify-between p-2 rounded-lg mb-3
          ${timeLeft.expired 
            ? 'bg-gray-100 text-gray-600' 
            : isUrgent 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200' 
              : 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border border-orange-200'
          }
        `}>
          <div className='flex items-center gap-2'>
            <Clock className={`w-3 h-3 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`} />
            <span className='text-xs font-bold'>
              {timeLeft.expired ? 'Deal Ended' : timeLeft.text}
            </span>
          </div>
          {deal.freeShipping && (
            <div className='flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium'>
              <Truck className='w-3 h-3' />
              Free
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className='flex items-center justify-between gap-3 mt-auto'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-xl font-bold text-red-600'>
                ৳{deal.dealPrice}
              </span>
              <span className='text-sm text-gray-400 line-through'>
                ৳{deal.originalPrice}
              </span>
            </div>
            <div className='text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg inline-block'>
              Save ৳{((deal.originalPrice - deal.dealPrice).toFixed(2))}
            </div>
          </div>

          <div className='flex gap-2'>
            <button 
              onClick={handleGetDeal}
              disabled={isInCart(deal.id, 'deal')}
              className={`px-3 py-2 rounded-lg font-bold hover:shadow-md transition-all duration-300 text-xs flex items-center justify-center gap-1 group/btn transform hover:scale-105 ${
                isInCart(deal.id, 'deal')
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow'
              }`}
            >
              <ShoppingCart className='w-3 h-3 group-hover/btn:scale-110 transition-transform duration-300' />
              {isInCart(deal.id, 'deal') ? 'In Cart' : 'Get Deal'}
            </button>
            
            <Link
              href={`/deals/${deal.id}`}
              className='text-shop_dark_green font-bold hover:text-shop_light_green transition-colors duration-300 text-xs flex items-center gap-1 bg-shop_light_green/20 px-2 py-2 rounded-lg hover:bg-shop_light_green/30'
            >
              <ArrowRight className='w-3 h-3' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealCard
