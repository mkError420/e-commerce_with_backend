'use client'

import React, { useState } from 'react'
import { productsData } from '@/constants/data'

const TestSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<typeof productsData>([])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      console.log('Test searching for:', query) // Debug log
      
      // Search across ALL products and ALL categories
      const filtered = productsData.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query)
        const categoryMatch = product.category.toLowerCase().includes(query)
        const descriptionMatch = product.description?.toLowerCase().includes(query)
        const badgeMatch = product.badge?.toLowerCase().includes(query)
        
        console.log(`Test - Product: ${product.name}`)
        console.log(`Test - Name: ${nameMatch}, Category: ${categoryMatch}, Desc: ${descriptionMatch}, Badge: ${badgeMatch}`)
        
        // Return product if it matches ANY field (search across all categories)
        return nameMatch || categoryMatch || descriptionMatch || badgeMatch
      })
      console.log('Test - Final results from all categories:', filtered)
      setResults(filtered)
    } else {
      setResults(productsData)
    }
  }

  // Auto-search when query changes
  React.useEffect(() => {
    handleSearch()
  }, [searchQuery])

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Comprehensive Search Test Page</h1>
        
        {/* Search Input */}
        <div className='mb-8'>
          <div className='flex gap-4 mb-4'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search products...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg'
            />
            <button
              onClick={handleSearch}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Search
            </button>
          </div>
          
          {/* Quick Test Buttons */}
          <div className='mb-4'>
            <h3 className='text-sm font-semibold mb-2'>Quick Tests:</h3>
            <div className='flex flex-wrap gap-2'>
              {['', 'wireless', 'bluetooth', 'smart', 'watch', 'jacket', 'skincare', 'gaming', 'camera', 'chair', 'novel', 'mouse', 'yoga', 'coffee', 'running'].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm'
                >
                  {term || '(all)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Test */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Test Categories:</h2>
          <div className='flex flex-wrap gap-2'>
            {[...new Set(productsData.map(p => p.category))].map(category => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className='px-4 py-2 bg-purple-200 rounded-lg hover:bg-purple-300'
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Available Products */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            Available Products ({productsData.length}):
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {productsData.map(product => (
              <div key={product.id} className='bg-white p-4 rounded-lg border border-gray-200'>
                <h3 className='font-semibold text-sm'>{product.name}</h3>
                <p className='text-xs text-gray-600'>{product.category}</p>
                <p className='text-xs text-gray-500'>{product.description}</p>
                <p className='font-bold text-green-600'>${product.price}</p>
                <p className='text-xs text-purple-600'>Badge: {product.badge}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>
            Search Results ({results.length}):
            {searchQuery && <span className='text-gray-600'> for "{searchQuery}"</span>}
          </h2>
          {results.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {results.map(product => (
                <div key={product.id} className='bg-white p-4 rounded-lg border border-green-200'>
                  <h3 className='font-semibold text-green-700 text-sm'>{product.name}</h3>
                  <p className='text-xs text-gray-600'>{product.category}</p>
                  <p className='text-xs text-gray-500'>{product.description}</p>
                  <p className='font-bold text-green-600'>${product.price}</p>
                  <p className='text-xs text-purple-600'>Badge: {product.badge}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 bg-red-50 rounded-lg'>
              <p className='text-red-600'>No results found for "{searchQuery}"</p>
              <p className='text-sm text-gray-500 mt-2'>Try different search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestSearchPage
