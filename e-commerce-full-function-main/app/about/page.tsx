'use client'

import React, { useState, useEffect } from 'react'
import Container from '@/components/Container'
import { Heart, Users, Award, Globe, ArrowRight, CheckCircle, Star, TrendingUp, Zap, Shield, Target, ShoppingBag, Truck, Headphones, Gift, Sparkles, Clock, MapPin, Mail, Phone } from 'lucide-react'

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission')
  const [stats, setStats] = useState([
    { value: '5M+', label: 'Happy Customers', icon: Users },
    { value: '100K+', label: 'Products', icon: ShoppingBag },
    { value: '99.9%', label: 'Satisfaction', icon: Award },
    { value: '24/7', label: 'Support', icon: Headphones }
  ])
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats([1, 1, 1, 1])
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-shop_dark_green/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-shop_orange/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-shop_light_green/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      {/* Hero Section */}
      <section className='relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white'>
        <div className='absolute inset-0 bg-black/10'></div>
        <Container>
          <div className='max-w-6xl mx-auto text-center relative z-10'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 animate-bounce delay-300'>
              <Target className='w-12 h-12 text-white' />
            </div>
            <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-white to-shop_light_pink'>
                Our Story
              </span>
            </h1>
            <p className='text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed'>
              Revolutionizing e-commerce in Bangladesh since 2020 with innovation, trust, and exceptional customer experiences
            </p>
            
            {/* Animated Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
              {stats.map((stat, index) => (
                <div key={index} className={`text-center transform transition-all duration-1000 ${animatedStats[index] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                  <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300'>
                    <stat.icon className='w-8 h-8 mx-auto mb-3 text-shop_light_pink' />
                    <div className='text-3xl md:text-4xl font-bold mb-2'>{stat.value}</div>
                    <div className='text-sm opacity-80'>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
        
        {/* Floating Elements */}
        <div className='absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-700'></div>
        <div className='absolute bottom-10 left-10 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-1000'></div>
      </section>

      {/* Interactive Mission Section */}
      <section id='mission' className='py-24 px-4 sm:px-6 lg:px-8 bg-white relative'>
        <Container>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-shop_dark_green to-shop_light_green rounded-3xl mb-8 shadow-2xl animate-pulse'>
                <Sparkles className='w-10 h-10 text-white' />
              </div>
              <h2 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
                Our <span className='text-shop_dark_green'>Mission</span> & Vision
              </h2>
              <p className='text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
                To revolutionize online shopping in Bangladesh by combining cutting-edge technology with 
                exceptional customer service, creating seamless experiences that delight and inspire.
              </p>
            </div>
            
            {/* Tab Navigation */}
            <div className='flex justify-center mb-12'>
              <div className='bg-gray-100 rounded-2xl p-1 inline-flex'>
                {['mission', 'vision', 'values'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-white text-shop_dark_green shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className='bg-gradient-to-r from-shop_light_bg to-shop_light_pink rounded-3xl p-12 shadow-2xl'>
              {activeTab === 'mission' && (
                <div className='text-center'>
                  <Heart className='w-16 h-16 mx-auto mb-6 text-shop_dark_green' />
                  <h3 className='text-3xl font-bold text-gray-900 mb-6'>Customer-Centric Excellence</h3>
                  <p className='text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto'>
                    Every decision we make is centered around providing the best possible shopping experience 
                    for our valued customers across Bangladesh.
                  </p>
                </div>
              )}
              {activeTab === 'vision' && (
                <div className='text-center'>
                  <TrendingUp className='w-16 h-16 mx-auto mb-6 text-shop_dark_green' />
                  <h3 className='text-3xl font-bold text-gray-900 mb-6'>Digital Innovation Leader</h3>
                  <p className='text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto'>
                    To become Bangladesh's most trusted e-commerce platform through continuous innovation, 
                    quality products, and exceptional service.
                  </p>
                </div>
              )}
              {activeTab === 'values' && (
                <div className='text-center'>
                  <Shield className='w-16 h-16 mx-auto mb-6 text-shop_dark_green' />
                  <h3 className='text-3xl font-bold text-gray-900 mb-6'>Trust & Integrity</h3>
                  <p className='text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto'>
                    Building lasting relationships through transparency, quality, and unwavering commitment 
                    to customer satisfaction.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Modern Services Section */}
      <section className='py-24 px-4 sm:px-6 lg:px-8 bg-white'>
        <Container>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-shop_orange to-shop_light_pink rounded-3xl mb-8 shadow-2xl animate-pulse'>
                <Gift className='w-10 h-10 text-white' />
              </div>
              <h2 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
                Why Choose <span className='text-shop_orange'>Us</span>
              </h2>
              <p className='text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
                We're committed to providing the best shopping experience with these core services
              </p>
            </div>
            
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[
                {
                  icon: Truck,
                  title: 'Fast Delivery',
                  description: 'Quick and reliable delivery across Bangladesh within 24-48 hours',
                  color: 'from-shop_dark_green to-shop_light_green'
                },
                {
                  icon: Headphones,
                  title: '24/7 Support',
                  description: 'Round-the-clock customer service to help you with any queries',
                  color: 'from-shop_orange to-shop_light_pink'
                },
                {
                  icon: Shield,
                  title: 'Secure Payment',
                  description: 'Safe and secure payment methods with buyer protection',
                  color: 'from-shop_dark_green to-shop_orange'
                },
                {
                  icon: Award,
                  title: 'Quality Products',
                  description: 'Curated selection of high-quality products from trusted brands',
                  color: 'from-shop_light_pink to-shop_dark_green'
                },
                {
                  icon: Clock,
                  title: 'Easy Returns',
                  description: 'Hassle-free return policy within 7 days of purchase',
                  color: 'from-shop_orange to-shop_dark_green'
                },
                {
                  icon: Gift,
                  title: 'Exclusive Offers',
                  description: 'Special discounts and deals available only for our members',
                  color: 'from-shop_light_green to-shop_light_pink'
                }
              ].map((service, index) => (
                <div key={index} className='group relative'>
                  <div className='bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100'>
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-r ${service.color} opacity-5 rounded-full blur-2xl`}></div>
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className='w-8 h-8 text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 mb-4'>{service.title}</h3>
                    <p className='text-gray-600 leading-relaxed'>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className='py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white'>
        <Container>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8'>
                <Mail className='w-10 h-10 text-white' />
              </div>
              <h2 className='text-4xl md:text-6xl font-bold mb-6'>
                Get In <span className='text-shop_light_pink'>Touch</span>
              </h2>
              <p className='text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed'>
                We're here to help! Reach out to us through any of these channels
              </p>
            </div>
            
            <div className='grid md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              <div className='text-center group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300'>
                  <MapPin className='w-12 h-12 mx-auto mb-4 text-shop_light_pink' />
                  <h3 className='text-xl font-bold mb-3'>Visit Us</h3>
                  <p className='opacity-80 leading-relaxed'>
                    123 Business District<br />
                    Dhaka, Bangladesh 1000
                  </p>
                </div>
              </div>
              
              <div className='text-center group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300'>
                  <Phone className='w-12 h-12 mx-auto mb-4 text-shop_light_pink' />
                  <h3 className='text-xl font-bold mb-3'>Call Us</h3>
                  <p className='opacity-80 leading-relaxed'>
                    +880 1234-567890<br />
                    Mon-Sat: 9AM-9PM
                  </p>
                </div>
              </div>
              
              <div className='text-center group'>
                <div className='bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300'>
                  <Mail className='w-12 h-12 mx-auto mb-4 text-shop_light_pink' />
                  <h3 className='text-xl font-bold mb-3'>Email Us</h3>
                  <p className='opacity-80 leading-relaxed'>
                    support@shop.com<br />
                    24/7 Online Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Enhanced CTA Section */}
      <section className='py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-shop_dark_pink to-shop_light_pink text-shop_dark_green relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/5'></div>
        <div className='absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse'></div>
        <div className='absolute bottom-10 right-20 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse delay-500'></div>
        
        <Container>
          <div className='text-center max-w-5xl mx-auto relative z-10'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 animate-bounce'>
              <Heart className='w-12 h-12 text-white' />
            </div>
            <h2 className='text-4xl md:text-6xl font-bold mb-6'>
              Join Our <span className='text-black/50'>Shopping</span> Revolution
            </h2>
            <p className='text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto'>
              Experience the future of online shopping with exclusive benefits, 
              personalized recommendations, and member-only advantages.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-12'>
              <a 
                href="/shop" 
                className='bg-white text-shop_dark_green px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center group'
              >
                Start Shopping Now
                <ArrowRight className='w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform duration-300' />
              </a>
              <button className='border-3 border-white text-black/50 px-12 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-shop_dark_green transition-all duration-300 flex items-center group'>
                Learn More About Us
                <ArrowRight className='w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform duration-300' />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className='flex flex-wrap justify-center gap-6 text-sm'>
              <div className='bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center'>
                <Award className='w-5 h-5 mr-2' />
                <span className='font-semibold'>Trusted by 5M+ Users</span>
              </div>
              <div className='bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center'>
                <Shield className='w-5 h-5 mr-2' />
                <span className='font-semibold'>100% Secure</span>
              </div>
              <div className='bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center'>
                <Star className='w-5 h-5 mr-2' />
                <span className='font-semibold'>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default AboutPage
