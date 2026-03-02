'use client'

import React, { useState } from 'react'
import Container from '@/components/Container'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Shield,
  Zap,
  Headphones,
  Globe,
  Award,
  Sparkles,
  Gift,
  Truck
} from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: '',
    priority: 'normal'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const contactChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@shop.com',
      description: 'Response within 2 hours',
      color: 'from-shop_dark_green to-shop_light_green',
      bgColor: 'bg-shop_light_bg'
    },
    {
      icon: Phone,
      title: 'Priority Hotline',
      value: '+880 1234-567890',
      description: 'Available 24/7 for emergencies',
      color: 'from-shop_orange to-shop_light_pink',
      bgColor: 'bg-shop_light_pink/20'
    },
    {
      icon: Headphones,
      title: 'Live Chat',
      value: 'Chat with experts now',
      description: 'Instant support during business hours',
      color: 'from-shop_dark_green to-shop_orange',
      bgColor: 'bg-shop_light_green/20'
    },
    {
      icon: MapPin,
      title: 'Global Offices',
      value: 'Dhaka, Chittagong, Sylhet',
      description: 'Strategic locations across Bangladesh',
      color: 'from-shop_light_pink to-shop_dark_green',
      bgColor: 'bg-shop_orange/20'
    }
  ]

  const supportTopics = [
    {
      icon: Globe,
      title: 'Order & Shipping',
      questions: ['Track my order', 'Shipping delays', 'International delivery', 'Package lost']
    },
    {
      icon: Shield,
      title: 'Returns & Refunds',
      questions: ['Return policy', 'Refund status', 'Exchange items', 'Damaged goods']
    },
    {
      icon: Users,
      title: 'Account & Billing',
      questions: ['Login issues', 'Payment problems', 'Invoice requests', 'Account settings']
    },
    {
      icon: Award,
      title: 'Product Support',
      questions: ['Product compatibility', 'Technical issues', 'Warranty claims', 'User guides']
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-shop_dark_green/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-shop_orange/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-shop_light_green/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      {/* Modern Hero Section */}
      <section className='relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white'>
        <div className='absolute inset-0 bg-black/10'></div>
        <Container>
          <div className='max-w-6xl mx-auto text-center relative z-10'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 animate-bounce delay-300'>
              <MessageCircle className='w-12 h-12 text-white' />
            </div>
            <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-white to-shop_light_pink'>
                Get in Touch
              </span>
            </h1>
            <p className='text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed'>
              We're here to help! Reach out to us through any channel for expert support
            </p>
            <div className='flex flex-wrap gap-4 justify-center'>
              <span className='px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center'>
                <Mail className='w-4 h-4 mr-2' />2-Hour Response
              </span>
              <span className='px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center'>
                <Phone className='w-4 h-4 mr-2' />24/7 Support
              </span>
              <span className='px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center'>
                <Headphones className='w-4 h-4 mr-2' />Live Chat
              </span>
              <span className='px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center'>
                <Star className='w-4 h-4 mr-2' />99% Satisfaction
              </span>
            </div>
          </div>
        </Container>
        
        {/* Floating Elements */}
        <div className='absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-700'></div>
        <div className='absolute bottom-10 left-10 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-1000'></div>
      </section>

      {/* Contact Form and Quick Help */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-white'>
        <Container>
          <div className='grid lg:grid-cols-3 gap-12'>
            {/* Contact Form */}
            <div className='lg:col-span-2'>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-shop_dark_green to-shop_light_green rounded-3xl mb-6 shadow-2xl animate-pulse'>
                  <Send className='w-10 h-10 text-white' />
                </div>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  Send Us a Message
                </h2>
                <p className='text-gray-600 mb-8 leading-relaxed'>
                  Fill out the form below and our team will respond within 2 hours
                </p>
              </div>
              
              {isSubmitted ? (
                <div className='bg-gradient-to-r from-shop_light_green to-shop_light_pink border border-shop_dark_green/20 rounded-3xl p-12 text-center shadow-2xl'>
                  <CheckCircle className='w-20 h-20 mx-auto mb-6 text-shop_dark_green' />
                  <h3 className='text-3xl font-bold text-shop_dark_green mb-4'>
                    Message Received!
                  </h3>
                  <p className='text-shop_dark_green text-lg leading-relaxed'>
                    Thank you for contacting us. Our support team will get back to you within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-gray-700 font-bold mb-3 text-lg'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className='w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-shop_dark_green focus:border-transparent transition-all duration-200 text-lg'
                        placeholder='John Doe'
                      />
                    </div>
                    <div>
                      <label className='block text-gray-700 font-bold mb-3 text-lg'>
                        Email Address *
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-shop_dark_green focus:border-transparent transition-all duration-200 text-lg'
                        placeholder='john@gmail.com'
                      />
                    </div>
                  </div>
                  
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-gray-700 font-bold mb-3 text-lg'>
                        Topic
                      </label>
                      <select
                        name='subject'
                        value={formData.subject}
                        onChange={handleInputChange}
                        className='w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-shop_dark_green focus:border-transparent transition-all duration-200 text-lg'
                      >
                        <option value=''>Select a topic</option>
                        <option value='order'>Order Issue</option>
                        <option value='return'>Return Request</option>
                        <option value='product'>Product Question</option>
                        <option value='technical'>Technical Support</option>
                        <option value='billing'>Billing Inquiry</option>
                        <option value='general'>General Question</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-gray-700 font-bold mb-3 text-lg'>
                        Priority
                      </label>
                      <select
                        name='priority'
                        value={formData.priority}
                        onChange={handleInputChange}
                        className='w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-shop_dark_green focus:border-transparent transition-all duration-200 text-lg'
                      >
                        <option value='low'>Low Priority</option>
                        <option value='normal'>Normal Priority</option>
                        <option value='high'>High Priority</option>
                        <option value='urgent'>Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className='block text-gray-700 font-bold mb-3 text-lg'>
                      Order Number (if applicable)
                    </label>
                    <input
                      type='text'
                      name='orderNumber'
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className='w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-shop_dark_green focus:border-transparent transition-all duration-200 text-lg'
                      placeholder='#12345'
                    />
                  </div>
                  
                  <div>
                    <label className='block text-gray-700 font-bold mb-3 text-lg'>
                      Message *
                    </label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className='w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-shop_dark_green focus:border-transparent transition-all duration-200 resize-none text-lg'
                      placeholder='Tell us how we can help you...'
                    />
                  </div>
                  
                  <button
                    type='submit'
                    className='w-full bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white py-4 rounded-xl font-bold text-lg hover:from-shop_btn_dark_green hover:to-shop_dark_green transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-2xl'
                  >
                    Send Message
                    <Send className='w-6 h-6 ml-3' />
                  </button>
                </form>
              )}
            </div>

            {/* Quick Help */}
            <div>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-shop_orange to-shop_light_pink rounded-3xl mb-6 shadow-2xl animate-pulse'>
                  <Zap className='w-10 h-10 text-white' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                  Quick Help
                </h2>
                <p className='text-gray-600 leading-relaxed'>
                  Find answers instantly
                </p>
              </div>
              
              <div className='space-y-4'>
                {supportTopics.map((topic, index) => (
                  <details key={index} className='bg-gradient-to-br from-shop_light_bg to-white rounded-3xl p-6 cursor-pointer hover:from-shop_light_pink hover:to-white transition-all duration-200 group border border-gray-100'>
                    <summary className='flex items-center justify-between font-bold text-gray-900 list-none text-lg'>
                      <div className='flex items-center'>
                        <topic.icon className='w-6 h-6 mr-3 text-shop_dark_green' />
                        {topic.title}
                      </div>
                      <HelpCircle className='w-5 h-5 text-gray-400 flex-shrink-0' />
                    </summary>
                    <div className='mt-4 space-y-2'>
                      {topic.questions.map((question, qIndex) => (
                        <div key={qIndex} className='flex items-center text-gray-700 hover:text-shop_dark_green transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-shop_light_pink/20'>
                          <ArrowRight className='w-4 h-4 mr-2 text-gray-400' />
                          {question}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
              
              <div className='mt-8 text-center'>
                <a
                href='/help'
                className='text-shop_dark_green font-bold text-lg hover:text-shop_btn_dark_green transition-colors flex items-center justify-center mx-auto group'
              >
                Browse Help Center
                <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300' />
              </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-shop_light_bg to-shop_light_pink'>
        <Container>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-shop_dark_green to-shop_orange rounded-3xl mb-8 shadow-2xl animate-pulse'>
              <Shield className='w-12 h-12 text-white' />
            </div>
            <h2 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              Why Choose Our <span className='text-shop_dark_green'>Support</span>
            </h2>
            <p className='text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
              Experience the difference with our award-winning customer service
            </p>
          </div>
          
          <div className='grid md:grid-cols-3 gap-6 md:gap-8'>
            {[
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Highly trained professionals ready to assist with any question or concern.',
                gradient: 'from-shop_dark_green to-shop_light_green',
                stat: '24/7 Available'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Average response time under 2 hours for all inquiries.',
                gradient: 'from-shop_orange to-shop_light_pink',
                stat: '2-Hour Response'
              },
              {
                icon: Star,
                title: 'Satisfaction Guaranteed',
                description: 'We stand behind our service with comprehensive guarantees and follow-up.',
                gradient: 'from-shop_light_pink to-shop_dark_green',
                stat: '99% Satisfaction'
              }
            ].map((benefit, index) => (
              <div key={index} className='text-center group h-full'>
                <div className='bg-white p-6 md:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 h-full flex flex-col'>
                  <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className='w-8 h-8 md:w-10 md:h-10 text-white' />
                  </div>
                  <h3 className='text-lg md:text-xl font-bold text-gray-900 mb-4'>
                    {benefit.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed text-sm md:text-lg mb-4 flex-grow'>
                    {benefit.description}
                  </p>
                  <div className='inline-block px-3 py-2 bg-gradient-to-r from-shop_light_bg to-shop_light_pink text-shop_dark_green rounded-full font-bold text-sm'>
                    {benefit.stat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Live Chat CTA */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse'></div>
        <div className='absolute bottom-10 left-20 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-1000'></div>
        <Container>
          <div className='text-center max-w-5xl mx-auto relative z-10'>
            <div className='flex items-center justify-center mb-8'>
              <MessageCircle className='w-16 h-16 mr-4' />
              <h2 className='text-4xl font-bold'>
                Need Immediate Assistance?
              </h2>
            </div>
            <p className='text-xl md:text-2xl mb-10 opacity-90 leading-relaxed max-w-4xl mx-auto'>
              Start a live chat with our expert support team for instant help
            </p>
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
              <a
                href='https://wa.me/8801572491828?text=Hello! I need immediate assistance with my order.'
                target='_blank'
                rel='noopener noreferrer'
                className='bg-white text-shop_dark_green px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center group'
              >
                <div className='w-3 h-3 bg-shop_orange rounded-full mr-3 animate-pulse'></div>
                Start Live Chat
                <ArrowRight className='w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300' />
              </a>
              <div className='text-white/80 text-lg'>
                Average wait time: <span className='text-white font-bold'>Under 30 seconds</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default ContactPage
