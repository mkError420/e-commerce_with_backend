'use client';

import Container from '@/components/Container';
import React, { useState } from 'react';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All FAQs', icon: '📚' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'shipping', name: 'Shipping', icon: '🚚' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'returns', name: 'Returns', icon: '🔄' },
    { id: 'account', name: 'Account', icon: '👤' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'Placing an order is simple! Browse our products, select the items you want, add them to your cart, and proceed to checkout. Follow the steps to enter your shipping information and payment details to complete your purchase.',
      popular: true
    },
    {
      id: 2,
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 2 hours of placing it. After this time, the order enters our fulfillment process and cannot be changed. Please contact our customer service team immediately if you need to make changes.',
      popular: false
    },
    {
      id: 3,
      category: 'shipping',
      question: 'What are the shipping options?',
      answer: 'We offer several shipping options: Standard (5-7 business days), Express (2-3 business days), and Overnight (1 business day). Shipping costs vary based on your location and selected method. Free shipping is available for orders over 150 TAKA.',
      popular: true
    },
    {
      id: 4,
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping times and costs vary by destination. You can check if we ship to your country during the checkout process.',
      popular: false
    },
    {
      id: 5,
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely through our encrypted payment gateway.',
      popular: true
    },
    {
      id: 6,
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use industry-standard SSL encryption to protect your payment information. We are PCI-DSS compliant and never store your credit card details on our servers.',
      popular: false
    },
    {
      id: 7,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for most items. Products must be unused, in original condition, and in original packaging. Some items like personalized products or final sale items cannot be returned.',
      popular: true
    },
    {
      id: 8,
      category: 'returns',
      question: 'How do I initiate a return?',
      answer: 'To initiate a return, log into your account, go to "My Orders," select the order you want to return, and click "Return Items." Follow the instructions to print a return label and send the item back.',
      popular: false
    },
    {
      id: 9,
      category: 'account',
      question: 'Do I need an account to shop?',
      answer: 'No, you can shop as a guest. However, creating an account allows you to track orders, save addresses, view order history, and enjoy a faster checkout process.',
      popular: false
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
      popular: false
    },
    {
      id: 11,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history, or by using our "Track Order" page with your order number.',
      popular: true
    },
    {
      id: 12,
      category: 'shipping',
      question: 'What if my package is lost or damaged?',
      answer: 'If your package is lost or arrives damaged, please contact our customer service team within 48 hours of delivery. We\'ll work with the shipping carrier to resolve the issue and arrange for a replacement or refund.',
      popular: false
    }
  ];

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categoryFilteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const filteredFAQs = searchQuery
    ? categoryFilteredFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryFilteredFAQs;

  return (
    <div className='min-h-screen bg-gradient-to-br from-shop-light-pink via-white to-shop-light-pink/30'>
      {/* Header Section */}
      <div className='bg-shop_light_pink text-shop_dark_green py-16 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='absolute top-0 right-0 w-64 h-64 bg-shop-light-green/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-shop-orange/10 rounded-full blur-3xl'></div>
        
        <Container className='relative z-10'>
          <div className='text-center'>
            <h1 className='text-5xl md:text-6xl font-bold mb-4 tracking-tight'>
              Frequently Asked Questions
            </h1>
            <p className='text-xl opacity-90 max-w-2xl mx-auto'>
              Find answers to common questions about our products and services
            </p>
            <div className='mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3'>
              <div className='w-2 h-2 bg-shop-light-green rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>{faqs.length} FAQs Available</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className='py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Search Bar */}
          <div className='bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-shop-light-green/20'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-shop-light-green rounded-full flex items-center justify-center flex-shrink-0'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className='flex-1'>
                <input 
                  type="text" 
                  placeholder='Search FAQs...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20'
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className='mb-8'>
            <div className='flex flex-wrap gap-3 justify-center'>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-shop-dark-green text-shop-orange shadow-lg transform scale-105'
                      : 'bg-white text-shop-dark-green border-2 border-shop-light-green hover:bg-shop-light-green hover:text-shop-dark-green hover:shadow-lg hover:scale-105 hover:-translate-y-1'
                  }`}
                >
                  <span className='mr-2'>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Popular FAQs */}
          {activeCategory === 'all' && !searchQuery && (
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-shop-dark-green mb-6 text-center'>🔥 Popular Questions</h2>
              <div className='grid md:grid-cols-2 gap-4'>
                {faqs.filter(faq => faq.popular).map(faq => (
                  <div 
                    key={faq.id}
                    onClick={() => toggleExpanded(faq.id)}
                    className='bg-gradient-to-r from-shop-light-green/10 to-shop-orange/10 rounded-xl p-6 border-l-4 border-shop-light-green cursor-pointer hover:shadow-lg transition-all duration-300'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-shop-orange rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-white text-sm font-bold'>!</span>
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-bold text-shop-dark-green mb-2'>{faq.question}</h3>
                        {expandedItems.includes(faq.id) && (
                          <p className='text-gray-600 leading-relaxed animate-in slide-in-from-top duration-300'>
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All FAQs */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-shop-dark-green mb-6 text-center'>
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : activeCategory === 'all'
                  ? 'All Questions'
                  : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            {filteredFAQs.map(faq => (
              <div 
                key={faq.id}
                onClick={() => toggleExpanded(faq.id)}
                className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300'
              >
                <div className='p-6'>
                  <div className='flex items-start gap-4'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      faq.popular ? 'bg-shop-orange' : 'bg-shop-light-green'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={expandedItems.includes(faq.id) ? "M20 12H4" : "M12 4v16m8-8H4"} 
                        />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-start justify-between gap-4'>
                        <h3 className='font-bold text-shop-dark-green text-lg'>{faq.question}</h3>
                        {faq.popular && (
                          <span className='bg-shop-orange text-white text-xs px-2 py-1 rounded-full font-semibold'>
                            POPULAR
                          </span>
                        )}
                      </div>
                      {expandedItems.includes(faq.id) && (
                        <div className='mt-4 text-gray-600 leading-relaxed animate-in slide-in-from-top duration-300'>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help Section */}
          <div className='mt-12 bg-gradient-to-r from-shop-dark-green to-shop-btn-dark-green rounded-2xl p-8 text-white text-center'>
            <h3 className='text-2xl font-bold mb-4'>Still Need Help?</h3>
            <p className='mb-6 opacity-90'>
              Can't find what you're looking for? Our customer support team is here to help!
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white text-shop-dark-green px-6 py-3 rounded-lg font-semibold hover:bg-shop-light-green hover:text-white transition-all duration-300'>
                Contact Support
              </button>
              <button className='border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-shop-dark-green transition-all duration-300'>
                Live Chat
              </button>
            </div>
            <div className='mt-6 flex justify-center gap-8 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-shop-light-green rounded-full animate-pulse'></div>
                <span>24/7 Support</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-shop-light-green rounded-full animate-pulse'></div>
                <span>Quick Response</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-shop-light-green rounded-full animate-pulse'></div>
                <span>Expert Help</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQPage;
