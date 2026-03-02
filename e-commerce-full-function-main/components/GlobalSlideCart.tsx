'use client'

import React from 'react'
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSlideCart } from '@/contexts/SlideCartContext'

const GlobalSlideCart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemsCount 
  } = useCart()
  
  const { isSlideCartOpen, closeSlideCart } = useSlideCart()

  const subtotal = getCartTotal()
  const totalItems = getCartItemsCount()

  if (!isSlideCartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className='fixed inset-0 z-40 transition-opacity duration-300'
        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        onClick={closeSlideCart}
      />
      
      {/* Slide Cart */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSlideCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <ShoppingCart className='w-6 h-6 text-shop_dark_green' />
            <h2 className='text-xl font-semibold text-gray-900'>
              Shopping Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeSlideCart}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Cart Items */}
        <div className='flex-1 overflow-y-auto p-6' style={{ maxHeight: 'calc(100vh - 280px)' }}>
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
              {cartItems.map((item) => {
                const currentItem = item.itemType === 'product' ? item.product : item.deal
                const itemId = item.itemType === 'product' ? item.product?.id : item.deal?.id
                
                console.log('GlobalSlideCart item:', { item, itemId, currentItem }) // Debug log
                
                return (
                <div key={`${item.itemType}-${itemId}`} className='flex gap-4 p-4 bg-gray-50 rounded-lg'>
                  {/* Product Image */}
                  <div className='w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center'>
                    <div className='w-6 h-6 bg-gray-400 rounded'></div>
                  </div>
                  
                  {/* Product Details */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='text-sm font-semibold text-gray-900 line-clamp-2'>
                        {item.itemType === 'product' ? item.product?.name : item.deal?.title}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('GlobalSlideCart Delete button clicked:', { itemId, itemType: item.itemType })
                          if (itemId) {
                            removeFromCart(itemId, item.itemType)
                          } else {
                            console.error('Cannot delete item: itemId is undefined')
                          }
                        }}
                        onMouseDown={(e) => console.log('Delete button mousedown')}
                        onMouseUp={(e) => console.log('Delete button mouseup')}
                        className='text-red-500 hover:text-red-700 p-1 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer pointer-events-auto'
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                    
                    <p className='text-xs text-gray-600 mb-2'>
                      {item.itemType === 'product' ? item.product?.category : item.deal?.category}
                      {item.itemType === 'deal' && (
                        <span className='ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium'>
                          {item.deal?.discount}% OFF
                        </span>
                      )}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('GlobalSlideCart Minus button clicked:', { itemId, currentQuantity: item.quantity, itemType: item.itemType })
                            if (itemId) {
                              const newQuantity = Math.max(1, item.quantity - 1)
                              updateQuantity(itemId, newQuantity, item.itemType)
                            } else {
                              console.error('Cannot update quantity: itemId is undefined')
                            }
                          }}
                          onMouseDown={(e) => console.log('Minus button mousedown')}
                          onMouseUp={(e) => console.log('Minus button mouseup')}
                          className='w-6 h-6 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pointer-events-auto'
                          style={{ position: 'relative', zIndex: 10 }}
                        >
                          <Minus className='w-3 h-3' />
                        </button>
                        <span className='w-8 text-center text-sm font-semibold'>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('GlobalSlideCart Plus button clicked:', { itemId, currentQuantity: item.quantity, itemType: item.itemType })
                            if (itemId) {
                              updateQuantity(itemId, item.quantity + 1, item.itemType)
                            } else {
                              console.error('Cannot update quantity: itemId is undefined')
                            }
                          }}
                          onMouseDown={(e) => console.log('Plus button mousedown')}
                          onMouseUp={(e) => console.log('Plus button mouseup')}
                          className='w-6 h-6 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pointer-events-auto'
                          style={{ position: 'relative', zIndex: 10 }}
                        >
                          <Plus className='w-3 h-3' />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className='text-right'>
                        <span className='text-sm font-bold text-shop_dark_green'>
                          ৳{(((item.itemType === 'product' ? item.product?.price : item.deal?.dealPrice) || 0) * item.quantity).toFixed(2)}
                        </span>
                        <span className='text-xs text-gray-500'>
                          ৳{item.itemType === 'product' ? item.product?.price : item.deal?.dealPrice} each
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className='border-t border-gray-200 p-6 bg-white'>
            {/* Total */}
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg font-semibold text-gray-900'>Total:</span>
              <span className='text-xl font-bold text-shop_dark_green'>
                ৳{subtotal.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              <a 
                href="/cart"
                className='w-full bg-shop_btn_dark_green text-white py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300 block text-center'
                onClick={closeSlideCart}
              >
                Proceed to Checkout
              </a>
              <button 
                className='w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors'
                onClick={closeSlideCart}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default GlobalSlideCart
