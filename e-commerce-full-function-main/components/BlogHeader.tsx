'use client'

import React from 'react'
import { Search, ChevronDown, BookOpen, Tag } from 'lucide-react'

interface BlogHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: Array<{ name: string; slug: string; count: number }>
}

const BlogHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}: BlogHeaderProps) => {
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          {/* Title and Description */}
          <div className='text-center lg:text-left'>
            <div className='flex items-center justify-center lg:justify-start gap-3 mb-2'>
              <BookOpen className='w-8 h-8 text-shop_dark_green' />
              <h1 className='text-3xl font-bold text-gray-900'>
                Our Blog
              </h1>
            </div>
            <p className='text-gray-600 max-w-2xl'>
              Stay updated with the latest e-commerce trends, tips, and insights from industry experts
            </p>
          </div>

          {/* Search and Category Filter */}
          <div className='flex flex-col sm:flex-row gap-4 items-center'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search blog posts...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent w-full sm:w-80'
              />
            </div>

            {/* Category Dropdown */}
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent cursor-pointer w-full sm:w-auto'
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none' />
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className='flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Tag className='w-4 h-4' />
            <span>Popular:</span>
          </div>
          {['e-commerce', 'marketing', 'SEO', 'mobile commerce'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className='px-3 py-1 bg-shop_light_pink text-shop_dark_green rounded-full text-sm font-medium hover:bg-shop_dark_green hover:text-white transition-colors duration-300'
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogHeader
