'use client'

import React from 'react'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface SlideCartProps {
  isOpen: boolean
  onClose: () => void
}

const SlideCart: React.FC<SlideCartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      {/* Overlay */}
      <div 
        className='absolute inset-0 bg-black/20 transition-opacity'
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className='absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <ShoppingCart className='w-6 h-6 text-shop_dark_green' />
              <h2 className='text-xl font-semibold text-gray-900'>Shopping Cart</h2>
              <span className='bg-shop_dark_green text-white text-xs px-2 py-1 rounded-full'>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Cart Items */}
          <div className='flex-1 overflow-y-auto p-6'>
            <div className='text-xs text-gray-500 mb-2'>Cart items count: {cartItems.length}</div>
            {cartItems.length === 0 ? (
              <div className='text-center py-12'>
                <div className='w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center'>
                  <ShoppingCart className='w-12 h-12 text-gray-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Your cart is empty</h3>
                <p className='text-gray-600'>Add some products to get started!</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {cartItems.map((item, index) => {
                  console.log(`Rendering cart item ${index}:`, item)
                  
                  // Get the first image from gallery or main image
                  const imageSrc = item.itemType === 'product' 
                    ? (item.product?.image || '/api/placeholder/400/300')
                    : (item.deal?.images?.[0] || item.deal?.image || '/api/placeholder/400/300')
                  
                  console.log('Using image src:', imageSrc)
                  
                  return (
                  <div key={`${item.itemType}-${item.deal?.id || item.product?.id}-${index}`} className='flex gap-4 p-4 bg-gray-50 rounded-lg'>
                    {/* Product Image */}
                    <div className='w-16 h-16 bg-green-500 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center'>
                      <span className='text-white text-xs font-bold'>IMG</span>
                    </div>
                    
                    {/* Product Details */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-start mb-2'>
                        <h3 className='text-sm font-semibold text-gray-900 line-clamp-2'>
                          {item.itemType === 'product' ? item.product?.name : item.deal?.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart((item.deal?.id || item.product?.id)!, item.itemType)}
                          className='text-red-500 hover:text-red-700 p-1'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => updateQuantity((item.deal?.id || item.product?.id)!, item.quantity - 1, item.itemType)}
                            className='w-6 h-6 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <span className='text-sm font-medium text-gray-900'>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity((item.deal?.id || item.product?.id)!, item.quantity + 1, item.itemType)}
                            className='w-6 h-6 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                        </div>
                        <span className='text-sm font-semibold text-gray-900'>
                          ${((item.itemType === 'product' ? item.product?.price : item.deal?.dealPrice) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )})
              }
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className='border-t border-gray-200 p-6 bg-white'>
              {/* Total */}
              <div className='flex justify-between items-center mb-4'>
                <span className='text-lg font-semibold text-gray-900'>Total:</span>
                <span className='text-lg font-bold text-shop_dark_green'>
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              
              {/* Checkout Button */}
              <button className='w-full bg-shop_dark_green text-white py-3 rounded-lg font-semibold hover:bg-shop_dark_green/90 transition-colors'>
                Proceed to Checkout
              </button>
              
              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className='w-full mt-2 text-gray-600 py-2 hover:text-gray-800 transition-colors'
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SlideCart
