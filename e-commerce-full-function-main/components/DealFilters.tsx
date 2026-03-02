'use client'

import React from 'react'
import { Filter, ChevronDown, Tag, Clock, TrendingUp } from 'lucide-react'

interface Category {
  name: string
  slug: string
  count: number
}

interface DealType {
  name: string
  slug: string
  icon: string
}

interface DealFiltersProps {
  categories: Category[]
  dealTypes: DealType[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedDealType: string
  setSelectedDealType: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

const DealFilters = ({
  categories,
  dealTypes,
  selectedCategory,
  setSelectedCategory,
  selectedDealType,
  setSelectedDealType,
  sortBy,
  setSortBy
}: DealFiltersProps) => {
  return (
    <div className='space-y-6'>
      {/* Filters Header */}
      <div className='flex items-center gap-3 mb-6'>
        <Filter className='w-5 h-5 text-shop_dark_green' />
        <h3 className='text-lg font-bold text-gray-900'>Deal Filters</h3>
      </div>

      {/* Categories */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <Tag className='w-4 h-4 text-shop_dark_green' />
          <h4 className='font-semibold text-gray-900'>Categories</h4>
        </div>
        <div className='space-y-2'>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`
                w-full flex items-center justify-between py-3 px-4 rounded-lg text-left transition-colors duration-300
                ${selectedCategory === category.slug
                  ? 'bg-shop_dark_green text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-shop_light_pink hover:text-shop_dark_green'
                }
              `}
            >
              <span className='font-medium'>{category.name}</span>
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${selectedCategory === category.slug
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Deal Types */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <Clock className='w-4 h-4 text-shop_dark_green' />
          <h4 className='font-semibold text-gray-900'>Deal Types</h4>
        </div>
        <div className='space-y-2'>
          {dealTypes.map((type) => (
            <button
              key={type.slug}
              onClick={() => setSelectedDealType(type.slug)}
              className={`
                w-full flex items-center gap-3 py-3 px-4 rounded-lg text-left transition-colors duration-300
                ${selectedDealType === type.slug
                  ? 'bg-shop_dark_green text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-shop_light_pink hover:text-shop_dark_green'
                }
              `}
            >
              <span className='text-xl'>{type.icon}</span>
              <span className='font-medium'>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <TrendingUp className='w-4 h-4 text-shop_dark_green' />
          <h4 className='font-semibold text-gray-900'>Sort By</h4>
        </div>
        <div className='space-y-2'>
          {[
            { value: 'ending-soon', label: 'Ending Soon' },
            { value: 'discount-high', label: 'Highest Discount' },
            { value: 'price-low', label: 'Lowest Price' },
            { value: 'popular', label: 'Most Popular' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`
                w-full py-3 px-4 rounded-lg text-left transition-colors duration-300 font-medium
                ${sortBy === option.value
                  ? 'bg-shop_dark_green text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-shop_light_pink hover:text-shop_dark_green'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deal Tips */}
      <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-orange-200'>
        <h4 className='font-semibold text-gray-900 mb-3'>💡 Hot Deal Tips</h4>
        <ul className='space-y-2 text-sm text-gray-700'>
          <li className='flex items-start gap-2'>
            <span className='text-orange-500 mt-1'>•</span>
            <span>Flash deals sell out fast - act quickly!</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-orange-500 mt-1'>•</span>
            <span>Lightning deals have limited stock</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-orange-500 mt-1'>•</span>
            <span>Check back daily for new deals</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-orange-500 mt-1'>•</span>
            <span>Sign up for alerts to never miss a deal</span>
          </li>
        </ul>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedCategory('all')
          setSelectedDealType('all')
          setSortBy('ending-soon')
        }}
        className='w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300'
      >
        Clear All Filters
      </button>
    </div>
  )
}

export default DealFilters
