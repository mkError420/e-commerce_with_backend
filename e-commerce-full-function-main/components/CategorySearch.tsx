'use client'

import React from 'react'
import { Search, X } from 'lucide-react'

interface CategorySearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  onQuickFilter: (filter: string) => void
  quickFilters: { label: string; value: string; color: string }[]
  searchSuggestions: string[]
  placeholder: string
  categoryColor: string
  resultCount: number
}

const CategorySearch = ({
  searchTerm,
  setSearchTerm,
  onQuickFilter,
  quickFilters,
  searchSuggestions,
  placeholder,
  categoryColor,
  resultCount
}: CategorySearchProps) => {
  return (
    <div className='mb-8'>
      <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex flex-col lg:flex-row gap-4 items-center'>
            {/* Main Search Bar */}
            <div className='flex-1 relative'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-12 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-${categoryColor}-500 focus:border-transparent bg-gray-50`}
                />
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
                  <Search className='w-6 h-6 text-gray-400' />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    <X className='w-5 h-5' />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            <div className='flex gap-2 flex-wrap'>
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => onQuickFilter(filter.value)}
                  className={`px-4 py-2 ${filter.color} rounded-lg hover:opacity-80 transition-opacity text-sm font-medium`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Suggestions */}
          {searchTerm && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-sm text-gray-600'>Popular searches:</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className={`text-sm text-${categoryColor}-600 hover:text-${categoryColor}-700 font-medium`}
                >
                  Clear search
                </button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(suggestion)}
                    className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-xs'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Search Display */}
          {searchTerm && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span>Searching for:</span>
                <span className={`font-semibold text-${categoryColor}-600 bg-${categoryColor}-50 px-2 py-1 rounded`}>
                  "{searchTerm}"
                </span>
                <span className='text-gray-500'>({resultCount} results)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategorySearch
