import Container from '@/components/Container';
import React from 'react';

const TermsPage = () => {
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
              Terms & Conditions
            </h1>
            <p className='text-xl opacity-90 max-w-2xl mx-auto'>
              Please read these terms carefully before using our services
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className='text-2xl font-bold text-shop-dark-green mb-3'>Welcome to MK Online Shop</h2>
                <p className='text-gray-600 leading-relaxed'>
                  By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className='space-y-6'>
            {/* Section 1 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                Use License
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                Permission is granted to temporarily download one copy of the materials on MK Online Shop for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this 
                license you may not:
              </p>
              <ul className='list-disc list-inside space-y-2 text-gray-600 ml-4'>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-orange hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-orange text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                Product Information
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We strive to be as accurate as possible in the descriptions of our products. However, we do not warrant that 
                product descriptions, colors, information, or other content of the website are accurate, complete, reliable, 
                current, or error-free.
              </p>
              <div className='bg-shop-light-pink/50 rounded-lg p-4 mt-4'>
                <p className='text-sm text-gray-700'>
                  <strong>Note:</strong> Product prices and availability are subject to change without notice.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                Payment & Billing
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                All transactions are processed through secure payment gateways. By providing your payment information, 
                you represent that you are authorized to use the payment method and you authorize us to charge the total 
                amount to your payment method.
              </p>
              <ul className='list-disc list-inside space-y-2 text-gray-600 ml-4'>
                <li>All prices are displayed in Taka (BDT)</li>
                <li>Shipping charges may apply based on your location</li>
                <li>Payment must be received before order processing</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-orange hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-orange text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                Shipping & Delivery
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We aim to process and ship orders within [timeframe]. Delivery times may vary based on your location 
                and product availability. Risk of loss and title for all merchandise ordered on this site pass to you 
                when the merchandise is delivered to the shipping carrier.
              </p>
            </div>

            {/* Section 5 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>5</span>
                Returns & Refunds
              </h3>
              <p className='text-gray-600 leading-relaxed mb-3'>
                We offer a 7-day return policy for most items. Products must be unused, in the same condition 
                that you received it, and in the original packaging. Some restrictions may apply.
              </p>
              <div className='bg-shop-light-pink/50 rounded-lg p-4 mt-4'>
                <p className='text-sm text-gray-700'>
                  <strong>Important:</strong> Shipping costs for returns are non-refundable unless the item is defective or incorrect.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-orange hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-orange text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>6</span>
                Privacy Policy
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Your privacy is important to us. Please review our Privacy Policy, which also governs the site and informs 
                users of our data collection practices.
              </p>
            </div>

            {/* Section 7 */}
            <div className='bg-white rounded-xl shadow-lg p-6 border-l-4 border-shop-light-green hover:shadow-xl transition-all duration-300'>
              <h3 className='text-xl font-bold text-shop-dark-green mb-4 flex items-center gap-3'>
                <span className='w-8 h-8 bg-shop-light-green text-shop-dark-green rounded-full flex items-center justify-center text-sm font-bold'>7</span>
                Limitation of Liability
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                In no event shall MK Online Shop or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on our website.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className='mt-12 bg-gradient-to-r from-shop-dark-green to-shop-btn-dark-green rounded-2xl p-8 text-white text-center'>
            <h3 className='text-2xl font-bold mb-4'>Questions About Our Terms?</h3>
            <p className='mb-6 opacity-90'>
              If you have any questions about these Terms & Conditions, please contact us.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white text-shop-dark-green px-6 py-3 rounded-lg font-semibold hover:bg-shop-light-green hover:text-white transition-all duration-300'>
                Contact Support
              </button>
              <button className='border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-shop-dark-green transition-all duration-300'>
                Email Us
              </button>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Last Updated Notice */}
      <div className='bg-gray-100 border-t border-gray-200 py-4'>
        <Container>
          <p className='text-center text-sm text-gray-600'>
            Last Updated: 2/24/2026
          </p>
        </Container>
      </div>
    </div>
  );
};

export default TermsPage;
