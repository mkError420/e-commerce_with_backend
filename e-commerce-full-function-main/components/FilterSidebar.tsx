'use client'

import React, { useState, Dispatch, SetStateAction } from 'react'
import { Filter, ChevronDown, ChevronUp, X, Tag, Clock, TrendingUp } from 'lucide-react'

interface Category {
  id: string
  name: string
  count: number
  subcategories?: {
    id: string
    name: string
    count: number
  }[]
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
  selectedRatings: number[]
  setSelectedRatings: (ratings: number[] | ((prev: number[]) => number[])) => void
  selectedSizes: string[]
  setSelectedSizes: (sizes: string[] | ((prev: string[]) => string[])) => void
  priceRange: { min: number; max: number }
  setPriceRange: (range: { min: number; max: number } | ((prev: { min: number; max: number }) => { min: number; max: number })) => void
}

interface FilterSidebarProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  categories: Category[]
  dealTypes: DealType[]
  selectedCategories: string[]
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
  selectedDealType: string
  setSelectedDealType: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  selectedRatings: number[]
  setSelectedRatings: (ratings: number[] | ((prev: number[]) => number[])) => void
  selectedSizes: string[]
  setSelectedSizes: (sizes: string[] | ((prev: string[]) => string[])) => void
  priceRange: { min: number; max: number }
  setPriceRange: (range: { min: number; max: number } | ((prev: { min: number; max: number }) => { min: number; max: number })) => void
}

const FilterSidebar = ({
  showFilters,
  setShowFilters,
  categories,
  dealTypes,
  selectedCategories,
  setSelectedCategories,
  selectedDealType,
  setSelectedDealType,
  sortBy,
  setSortBy,
  selectedRatings,
  setSelectedRatings,
  selectedSizes,
  setSelectedSizes,
  priceRange,
  setPriceRange
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories', 'price'])
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes('all')) {
        return [categoryId];
      }
      const newSelection = prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId];
      if (newSelection.length === 0) {
        return ['all'];
      }
      return newSelection;
    })
  }

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories(['all'])
    setSelectedDealType('all')
    setSortBy('featured')
    setSelectedRatings([])
    setSelectedSizes([])
    setPriceRange({ min: 0, max: 1000 })
    setLocalPriceRange({ min: 0, max: 1000 })
  }

  const applyPriceRange = () => {
    setPriceRange(localPriceRange)
  }

  const handlePriceChange = (field: 'min' | 'max', value: number) => {
    setLocalPriceRange((prev: { min: number; max: number }) => ({ ...prev, [field]: value }))
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const ratings = [5, 4, 3, 2, 1]

  return (
    <>
      {/* Mobile Overlay */}
      {showFilters && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-full bg-white lg:bg-transparent
        transform transition-transform duration-300 ease-in-out
        ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className='h-full lg:h-auto overflow-y-auto bg-white lg:bg-transparent border-r lg:border-0 border-gray-200'>
          {/* Mobile Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200 lg:hidden'>
            <h2 className='text-lg font-semibold'>Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className='p-2 hover:bg-gray-100 rounded-lg'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='p-4 lg:p-0 space-y-6'>
            {/* Clear Filters */}
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>
              <button
                onClick={clearAllFilters}
                className='text-sm text-shop_dark_green hover:text-shop_dark_green/80 font-medium'
              >
                Clear All
              </button>
            </div>

            {/* Categories */}
            <div className='border-b border-gray-200 pb-6'>
              <button
                onClick={() => toggleSection('categories')}
                className='flex items-center justify-between w-full text-left'
              >
                <h4 className='font-medium text-gray-900'>Categories</h4>
                {expandedSections.includes('categories') ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </button>
              
              {expandedSections.includes('categories') && (
                <div className='mt-4 space-y-3'>
                  {categories.map(category => (
                    <div key={category.id} className='border border-gray-100 rounded-lg p-3'>
                      {/* Main Category */}
                      <label className='flex items-center justify-between cursor-pointer mb-2'>
                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className='w-4 h-4 text-shop_dark_green border-gray-300 rounded focus:ring-shop_dark_green'
                          />
                          <span className='ml-3 text-sm font-medium text-gray-900'>{category.name}</span>
                        </div>
                        <span className='text-sm text-gray-500'>({category.count})</span>
                      </label>
                      
                      {/* Sub-categories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className='ml-7 mt-2 space-y-2'>
                          {category.subcategories.map(subcategory => (
                            <label key={subcategory.id} className='flex items-center justify-between cursor-pointer'>
                              <div className='flex items-center'>
                                <input
                                  type='checkbox'
                                  checked={selectedCategories.includes(subcategory.id)}
                                  onChange={() => toggleCategory(subcategory.id)}
                                  className='w-3 h-3 text-shop_dark_green border-gray-300 rounded focus:ring-shop_dark_green'
                                />
                                <span className='ml-2 text-xs text-gray-600'>{subcategory.name}</span>
                              </div>
                              <span className='text-xs text-gray-400'>({subcategory.count})</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className='bg-white rounded-xl p-6 border border-gray-100'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-semibold text-gray-900'>Price Range</h4>
                <button
                  onClick={() => toggleSection('price')}
                  className='flex items-center gap-3 text-sm text-gray-500 hover:text-shop_dark_green'
                >
                  {expandedSections.includes('price') ? (
                    <ChevronUp className='w-4 h-4' />
                  ) : (
                    <ChevronDown className='w-4 h-4' />
                  )}
                </button>
              </div>
              
              {expandedSections.includes('price') && (
                <div className='space-y-4'>
                  {/* Min/Max Inputs */}
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='flex-1'>
                      <label className='text-sm text-gray-600 mb-2 block'>Min Price</label>
                      <input
                        type='number'
                        placeholder='0'
                        value={localPriceRange.min}
                        onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                      />
                    </div>
                    <div className='flex-1'>
                      <label className='text-sm text-gray-600 mb-2 block'>Max Price</label>
                      <input
                        type='number'
                        placeholder='1000'
                        value={localPriceRange.max}
                        onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                      />
                    </div>
                  </div>

                  {/* Price Range Display */}
                  <div className='space-y-2 mb-4'>
                    <div className='flex justify-between text-sm text-gray-600 mb-2'>
                      <span>Current Range: ৳{localPriceRange.min} - ৳{localPriceRange.max}</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={applyPriceRange}
                    className='w-full bg-shop_dark_green text-white py-3 rounded-lg font-medium hover:bg-shop_dark_green/80 transition-colors duration-300'
                  >
                    Apply Price Range
                  </button>
                </div>
              )}
            </div>

            {/* Ratings */}
            <div className='border-b border-gray-200 pb-6'>
              <button
                onClick={() => toggleSection('ratings')}
                className='flex items-center justify-between w-full text-left'
              >
                <h4 className='font-medium text-gray-900'>Ratings</h4>
                {expandedSections.includes('ratings') ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </button>
              
              {expandedSections.includes('ratings') && (
                <div className='mt-4 space-y-3'>
                  {ratings.map(rating => (
                    <label key={rating} className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={selectedRatings.includes(rating)}
                        onChange={() => toggleRating(rating)}
                        className='w-4 h-4 text-shop_dark_green border-gray-300 rounded focus:ring-shop_dark_green'
                      />
                      <div className='ml-3 flex items-center'>
                        <div className='flex'>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                        </div>
                        <span className='ml-2 text-sm text-gray-600'>& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className='pb-6'>
              <button
                onClick={() => toggleSection('sizes')}
                className='flex items-center justify-between w-full text-left'
              >
                <h4 className='font-medium text-gray-900'>Sizes</h4>
                {expandedSections.includes('sizes') ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </button>
              
              {expandedSections.includes('sizes') && (
                <div className='mt-4 grid grid-cols-3 gap-2'>
                  {sizes.map(size => (
                    <label key={size} className='cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                        className='sr-only'
                      />
                      <div className={`
                        px-3 py-2 text-center border rounded-lg text-sm font-medium transition-colors
                        ${selectedSizes.includes(size)
                          ? 'border-shop_dark_green bg-shop_dark_green text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }
                      `}>
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar
