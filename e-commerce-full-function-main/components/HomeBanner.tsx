
import React from 'react'
import { Title } from './ui/text'
import Link from 'next/link'
import Image from 'next/image'
import { banner_1 } from '@/images'
import { ArrowRight, Sparkles, Tag, Zap, Calendar } from 'lucide-react'

const HomeBanner = () => {
  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-shop_light_pink via-white to-shop_light_pink/50 rounded-2xl px-4 sm:px-6 md:px-8 lg:px-24 py-8 sm:py-12 md:py-16 lg:py-20'>
      {/* Background decorative elements */}
      <div className='absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-shop_btn_dark_green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-shop_orange/10 rounded-full blur-2xl'></div>
      
      <div className='relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12'>
        <div className='flex-1 space-y-6 sm:space-y-8 text-center lg:text-left'>
          <div className='space-y-3 sm:space-y-4'>
                        
            {/* Main heading */}
            <Title className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
              Welcome to <span className='text-shop_dark_green'>Mk-ShopBD 🛍️</span> <br />
              <span className='text-shop_orange'>Smart Shopping</span> Starts Here!😉
            </Title>
            
            {/* Subheading */}
            <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0'>
              Discover amazing products at unbeatable prices. Quality meets affordability in every click.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start'>
            <Link 
              href={"/shop"} 
              className='inline-flex items-center gap-2 bg-shop_btn_dark_green text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-xl hoverEffect transform hover:scale-105 text-sm sm:text-base'
            >
              Shop Now
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
            </Link>
            <Link 
              href={"/deals"} 
              className='inline-flex items-center gap-2 bg-white border-2 border-shop_orange text-shop_orange px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-shop_orange hover:text-white hover:shadow-xl hoverEffect transform hover:scale-105 text-sm sm:text-base'
            >
              <Tag className='w-4 h-4 sm:w-5 sm:h-5' />
              View All Deals
            </Link>
          </div>
          
          {/* Stats */}
          <div className='flex gap-4 sm:gap-6 md:gap-8 justify-center lg:justify-start pt-2 sm:pt-4'>
            <div className='text-center sm:text-left'>
              <div className='text-xl sm:text-2xl font-bold text-shop_dark_green'>10K+</div>
              <div className='text-xs sm:text-sm text-gray-600'>Happy Customers</div>
            </div>
            <div className='text-center sm:text-left'>
              <div className='text-xl sm:text-2xl font-bold text-shop_dark_green'>500+</div>
              <div className='text-xs sm:text-sm text-gray-600'>Products</div>
            </div>
            <div className='text-center sm:text-left'>
              <div className='text-xl sm:text-2xl font-bold text-shop_dark_green'>4.9★</div>
              <div className='text-xs sm:text-sm text-gray-600'>Rating</div>
            </div>
          </div>
        </div>
        
        {/* Image section */}
        <div className='flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-shop_btn_dark_green/20 to-shop_orange/20 rounded-2xl blur-2xl transform rotate-6'></div>
            <Image 
              src={banner_1} 
              alt='Shopping Banner' 
              className='relative w-64 sm:w-80 md:w-96 lg:w-full max-w-md object-cover rounded-2xl shadow-2xl transform hover:scale-105 hoverEffect'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomeBanner
