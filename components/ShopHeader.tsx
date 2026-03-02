'use client'

import React, { useState } from 'react'
import { ChevronRight, Home, Filter, Grid, List, Search, X } from 'lucide-react'

interface ShopHeaderProps {
  totalProducts: number
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  sortBy: string
  setSortBy: (sort: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

const ShopHeader = ({ 
  totalProducts, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters 
}: ShopHeaderProps) => {
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4'>
        {/* Breadcrumb - Hidden on Small Mobile */}
        <nav className='hidden sm:flex items-center text-sm text-gray-500 mb-3 sm:mb-4'>
          <Home className='w-4 h-4 mr-2' />
          <a href='/' className='hover:text-shop_dark_green'>Home</a>
          <ChevronRight className='w-4 h-4 mx-2' />
          <span className='text-gray-900 font-medium'>Shop</span>
        </nav>

        {/* Mobile Title - Centered */}
        <div className='sm:hidden text-center mb-4'>
          <h1 className='text-xl font-bold text-gray-900'>
            Shop All Products
          </h1>
          <p className='text-sm text-gray-600'>
            {totalProducts} products
          </p>
        </div>

        {/* Desktop Title */}
        <div className='hidden sm:block mb-4'>
          <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2'>
            Shop All Products
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Showing {totalProducts} products
          </p>
        </div>

        {/* Mobile Controls - Stacked */}
        <div className='sm:hidden space-y-3'>
          {/* Search Bar - Full Width */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent w-full text-sm'
            />
          </div>

          {/* Mobile Controls Row */}
          <div className='flex items-center justify-between gap-2'>
            {/* Sort Dropdown - Compact */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent text-sm'
            >
              <option value='featured'>Featured</option>
              <option value='price-low'>Price: Low to High</option>
              <option value='price-high'>Price: High to Low</option>
              <option value='name-asc'>Name: A-Z</option>
              <option value='name-desc'>Name: Z-A</option>
              <option value='rating'>Highest Rated</option>
            </select>

            {/* View Mode Toggle - Compact */}
            <div className='flex border border-gray-300 rounded-lg'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-shop_dark_green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-shop_dark_green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium'
            >
              <Filter className='w-4 h-4' />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Desktop Controls - Horizontal */}
        <div className='hidden sm:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          {/* Search Bar */}
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent w-full'
            />
          </div>

          {/* Controls Row */}
          <div className='flex items-center gap-3'>
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent'
            >
              <option value='featured'>Featured</option>
              <option value='price-low'>Price: Low to High</option>
              <option value='price-high'>Price: High to Low</option>
              <option value='name-asc'>Name: A-Z</option>
              <option value='name-desc'>Name: Z-A</option>
              <option value='rating'>Highest Rated</option>
            </select>

            {/* View Mode Toggle */}
            <div className='flex border border-gray-300 rounded-lg'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-shop_dark_green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className='w-5 h-5' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-shop_dark_green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className='w-5 h-5' />
              </button>
            </div>

            {/* Desktop Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='hidden lg:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              <Filter className='w-5 h-5' />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopHeader
