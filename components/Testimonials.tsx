"use client"

import React, { useEffect, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import Glide from '@glidejs/glide'
import '@glidejs/glide/dist/css/glide.core.min.css'
import '@glidejs/glide/dist/css/glide.theme.min.css'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/100/100',
    rating: 5,
    review: 'Absolutely amazing shopping experience! The quality of products exceeded my expectations and the customer service was outstanding. Will definitely shop again!',
    product: 'Wireless Headphones',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: '/api/placeholder/100/100',
    rating: 5,
    review: 'Best online shopping platform I\'ve used. Fast delivery, great prices, and the product quality is always top-notch. Highly recommend to everyone!',
    product: 'Smart Watch',
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: '/api/placeholder/100/100',
    rating: 4,
    review: 'Love the variety of products and the user-friendly interface. The discounts are amazing and the shipping is always on time. Great job Mk-ShopBD!',
    product: 'Leather Jacket',
    date: '2 weeks ago'
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: '/api/placeholder/100/100',
    rating: 5,
    review: 'I\'ve been a loyal customer for over a year now. The quality, service, and prices are unbeatable. This is my go-to shopping destination!',
    product: 'Gaming Keyboard',
    date: '3 weeks ago'
  }
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className='bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden'>
      {/* Quote Icon */}
      <div className='absolute top-4 right-4 text-shop_light_pink/20'>
        <Quote className='w-12 h-12' />
      </div>

      {/* Rating */}
      <div className='flex items-center gap-1 mb-4'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className='text-gray-700 mb-6 leading-relaxed'>
        "{testimonial.review}"
      </blockquote>

      {/* Customer Info */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {/* Avatar */}
          <div className='w-12 h-12 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white font-semibold'>
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </div>
          
          {/* Name and Product */}
          <div>
            <div className='font-semibold text-gray-900'>
              {testimonial.name}
            </div>
            <div className='text-sm text-gray-500'>
              Purchased: {testimonial.product}
            </div>
          </div>
        </div>
        
        {/* Date */}
        <div className='text-sm text-gray-400'>
          {testimonial.date}
        </div>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const glideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: 'carousel',
        perView: 3,
        gap: 32,
        autoplay: 3000,
        hoverpause: false,
        animationDuration: 800,
        animationTimingFunc: 'linear',
        rewind: false,
        bound: false,
        startAt: 0,
        dragThreshold: false,
        touchRatio: 0.5,
        breakpoints: {
          1024: {
            perView: 3,
            gap: 32
          },
          768: {
            perView: 2,
            gap: 24
          },
          640: {
            perView: 1,
            gap: 16
          }
        }
      })

      glide.mount()

      return () => {
        glide.destroy()
      }
    }
  }, [])

  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            What Our <span className='text-shop_dark_green'>Customers</span> Say
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Real reviews from real customers who love shopping with us
          </p>
        </div>

        {/* Glide.js Carousel */}
        <div className='relative'>
          <div ref={glideRef} className='glide'>
            <div className='glide__track' data-glide-el='track'>
              <div className='glide__slides'>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className='glide__slide'>
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className='mt-16 bg-gradient-to-r from-shop_dark_green to-shop_light_green rounded-2xl p-8 text-white'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>10K+</div>
              <div className='text-white/80'>Happy Customers</div>
            </div>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>4.9★</div>
              <div className='text-white/80'>Average Rating</div>
            </div>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>98%</div>
              <div className='text-white/80'>Satisfaction Rate</div>
            </div>
            <div>
              <div className='text-3xl md:text-4xl font-bold mb-2'>24/7</div>
              <div className='text-white/80'>Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
