import Container from '@/components/Container';
import React from 'react';

const PrivacyPage = () => {
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
              Privacy Policy
            </h1>
            <p className='text-xl opacity-90 max-w-2xl mx-auto'>
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <div className='mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3'>
              <div className='w-2 h-2 bg-shop-light-green rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className='py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Introduction Card */}
          <div className='bg-white rounded-2xl shadow-xl p-8 mb-8 border border-shop-light-green/20 hover:shadow-2xl transition-shadow duration-300'>
            <div className='flex items-start gap-4 mb-6'>
              <div className='w-12 h-12 bg-shop-light-green rounded-full flex items-center justify-center flex-shrink-0'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className='text-2xl font-bold text-shop-dark-green mb-3'>Our Commitment to Privacy</h2>
                <p className='text-gray-600 leading-relaxed'>
                  At MK Online Shop, we are committed to protecting your personal information and ensuring your privacy. 
                  This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website and services.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
          <div className='space-y-6'>
            {/* Section 1 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-white rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                Information We Collect
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We collect several types of information to provide and improve our services:
              </p>
              <div className='space-y-3'>
                <div className='bg-shop-light-pink/30 rounded-lg p-4'>
                  <h4 className='font-semibold text-shop-dark-green mb-2'>Personal Information</h4>
                  <ul className='list-disc list-inside space-y-1 text-gray-600 text-sm'>
                    <li>Name and contact details</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information</li>
                    <li>Email address and phone number</li>
                  </ul>
                </div>
                <div className='bg-shop-light-pink/30 rounded-lg p-4'>
                  <h4 className='font-semibold text-shop-dark-green mb-2'>Technical Information</h4>
                  <ul className='list-disc list-inside space-y-1 text-gray-600 text-sm'>
                    <li>IP address and browser type</li>
                    <li>Device information</li>
                    <li>Cookies and tracking data</li>
                    <li>Pages visited and time spent</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-orange hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-orange text-white rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                How We Use Your Information
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We use your information to provide, maintain, and improve our services:
              </p>
              <ul className='space-y-2'>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-shop-light-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='text-gray-600'>Process and fulfill your orders</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-shop-light-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='text-gray-600'>Provide customer support</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-shop-light-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='text-gray-600'>Send order updates and marketing communications</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-shop-light-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='text-gray-600'>Improve our website and services</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-white rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                Cookies and Tracking
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <div className='bg-shop-light-pink/50 rounded-lg p-4 mt-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green mb-2'>Essential Cookies</h4>
                    <p className='text-sm text-gray-600'>Required for basic website functionality</p>
                  </div>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green mb-2'>Analytics Cookies</h4>
                    <p className='text-sm text-gray-600'>Help us understand how you use our site</p>
                  </div>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green mb-2'>Marketing Cookies</h4>
                    <p className='text-sm text-gray-600'>Used to personalize your experience</p>
                  </div>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green mb-2'>Preference Cookies</h4>
                    <p className='text-sm text-gray-600'>Remember your settings and preferences</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-orange hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-orange text-white rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                Data Protection
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className='list-disc list-inside space-y-2 text-gray-600 ml-4'>
                <li>SSL encryption for all data transmissions</li>
                <li>Secure payment processing through trusted providers</li>
                <li>Regular security audits and updates</li>
                <li>Employee access restrictions and training</li>
                <li>Compliance with data protection regulations</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-white rounded-full flex items-center justify-center text-sm font-bold'>5</span>
                Your Rights
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                You have the following rights regarding your personal information:
              </p>
              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-shop-orange rounded-full flex items-center justify-center flex-shrink-0'>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green'>Access</h4>
                    <p className='text-sm text-gray-600'>Request access to your personal data</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-shop-orange rounded-full flex items-center justify-center flex-shrink-0'>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green'>Correction</h4>
                    <p className='text-sm text-gray-600'>Update or correct inaccurate information</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-shop-orange rounded-full flex items-center justify-center flex-shrink-0'>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='font-semibold text-shop-dark-green'>Deletion</h4>
                    <p className='text-sm text-gray-600'>Request deletion of your personal data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-orange hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-orange text-white rounded-full flex items-center justify-center text-sm font-bold'>6</span>
                Third-Party Sharing
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We may share your information with trusted third parties only in specific circumstances:
              </p>
              <ul className='list-disc list-inside space-y-2 text-gray-600 ml-4'>
                <li>Payment processors for transaction completion</li>
                <li>Shipping partners for order fulfillment</li>
                <li>Analytics providers for website improvement</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <div className='bg-shop-light-pink/50 rounded-lg p-4 mt-4'>
                <p className='text-sm text-gray-700'>
                  <strong>Note:</strong> We never sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-white rounded-full flex items-center justify-center text-sm font-bold'>7</span>
                Policy Updates
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className='mt-12 bg-gradient-to-r from-shop-dark-green to-shop-btn-dark-green rounded-2xl p-8 text-white text-center'>
            <h3 className='text-2xl font-bold mb-4'>Privacy Questions?</h3>
            <p className='mb-6 opacity-90'>
              If you have any questions about this Privacy Policy or want to exercise your rights, please contact us.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white text-shop-dark-green px-6 py-3 rounded-lg font-semibold hover:bg-shop-light-green hover:text-white transition-all duration-300'>
                Privacy Officer
              </button>
              <button className='border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-shop-dark-green transition-all duration-300'>
                Data Request
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPage;
