"use client"

import React, { useEffect, useRef } from 'react'

const BrandPartners = () => {
  const tickerRef = useRef<HTMLDivElement>(null)

  const brands = [
    { name: 'Bata', logo: '/api/placeholder/120/60' },
    { name: 'Yellow Fashion', logo: '/api/placeholder/120/60' },
    { name: 'Easy Fashion', logo: '/api/placeholder/120/60' },
    { name: 'Apex', logo: '/api/placeholder/120/60' },
    { name: 'Aarong', logo: '/api/placeholder/120/60' },
    { name: 'Diamond World', logo: '/api/placeholder/120/60' }
  ]

  // Duplicate brands for seamless scrolling
  const duplicatedBrands = [...brands, ...brands]

  useEffect(() => {
    // Ticker animation is handled by CSS animation
  }, [])

  const BrandCard = ({ brand }: { brand: typeof brands[0] }) => {
    return (
      <div className='flex items-center justify-center p-8 bg-gray-50 rounded-xl hover:bg-shop_light_pink hover:shadow-md transition-all duration-300 group h-full'>
        <div className='text-center'>
          {/* Brand Logo Placeholder */}
          <div className='w-24 h-12 bg-gray-300 rounded-lg mx-auto mb-3 group-hover:bg-shop_dark_green/20 transition-colors duration-300'></div>
          <p className='text-sm text-gray-600 group-hover:text-shop_dark_green transition-colors duration-300 font-medium'>
            {brand.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className='py-16 bg-white overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Trusted by <span className='text-shop_dark_green'>Leading Brands</span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            We partner with the best brands to bring you quality products you can trust
          </p>
        </div>

        {/* Ticker Container */}
        <div className='relative'>
          <div className='overflow-hidden'>
            <div 
              ref={tickerRef}
              className='flex animate-ticker'
              style={{
                animation: 'ticker 30s linear infinite',
                width: 'fit-content'
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <div 
                  key={`${brand.name}-${index}`} 
                  className='flex-shrink-0 w-64 px-4'
                >
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership CTA */}
        <div className='mt-16 text-center bg-shop_light_bg rounded-2xl p-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            Want to Partner With Us?
          </h3>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
            Join our growing network of trusted brands and reach thousands of customers looking for quality products.
          </p>
          <a
            href='/partner-with-us'
            className='inline-flex items-center gap-2 bg-shop_dark_green text-white px-8 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect'
          >
            Become a Partner
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
        </div>
      </div>

      {/* CSS for ticker animation */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

export default BrandPartners
