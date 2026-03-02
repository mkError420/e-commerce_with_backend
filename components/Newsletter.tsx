'use client'

import React, { useState } from 'react'
import { Mail, Gift, Bell } from 'lucide-react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <section className='py-16 bg-shop_light_pink/50 relative overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className='absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl'></div>
      
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center text-black'>
          {/* Icon */}
          <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6'>
            <Mail className='w-10 h-10' />
          </div>

          {/* Section Header */}
          <h2 className='text-3xl md:text-4xl text-shop_orange font-bold mb-4'>
            Stay in the Loop
          </h2>
          <p className='text-xl text-shop_dark_green mb-8 max-w-2xl mx-auto'>
            Subscribe to our newsletter and get exclusive deals, new product alerts, and special discounts delivered straight to your inbox!
          </p>

          {/* Benefits */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
            <div className='flex items-center justify-center gap-3 bg-shop_light_pink/60'>
              <Gift className='w-6 h-6 text-yellow-600' />
              <span>Exclusive Deals</span>
            </div>
            <div className='flex items-center justify-center gap-3 bg-shop_light_pink/60'>
              <Bell className='w-6 h-6 text-yellow-600' />
              <span>New Arrivals</span>
            </div>
            <div className='flex items-center justify-center gap-3 bg-shop_light_pink/60'>
              <Mail className='w-6 h-6 text-yellow-600' />
              <span>Weekly Updates</span>
            </div>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
                className='flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-8 focus:ring-white/30 border border-gray-300'
                required
              />
              <button
                type='submit'
                className='bg-gradient-to-br from-shop_dark_green text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hoverEffect transform hover:scale-105 transition-all duration-300'
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </form>

          {/* Success Message */}
          {isSubscribed && (
            <div className='mt-6 p-4 bg-white/20 rounded-xl inline-block'>
              <p className='text-white font-semibold'>
                🎉 Thank you for subscribing! Check your email for a welcome gift.
              </p>
            </div>
          )}

          {/* Privacy Note */}
          <p className='text-sm text-white/70 mt-6'>
            By subscribing, you agree to our Privacy Policy and Terms of Service. 
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
