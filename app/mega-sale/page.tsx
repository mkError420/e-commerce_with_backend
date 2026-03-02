'use client'

import React, { useState, useEffect } from 'react'
import Container from '@/components/Container';
import { Clock, Gift, Zap, TrendingUp, Star, ShoppingCart, Tag, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Sample mega sale data - in a real app, this would come from an API
const megaSaleCategories = [
  {
    id: 1,
    name: 'Electronics',
    icon: '📱',
    discount: 'Up to 70%',
    items: 156,
    color: 'from-blue-500 to-purple-600',
    featured: true,
    href: '/categories/electronics'
  },
  {
    id: 2,
    name: 'Fashion',
    icon: '👗',
    discount: 'Up to 60%',
    items: 234,
    color: 'from-pink-500 to-rose-600',
    featured: true,
    href: '/categories/fashion'
  },
  {
    id: 3,
    name: 'Home & Living',
    icon: '🏠',
    discount: 'Up to 50%',
    items: 89,
    color: 'from-green-500 to-teal-600',
    featured: false,
    href: '/categories/home'
  },
  {
    id: 4,
    name: 'Beauty',
    icon: '💄',
    discount: 'Up to 65%',
    items: 145,
    color: 'from-purple-500 to-pink-600',
    featured: false,
    href: '/categories/health'
  },
  {
    id: 5,
    name: 'Sports',
    icon: '⚽',
    discount: 'Up to 55%',
    items: 78,
    color: 'from-orange-500 to-red-600',
    featured: false,
    href: '/categories/sports'
  },
  {
    id: 6,
    name: 'Toys & Games',
    icon: '🎮',
    discount: 'Up to 75%',
    items: 92,
    color: 'from-yellow-500 to-orange-600',
    featured: true,
    href: '/categories/toys'
  }
]

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    originalPrice: 299.99,
    salePrice: 89.99,
    discount: 70,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 256,
    badge: 'MEGA DEAL',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Watch Ultra',
    originalPrice: 499.99,
    salePrice: 199.99,
    discount: 60,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 189,
    badge: 'LIMITED',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Designer Leather Jacket',
    originalPrice: 599.99,
    salePrice: 239.99,
    discount: 60,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 134,
    badge: 'HOT',
    category: 'Fashion'
  },
  {
    id: 4,
    name: 'Gaming Laptop Pro',
    originalPrice: 1299.99,
    salePrice: 649.99,
    discount: 50,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 445,
    badge: 'MEGA DEAL',
    category: 'Electronics'
  },
  {
    id: 5,
    name: 'Skincare Premium Set',
    originalPrice: 189.99,
    salePrice: 66.99,
    discount: 65,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 567,
    badge: 'BESTSELLER',
    category: 'Beauty'
  },
  {
    id: 6,
    name: 'Fitness Equipment Bundle',
    originalPrice: 399.99,
    salePrice: 159.99,
    discount: 60,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 223,
    badge: 'BUNDLE',
    category: 'Sports'
  }
]

const MegaSalePage = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 45,
    seconds: 30
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          seconds = 59
          minutes--
        } else if (hours > 0) {
          seconds = 59
          minutes = 59
          hours--
        } else if (days > 0) {
          seconds = 59
          minutes = 59
          hours = 23
          days--
        } else {
          // Sale ended
          clearInterval(timer)
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 text-white'>
        {/* Background Effects */}
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-white/10 rounded-full blur-2xl'></div>
        </div>

        <Container className='relative z-10 py-16'>
          <div className='text-center'>
            {/* Mega Sale Badge */}
            <div className='inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6'>
              <Zap className='w-8 h-8 text-yellow-300' />
              <span className='text-2xl font-bold'>MEGA SALE</span>
              <Gift className='w-8 h-8 text-yellow-300' />
            </div>

            {/* Main Heading */}
            <h1 className='text-4xl md:text-6xl font-black mb-4'>
              UP TO <span className='text-yellow-300'>75% OFF</span>
            </h1>
            <p className='text-xl md:text-2xl text-pink-100 mb-8 max-w-3xl mx-auto'>
              Biggest sale of the year! Limited time only. Don't miss these incredible deals!
            </p>

            {/* Countdown Timer */}
            <div className='inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 mb-8'>
              <Clock className='w-6 h-6 text-yellow-300' />
              <div className='text-center'>
                <div className='text-sm text-pink-100 mb-2'>Sale Ends In:</div>
                <div className='flex gap-3 text-3xl md:text-4xl font-bold font-mono'>
                  <div className='bg-white/20 rounded-lg px-4 py-2'>
                    <div className='text-yellow-300'>{formatNumber(timeLeft.days)}</div>
                    <div className='text-sm text-pink-100'>DAYS</div>
                  </div>
                  <div className='bg-white/20 rounded-lg px-4 py-2'>
                    <div className='text-yellow-300'>{formatNumber(timeLeft.hours)}</div>
                    <div className='text-sm text-pink-100'>HRS</div>
                  </div>
                  <div className='bg-white/20 rounded-lg px-4 py-2'>
                    <div className='text-yellow-300'>{formatNumber(timeLeft.minutes)}</div>
                    <div className='text-sm text-pink-100'>MIN</div>
                  </div>
                  <div className='bg-white/20 rounded-lg px-4 py-2'>
                    <div className='text-yellow-300'>{formatNumber(timeLeft.seconds)}</div>
                    <div className='text-sm text-pink-100'>SEC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:shadow-xl hoverEffect transform hover:scale-105 transition-all duration-300'>
                Shop Mega Sale
              </button>
              <button className='bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 hover:shadow-xl hoverEffect border border-white/30'>
                View All Deals
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className='py-16'>
        <Container>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Shop by <span className='text-red-600'>Category</span>
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Massive discounts across all categories. Find everything you need at unbeatable prices!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {megaSaleCategories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className='group'
              >
                <div
                  className='relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105'
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                  
                  <div className='relative p-8 text-center text-white'>
                    {/* Icon */}
                    <div className='text-6xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                      {category.icon}
                    </div>
                    
                    {/* Category Name */}
                    <h3 className='text-xl font-bold mb-2'>{category.name}</h3>
                    
                    {/* Discount */}
                    <div className='text-2xl font-bold mb-2'>{category.discount}</div>
                    
                    {/* Items Count */}
                    <div className='text-white/80 text-sm mb-4'>{category.items} items</div>
                    
                    {/* Shop Button */}
                    <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 group-hover:bg-white/30 transition-colors duration-300'>
                      <span className='font-semibold'>Shop Now</span>
                      <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className='py-16 bg-white'>
        <Container>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Featured <span className='text-red-600'>Mega Deals</span>
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Handpicked hottest deals with maximum savings. These won't last long!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuredProducts.map((product) => (
              <div key={product.id} className='group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100'>
                {/* Badge */}
                <div className='absolute top-4 left-4 z-10'>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${product.badge === 'MEGA DEAL' ? 'bg-red-600 text-white' :
                      product.badge === 'LIMITED' ? 'bg-orange-500 text-white' :
                      product.badge === 'HOT' ? 'bg-yellow-500 text-white' :
                      product.badge === 'BESTSELLER' ? 'bg-green-500 text-white' :
                      'bg-purple-500 text-white'
                    }
                  `}>
                    {product.badge}
                  </span>
                </div>

                {/* Product Image */}
                <div className='relative overflow-hidden h-48 bg-gray-100'>
                  <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                    <div className='text-gray-400 text-center'>
                      <div className='w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2'></div>
                      <p className='text-sm'>Product Image</p>
                    </div>
                  </div>
                  
                  {/* Discount Overlay */}
                  <div className='absolute top-4 right-4 bg-red-600 text-white rounded-lg px-3 py-2 text-center'>
                    <div className='text-2xl font-bold'>-{product.discount}%</div>
                    <div className='text-xs'>OFF</div>
                  </div>
                </div>

                {/* Product Info */}
                <div className='p-6'>
                  {/* Category */}
                  <div className='text-xs text-red-600 font-semibold mb-2 uppercase tracking-wide'>
                    {product.category}
                  </div>

                  {/* Title */}
                  <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300'>
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm text-gray-600'>
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className='flex items-center gap-3 mb-4'>
                    <span className='text-2xl font-bold text-red-600'>
                      ${product.salePrice}
                    </span>
                    <span className='text-lg text-gray-400 line-through'>
                      ${product.originalPrice}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button className='w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg hoverEffect flex items-center justify-center gap-2 group/btn'>
                    <ShoppingCart className='w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300' />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className='text-center mt-12'>
            <button className='bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-xl hoverEffect transform hover:scale-105 transition-all duration-300'>
              View All Mega Deals
            </button>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white'>
        <Container>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-4xl md:text-5xl font-bold text-yellow-400 mb-2'>
                {megaSaleCategories.reduce((sum, cat) => sum + cat.items, 0)}+
              </div>
              <div className='text-gray-300'>Items on Sale</div>
            </div>
            <div>
              <div className='text-4xl md:text-5xl font-bold text-green-400 mb-2'>
                75%
              </div>
              <div className='text-gray-300'>Max Discount</div>
            </div>
            <div>
              <div className='text-4xl md:text-5xl font-bold text-blue-400 mb-2'>
                {featuredProducts.reduce((sum, product) => sum + product.reviews, 0)}+
              </div>
              <div className='text-gray-300'>Happy Customers</div>
            </div>
            <div>
              <div className='text-4xl md:text-5xl font-bold text-purple-400 mb-2'>
                24/7
              </div>
              <div className='text-gray-300'>Support</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className='py-16 bg-white'>
        <Container>
          <div className='max-w-2xl mx-auto text-center'>
            <div className='bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white'>
              <div className='flex items-center justify-center gap-4 mb-6'>
                <Gift className='w-8 h-8 text-yellow-300' />
                <h3 className='text-2xl font-bold'>Don't Miss Future Deals!</h3>
              </div>
              <p className='text-lg text-pink-100 mb-8'>
                Subscribe to our newsletter and be the first to know about upcoming mega sales and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className='max-w-md mx-auto'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <input
                    type='email'
                    placeholder='Enter your email address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-300'
                    required
                  />
                  <button
                    type='submit'
                    className='bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 hover:shadow-lg hoverEffect transform hover:scale-105 transition-all duration-300'
                  >
                    {isSubscribed ? 'Subscribed!' : 'Subscribe Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default MegaSalePage
