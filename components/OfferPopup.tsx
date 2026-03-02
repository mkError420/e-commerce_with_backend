'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const OfferPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only show popup on home page
    if (pathname === '/') {
      setIsVisible(true);
      
      // Auto-hide after 20 seconds
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleShopNow = () => {
    setIsVisible(false);
    router.push('/shop');
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 p-2 sm:p-4'>
      <div className='relative bg-white rounded-2xl shadow-2xl w-[95vw] max-w-md animate-in zoom-in duration-300 overflow-hidden max-h-[85vh] overflow-y-auto'>
        {/* Close Button */}
        <button
          onClick={handleClose}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleClose();
          }}
          className='absolute top-3 right-3 w-12 h-12 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 z-50 group sm:top-4 sm:right-4 cursor-pointer touch-manipulation shadow-lg hover:shadow-xl'
        >
          <svg 
            className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Popup Content */}
        <div className='bg-gradient-to-br from-shop-light-green to-shop-dark-green p-4 sm:p-8 text-center relative overflow-hidden'>
          {/* Background decoration */}
          <div className='absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl'></div>
          <div className='absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl'></div>
          
          {/* Offer Badge */}
          <div className='relative z-10'>
            <div className='inline-block bg-shop_dark_green text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 animate-pulse shadow-lg'>
              LIMITED TIME OFFER
            </div>
            
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-shop_orange drop-shadow-lg'>
              Special Discount!
            </h2>
            <div className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-shop_dark_green drop-shadow-lg'>
              20% OFF
            </div>
            <p className='text-shop_orange mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg drop-shadow-md px-2'>
              On your first order. Use code at checkout.
            </p>
            
            {/* Discount Code */}
            <div className='bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 mb-4 sm:mb-6 border-2 border-white shadow-lg'>
              <code className='text-base sm:text-lg md:text-xl font-mono font-bold text-shop_dark_green'>FIRST20</code>
            </div>
            
            {/* Timer */}
            <div className='flex items-center justify-center gap-2 mb-4 sm:mb-6'>
              <div className='w-6 h-6 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md'>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-shop-dark-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className='text-xs sm:text-sm font-medium text-red-600 drop-shadow-md'>
                Popup expires in {timeLeft} seconds
              </span>
            </div>
            
            {/* CTA Button */}
            <button
              onClick={handleShopNow}
              className='bg-white text-shop-dark-green px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-bold hover:bg-shop-light-green hover:text-shop_orange transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-shop-light-green text-sm sm:text-base'
            >
              Shop Now
            </button>
          </div>
        </div>
        
        {/* Bottom Info */}
        <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 text-center'>
          <p className='text-xs sm:text-sm text-gray-600'>
            Valid for 15 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;
