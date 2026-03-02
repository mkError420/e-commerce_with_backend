'use client'

import React, { useState } from 'react'
import { productsData } from '@/constants/data'

const VerifySearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [testResults, setTestResults] = useState<{
    product: typeof productsData[0], 
    found: boolean,
    matches: {
      name: boolean,
      category: boolean,
      description: boolean,
      badge: boolean
    }
  }[]>([])

  // Test all products for a given search query
  const testAllProducts = () => {
    const results = productsData.map(product => {
      const query = searchQuery.toLowerCase().trim()
      const nameMatch = product.name.toLowerCase().includes(query)
      const categoryMatch = product.category.toLowerCase().includes(query)
      const descriptionMatch = product.description?.toLowerCase().includes(query)
      const badgeMatch = product.badge?.toLowerCase().includes(query)
      
      const found = nameMatch || categoryMatch || descriptionMatch || badgeMatch
      
      return {
        product,
        found,
        matches: {
          name: nameMatch,
          category: categoryMatch,
          description: descriptionMatch,
          badge: badgeMatch
        }
      }
    })
    
    setTestResults(results)
  }

  // Auto-test when query changes
  React.useEffect(() => {
    if (searchQuery.trim()) {
      testAllProducts()
    } else {
      setTestResults([])
    }
  }, [searchQuery])

  // Test specific search terms for all products
  const testSearchTerms = [
    'wireless', 'bluetooth', 'headphones',
    'smart', 'watch', 'pro',
    'premium', 'leather', 'jacket',
    'organic', 'skincare', 'set',
    'gaming', 'mechanical', 'keyboard',
    'professional', 'camera', 'lens',
    'ergonomic', 'office', 'chair',
    'bestseller', 'novel', 'collection',
    'mouse', 'yoga', 'mat',
    'coffee', 'maker', 'deluxe',
    'running', 'shoes'
  ]

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold mb-4'>Complete Search Verification</h1>
        <p className='text-gray-600 mb-8'>Test that ALL single products are searchable across ALL categories</p>
        
        {/* Search Input */}
        <div className='mb-8'>
          <div className='flex gap-4 mb-4'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Enter search term to test all products...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg'
            />
            <button
              onClick={testAllProducts}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Test All Products
            </button>
          </div>
          
          {/* Quick Test Terms */}
          <div className='mb-4'>
            <h3 className='text-sm font-semibold mb-2'>Test Common Terms:</h3>
            <div className='flex flex-wrap gap-2'>
              {testSearchTerms.map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm'
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Products Overview */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            All Products ({productsData.length}) - Search Coverage:
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {productsData.map(product => (
              <div key={product.id} className='bg-white p-4 rounded-lg border border-gray-200'>
                <h3 className='font-semibold text-sm mb-2'>{product.name}</h3>
                <div className='text-xs space-y-1'>
                  <p><span className='font-medium'>Category:</span> {product.category}</p>
                  <p><span className='font-medium'>Badge:</span> {product.badge}</p>
                  <p><span className='font-medium'>Price:</span> ${product.price}</p>
                  <p className='text-gray-500 line-clamp-2'>{product.description}</p>
                </div>
                
                {/* Searchable keywords */}
                <div className='mt-2 pt-2 border-t border-gray-100'>
                  <p className='text-xs font-medium text-gray-600 mb-1'>Searchable by:</p>
                  <div className='flex flex-wrap gap-1'>
                    {product.name.toLowerCase().split(' ').map((word, idx) => (
                      <span key={idx} className='text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded'>
                        {word}
                      </span>
                    ))}
                    <span className='text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded'>
                      {product.category.toLowerCase()}
                    </span>
                    {product.badge && (
                      <span className='text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded'>
                        {product.badge.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <h2 className='text-xl font-semibold mb-4'>
              Test Results for "{searchQuery}":
              <span className='ml-2 text-lg'>
                ({testResults.filter(r => r.found).length} / {testResults.length} found)
              </span>
            </h2>
            
            {/* Summary */}
            <div className='mb-6 p-4 bg-gray-100 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-semibold'>
                    Found: {testResults.filter(r => r.found).length} products
                  </p>
                  <p className='text-sm text-gray-600'>
                    Not found: {testResults.filter(r => !r.found).length} products
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  testResults.filter(r => r.found).length === testResults.length
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {testResults.filter(r => r.found).length === testResults.length
                    ? '✓ All Products Found'
                    : '✗ Some Products Missing'
                  }
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-2 ${
                    result.found 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className='flex items-start justify-between mb-2'>
                    <h3 className='font-semibold text-sm'>{result.product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      result.found ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {result.found ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  <div className='text-xs space-y-1 mb-2'>
                    <p><span className='font-medium'>Category:</span> {result.product.category}</p>
                    <p><span className='font-medium'>Matches:</span></p>
                    <div className='ml-2 space-y-1'>
                      <p className={result.matches.name ? 'text-green-600' : 'text-red-600'}>
                        Name: {result.matches.name ? '✓' : '✗'}
                      </p>
                      <p className={result.matches.category ? 'text-green-600' : 'text-red-600'}>
                        Category: {result.matches.category ? '✓' : '✗'}
                      </p>
                      <p className={result.matches.description ? 'text-green-600' : 'text-red-600'}>
                        Description: {result.matches.description ? '✓' : '✗'}
                      </p>
                      <p className={result.matches.badge ? 'text-green-600' : 'text-red-600'}>
                        Badge: {result.matches.badge ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifySearchPage
