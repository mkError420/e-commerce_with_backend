'use client'

import React from 'react'
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Book, 
  Heart, 
  Gamepad2, 
  Camera,
  Package,
  ShoppingBag,
  Zap,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useCategories } from '@/hooks/useCategories'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  icon?: string
  subcategories?: Category[]
}

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  'electronics': Smartphone,
  'computers': Laptop,
  'fashion': Shirt,
  'home': Home,
  'books': Book,
  'health': Heart,
  'gaming': Gamepad2,
  'photography': Camera,
  'mobiles': Smartphone,
  'appliances': Home,
  'smartphones': Smartphone,
  'default': Package
}

// Color mapping for categories
const colorMap: { [key: string]: string } = {
  'electronics': 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  'computers': 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  'fashion': 'bg-pink-100 text-pink-600 hover:bg-pink-200',
  'home': 'bg-green-100 text-green-600 hover:bg-green-200',
  'books': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
  'health': 'bg-red-100 text-red-600 hover:bg-red-200',
  'gaming': 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
  'photography': 'bg-teal-100 text-teal-600 hover:bg-teal-200',
  'mobiles': 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  'appliances': 'bg-green-100 text-green-600 hover:bg-green-200',
  'smartphones': 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  'default': 'bg-gray-100 text-gray-600 hover:bg-gray-200'
}

const FeaturedCategories = () => {
  const { categories, loading, error } = useCategories()

  // Fallback categories if API fails - now 12 categories
  const fallbackCategories = [
    {
      id: '1',
      title: 'Electronics',
      slug: 'electronics',
      href: '/categories/electronics',
      icon: Smartphone,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      id: '2',
      title: 'Fashion',
      slug: 'fashion',
      href: '/categories/fashion',
      icon: Shirt,
      color: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
    },
    {
      id: '3',
      title: 'Home & Living',
      slug: 'home',
      href: '/categories/home',
      icon: Home,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      id: '4',
      title: 'Books',
      slug: 'books',
      href: '/categories/books',
      icon: Book,
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
    },
    {
      id: '5',
      title: 'Health & Beauty',
      slug: 'health',
      href: '/categories/health',
      icon: Heart,
      color: 'bg-red-100 text-red-600 hover:bg-red-200'
    },
    {
      id: '6',
      title: 'Gaming',
      slug: 'gaming',
      href: '/categories/gaming',
      icon: Gamepad2,
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    },
    {
      id: '7',
      title: 'Photography',
      slug: 'photography',
      href: '/categories/photography',
      icon: Camera,
      color: 'bg-teal-100 text-teal-600 hover:bg-teal-200'
    },
    {
      id: '8',
      title: 'Computers',
      slug: 'computers',
      href: '/categories/computers',
      icon: Laptop,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      id: '9',
      title: 'Mobile Phones',
      slug: 'mobiles',
      href: '/categories/mobiles',
      icon: Smartphone,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      id: '10',
      title: 'Appliances',
      slug: 'appliances',
      href: '/categories/appliances',
      icon: Home,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      id: '11',
      title: 'Smartphones',
      slug: 'smartphones',
      href: '/categories/smartphones',
      icon: Smartphone,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      id: '12',
      title: 'More',
      slug: 'more',
      href: '/categories',
      icon: ShoppingBag,
      color: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  ]

  const displayCategories = loading ? fallbackCategories : categories.slice(0, 12)

  const getCategoryIcon = (category: any) => {
    // If category has a custom icon (uploaded from Admin Dashboard), use it
    if (category.icon) {
      return null // Return null to render custom icon as img
    }
    
    // Otherwise, use the hardcoded icon mapping
    const slug = category.slug?.toLowerCase() || category.title?.toLowerCase()
    return iconMap[slug] || iconMap.default
  }

  const getCategoryColor = (category: any) => {
    const slug = category.slug?.toLowerCase() || category.title?.toLowerCase()
    return colorMap[slug] || colorMap.default
  }

  if (error) {
    console.error('Error loading categories:', error)
  }

  return (
    <section className='py-8 sm:py-12 md:py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-8 sm:mb-10 md:mb-12'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
            Shop by <span className='text-shop_dark_green'>Category</span>
          </h2>
          <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4'>
            Browse our wide selection of products across different categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6'>
          {displayCategories.map((category, index) => {
            const Icon = getCategoryIcon(category)
            const color = getCategoryColor(category)
            const href = `/categories/${category.slug || category.href}`
            
            return (
              <Link
                key={category.id || index}
                href={href}
                className='group'
              >
                <div className='bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 text-center shadow hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-shop_dark_green hover:bg-gradient-to-br hover:from-shop_light_green/5 hover:to-shop_dark_green/5 h-full flex flex-col justify-between min-h-[140px] sm:min-h-[160px] md:min-h-[180px] group cursor-pointer'>
                  <div className='flex-1 flex flex-col items-center justify-center'>
                    <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl ${color} mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon ? (
                        <img 
                          src={category.icon as string} 
                          alt={category.title}
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded object-cover"
                        />
                      ) : Icon ? (
                        <Icon className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7' />
                      ) : (
                        <Package className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7' />
                      )}
                    </div>
                    <h3 className='text-xs sm:text-sm md:text-base font-semibold text-gray-900 group-hover:text-shop_dark_green transition-all duration-300 line-clamp-2 text-center flex-1 flex items-center justify-center min-h-[2.5rem] sm:min-h-[3rem] group-hover:scale-105'>
                      {category.title}
                    </h3>
                  </div>
                  <div className='mt-1 text-xs text-gray-500 group-hover:text-shop_dark_green transition-all duration-300 group-hover:font-medium'>
                    Shop Now →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className='text-center mt-8 sm:mt-10 md:mt-12'>
          <Link
            href='/categories'
            className='inline-flex items-center gap-2 bg-shop_btn_dark_green text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect text-sm sm:text-base'
          >
            View All Categories
            <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories
