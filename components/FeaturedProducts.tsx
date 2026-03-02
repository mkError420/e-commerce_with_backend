import React from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { productsData } from '@/constants/data'

async function getProducts() {
  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/products`, { next: { revalidate: 60 } })
    const json = await res.json()
    return json?.data?.length ? json.data : productsData
  } catch {
    return productsData
  }
}

const FeaturedProducts = async () => {
  const products = await getProducts()
  return (
    <section className='py-8 sm:py-12 md:py-16 bg-shop_light_bg'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-8 sm:mb-10 md:mb-12'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
            Featured <span className='text-shop_dark_green'>Products</span>
          </h2>
          <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4'>
            Discover our handpicked selection of best deals and trending products
          </p>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8'>
          {(products.slice(0, 8) || []).map((product: any) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>

        {/* View All Button */}
        <div className='text-center mt-8 sm:mt-10 md:mt-12'>
          <Link
            href='/shop'
            className='inline-flex items-center gap-2 bg-white border-2 border-shop_dark_green text-shop_dark_green px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:text-white hover:shadow-lg hoverEffect text-sm sm:text-base'
          >
            View All Products
            <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
