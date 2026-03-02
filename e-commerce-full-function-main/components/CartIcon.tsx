'use client'

import { ShoppingBag } from 'lucide-react'
import React from 'react'
import { useSlideCart } from '@/contexts/SlideCartContext'
import { useCart } from '@/contexts/CartContext'

const CartIcon = () => {
  const { openSlideCart } = useSlideCart()
  const { getCartItemsCount } = useCart()
  const cartItemsCount = getCartItemsCount()

  return (
    <button 
      onClick={openSlideCart}
      className='group relative hover:text-shop_light_green hoverEffect'
    >
      <ShoppingBag className='w-5 h-5'/>
      {cartItemsCount > 0 && (
        <span className='absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center '>
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </span>
      )}
    </button>
  )
}

export default CartIcon
