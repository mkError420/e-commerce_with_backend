'use client';

import Container from '@/components/Container';
import React, { useState } from 'react';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: ''
  });

  const helpCategories = [
    {
      id: 'contact',
      title: 'Contact Support',
      icon: '💬',
      description: 'Get in touch with our support team',
      color: 'bg-shop-light-green'
    },
    {
      id: 'track',
      title: 'Track Order',
      icon: '📦',
      description: 'Check the status of your order',
      color: 'bg-shop-orange'
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: '🔄',
      description: 'Initiate a return or refund',
      color: 'bg-shop-light-green'
    },
    {
      id: 'account',
      title: 'Account Help',
      icon: '👤',
      description: 'Manage your account settings',
      color: 'bg-shop-orange'
    }
  ];

  const supportTopics = [
    {
      category: 'Order Issues',
      topics: [
        'Order not received',
        'Wrong item delivered',
        'Damaged product',
        'Late delivery',
        'Order cancellation'
      ]
    },
    {
      category: 'Payment & Billing',
      topics: [
        'Payment failed',
        'Refund status',
        'Billing inquiry',
        'Payment method issues',
        'Invoice request'
      ]
    },
    {
      category: 'Account & Security',
      topics: [
        'Login problems',
        'Password reset',
        'Account locked',
        'Update personal info',
        'Delete account'
      ]
    },
    {
      category: 'Product & Shipping',
      topics: [
        'Product information',
        'Shipping options',
        'Delivery time',
        'International shipping',
        'Product availability'
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

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
              Help Center
            </h1>
            <p className='text-xl opacity-90 max-w-2xl mx-auto'>
              We're here to help! Find answers and get the support you need.
            </p>
            <div className='mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3'>
              <div className='w-2 h-2 bg-shop-light-green rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>24/7 Customer Support</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className='py-16'>
        <div className='max-w-6xl mx-auto'>
          {/* Quick Actions */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
            {helpCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${
                  activeTab === category.id ? 'ring-4 ring-shop-light-green ring-opacity-50' : ''
                }`}
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  <span className='text-2xl'>{category.icon}</span>
                </div>
                <h3 className='text-lg font-bold text-shop-dark-green mb-2 text-center'>{category.title}</h3>
                <p className='text-gray-600 text-sm text-center'>{category.description}</p>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className='animate-in slide-in-from-top duration-300'>
                <div className='text-center mb-8'>
                  <div className='w-20 h-20 bg-shop-light-green rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-3xl'>💬</span>
                  </div>
                  <h2 className='text-3xl font-bold text-shop-dark-green mb-4'>Contact Our Support Team</h2>
                  <p className='text-gray-600 max-w-2xl mx-auto'>
                    Fill out the form below and our support team will get back to you within 24 hours.
                  </p>
                </div>

                <div className='grid lg:grid-cols-2 gap-8'>
                  <div>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                      <div>
                        <label className='block text-sm font-semibold text-shop-dark-green mb-2'>Name *</label>
                        <input
                          type='text'
                          name='name'
                          value={formData.name}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20'
                          placeholder='Your full name'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-shop-dark-green mb-2'>Email *</label>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20'
                          placeholder='your@email.com'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-shop-dark-green mb-2'>Order Number (Optional)</label>
                        <input
                          type='text'
                          name='orderNumber'
                          value={formData.orderNumber}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20'
                          placeholder='#ORD-12345'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-shop-dark-green mb-2'>Subject *</label>
                        <select
                          name='subject'
                          value={formData.subject}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20'
                          required
                        >
                          <option value=''>Select a topic</option>
                          <option value='order'>Order Issue</option>
                          <option value='payment'>Payment Problem</option>
                          <option value='account'>Account Help</option>
                          <option value='shipping'>Shipping Question</option>
                          <option value='return'>Return/Refund</option>
                          <option value='other'>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-shop-dark-green mb-2'>Message *</label>
                        <textarea
                          name='message'
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20'
                          placeholder='Describe your issue in detail...'
                          required
                        ></textarea>
                      </div>

                      <button
                        type='submit'
                        className='w-full bg-shop-dark-green text-white py-3 rounded-lg font-semibold hover:bg-shop-light-green transition-all duration-300 transform hover:scale-105'
                      >
                        Send Message
                      </button>
                    </form>
                  </div>

                  <div className='space-y-6'>
                    <div className='bg-shop-light-pink/30 rounded-xl p-6'>
                      <h3 className='font-bold text-shop-dark-green mb-4'>Other Ways to Reach Us</h3>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-shop-orange rounded-full flex items-center justify-center'>
                            <span className='text-white'>📞</span>
                          </div>
                          <div>
                            <h4 className='font-semibold text-shop-dark-green'>Phone Support</h4>
                            <p className='text-gray-600'>+880 1854-718767</p>
                            <p className='text-sm text-gray-500'>sat-fry, 9AM-6PM</p>
                          </div>
                        </div>

                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-shop-orange rounded-full flex items-center justify-center'>
                            <span className='text-white'>💬</span>
                          </div>
                          <div>
                            <h4 className='font-semibold text-shop-dark-green'>Live Chat</h4>
                            <p className='text-gray-600'>Available 24/7</p>
                            <a 
                              href="https://wa.me/01572491828?text=Hello! I need help with my order."
                              target="_blank"
                              rel="noopener noreferrer"
                              className='text-shop-light-green font-semibold hover:underline inline-flex items-center gap-1'
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M12.043 23.657a11.937 11.937 0 01-5.716-1.453L0 24l1.795-6.318A11.936 11.936 0 0112.043 0C18.665 0 24.043 5.378 24.043 12s-5.378 12-12 12zm6.848-9.795c-.375-.187-2.211-1.091-2.553-1.215-.342-.124-.59-.187-.839.187-.248.374-.962 1.215-1.18 1.463-.218.248-.436.279-.811.093-.375-.186-1.583-.584-3.016-1.861-1.115-.994-1.867-2.222-2.085-2.597-.218-.375-.023-.578.165-.764.169-.167.375-.435.562-.653.188-.218.249-.374.374-.623.124-.248.062-.466-.031-.653-.094-.187-.839-2.022-1.149-2.77-.302-.727-.608-.629-.839-.64-.218-.01-.467-.012-.716-.012-.249 0-.653.094-.995.466-.342.374-1.305 1.274-1.305 3.107 0 1.833 1.336 3.603 1.523 3.851.187.248 2.631 4.018 6.376 5.637.891.384 1.587.613 2.131.785.895.284 1.71.244 2.354.148.718-.104 2.211-.904 2.523-1.777.312-.873.312-1.62.218-1.777-.094-.156-.343-.249-.718-.435z"/>
                              </svg>
                              Chat on WhatsApp
                            </a>
                          </div>
                        </div>

                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-shop-orange rounded-full flex items-center justify-center'>
                            <span className='text-white'>✉️</span>
                          </div>
                          <div>
                            <h4 className='font-semibold text-shop-dark-green'>Email Support</h4>
                            <p className='text-gray-600'>mk.cse@gmail.com</p>
                            <p className='text-sm text-gray-500'>Response within 24 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='bg-gradient-to-r from-shop-dark-green to-shop-btn-dark-green rounded-xl p-6 text-white'>
                      <h3 className='font-bold mb-3'>Response Time</h3>
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span>Urgent Issues:</span>
                          <span className='font-semibold'>Within 2 hours</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>General Questions:</span>
                          <span className='font-semibold'>Within 12 hours</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Technical Issues:</span>
                          <span className='font-semibold'>Within 24 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Track Order Tab */}
            {activeTab === 'track' && (
              <div className='animate-in slide-in-from-top duration-300'>
                <div className='text-center mb-8'>
                  <div className='w-20 h-20 bg-shop-orange rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-3xl'>📦</span>
                  </div>
                  <h2 className='text-3xl font-bold text-shop-dark-green mb-4'>Track Your Order</h2>
                  <p className='text-gray-600 max-w-2xl mx-auto'>
                    Enter your order number to track the status of your shipment.
                  </p>
                </div>

                <div className='max-w-md mx-auto'>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-semibold text-shop-dark-green mb-2'>Order Number</label>
                      <input
                        type='text'
                        placeholder='#ORD-12345'
                        className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-orange focus:ring-2 focus:ring-shop-orange/20'
                      />
                    </div>
                    <button className='w-full bg-shop-orange text-white py-3 rounded-lg font-semibold hover:bg-shop-light-green transition-all duration-300 transform hover:scale-105'>
                      Track Order
                    </button>
                  </div>

                  <div className='mt-8 text-center'>
                    <p className='text-gray-600 mb-4'>Can't find your order number?</p>
                    <button className='text-shop-light-green font-semibold hover:underline'>
                      Check your email for order confirmation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Returns Tab */}
            {activeTab === 'returns' && (
              <div className='animate-in slide-in-from-top duration-300'>
                <div className='text-center mb-8'>
                  <div className='w-20 h-20 bg-shop-light-green rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-3xl'>🔄</span>
                  </div>
                  <h2 className='text-3xl font-bold text-shop-dark-green mb-4'>Returns & Refunds</h2>
                  <p className='text-gray-600 max-w-2xl mx-auto'>
                    Start a return or check the status of your refund.
                  </p>
                </div>

                <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
                  <div className='bg-shop-light-pink/30 rounded-xl p-6'>
                    <h3 className='font-bold text-shop-dark-green mb-4'>Start a Return</h3>
                    <p className='text-gray-600 mb-4'>
                      Log into your account to initiate a return request.
                    </p>
                    <button className='w-full bg-shop-light-green text-white py-3 rounded-lg font-semibold hover:bg-shop-dark-green transition-all duration-300'>
                      Initiate Return
                    </button>
                  </div>

                  <div className='bg-shop-light-pink/30 rounded-xl p-6'>
                    <h3 className='font-bold text-shop-dark-green mb-4'>Check Refund Status</h3>
                    <p className='text-gray-600 mb-4'>
                      Enter your return ID to check the status.
                    </p>
                    <input
                      type='text'
                      placeholder='Return ID'
                      className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shop-light-green focus:ring-2 focus:ring-shop-light-green/20 mb-4'
                    />
                    <button className='w-full bg-shop-orange text-white py-3 rounded-lg font-semibold hover:bg-shop-light-green transition-all duration-300'>
                      Check Status
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Help Tab */}
            {activeTab === 'account' && (
              <div className='animate-in slide-in-from-top duration-300'>
                <div className='text-center mb-8'>
                  <div className='w-20 h-20 bg-shop-orange rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-3xl'>👤</span>
                  </div>
                  <h2 className='text-3xl font-bold text-shop-dark-green mb-4'>Account Help</h2>
                  <p className='text-gray-600 max-w-2xl mx-auto'>
                    Manage your account settings and get help with login issues.
                  </p>
                </div>

                <div className='grid md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
                  <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
                    <h3 className='font-bold text-shop-dark-green mb-3'>Reset Password</h3>
                    <p className='text-gray-600 mb-4'>Forgot your password? Reset it easily.</p>
                    <button className='text-shop-light-green font-semibold hover:underline'>
                      Reset Password →
                    </button>
                  </div>

                  <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
                    <h3 className='font-bold text-shop-dark-green mb-3'>Update Profile</h3>
                    <p className='text-gray-600 mb-4'>Change your personal information.</p>
                    <button className='text-shop-light-green font-semibold hover:underline'>
                      Update Profile →
                    </button>
                  </div>

                  <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
                    <h3 className='font-bold text-shop-dark-green mb-3'>Order History</h3>
                    <p className='text-gray-600 mb-4'>View your past orders and downloads.</p>
                    <button className='text-shop-light-green font-semibold hover:underline'>
                      View Orders →
                    </button>
                  </div>

                  <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
                    <h3 className='font-bold text-shop-dark-green mb-3'>Delete Account</h3>
                    <p className='text-gray-600 mb-4'>Permanently delete your account.</p>
                    <button className='text-shop-orange font-semibold hover:underline'>
                      Delete Account →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Common Topics */}
          <div className='mt-12'>
            <h2 className='text-2xl font-bold text-shop-dark-green mb-8 text-center'>Common Help Topics</h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {supportTopics.map((category, index) => (
                <div key={index} className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300'>
                  <h3 className='font-bold text-shop-dark-green mb-4'>{category.category}</h3>
                  <ul className='space-y-2'>
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>
                        <button className='text-gray-600 hover:text-shop-light-green text-sm text-left w-full'>
                          {topic}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className='mt-12 bg-shop-dark-green rounded-2xl p-8 text-white text-center border-2 border-shop-light-green shadow-xl'>
            <h3 className='text-2xl font-bold mb-4 text-shop_dark_green'>Need Immediate Help?</h3>
            <p className='mb-6 text-shop_orange max-w-2xl mx-auto text-lg'>
              For urgent issues, call our emergency support line available 24/7.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <div className='bg-white text-shop_dark_green px-8 py-4 rounded-lg font-bold text-xl shadow-lg border-2 border-shop-light-green'>
                🚨 +880 1854-718767
              </div>
              <a 
                href="https://wa.me/01572491828?text=URGENT: I need immediate help with my order!"
                target="_blank"
                rel="noopener noreferrer"
                className='bg-white text-shop_dark_green px-8 py-4 rounded-lg font-bold hover:bg-shop-light-green hover:text-shop_orange transition-all duration-300 shadow-lg border-2 border-shop-light-green inline-flex items-center gap-2'
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12.043 23.657a11.937 11.937 0 01-5.716-1.453L0 24l1.795-6.318A11.936 11.936 0 0112.043 0C18.665 0 24.043 5.378 24.043 12s-5.378 12-12 12zm6.848-9.795c-.375-.187-2.211-1.091-2.553-1.215-.342-.124-.59-.187-.839.187-.248.374-.962 1.215-1.18 1.463-.218.248-.436.279-.811.093-.375-.186-1.583-.584-3.016-1.861-1.115-.994-1.867-2.222-2.085-2.597-.218-.375-.023-.578.165-.764.169-.167.375-.435.562-.653.188-.218.249-.374.374-.623.124-.248.062-.466-.031-.653-.094-.187-.839-2.022-1.149-2.77-.302-.727-.608-.629-.839-.64-.218-.01-.467-.012-.716-.012-.249 0-.653.094-.995.466-.342.374-1.305 1.274-1.305 3.107 0 1.833 1.336 3.603 1.523 3.851.187.248 2.631 4.018 6.376 5.637.891.384 1.587.613 2.131.785.895.284 1.71.244 2.354.148.718-.104 2.211-.904 2.523-1.777.312-.873.312-1.62.218-1.777-.094-.156-.343-.249-.718-.435z"/>
                </svg>
                Emergency Chat
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HelpPage;
